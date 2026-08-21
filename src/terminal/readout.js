import {
    createTerminalLine,
    getCommandResponse,
    getTransmissionResponse,
    mutateTerminalText,
    nextTerminalLine,
    randomBetween,
    terminalLineFactories,
    terminalNavigation,
    terminalTiming
} from './content.js';

let terminalTimer = null;

export function stopTerminalReadout() {
    clearTimeout(terminalTimer);
    terminalTimer = null;
}

function selectRandomTerminalWord(output, line) {
    if (Math.random() > 0.38) return;

    const words = line.split(' ');
    const selectedIndex = Math.floor(Math.random() * words.length);
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
        const token = document.createElement('span');
        token.className = index === selectedIndex ? 'terminal-word terminal-word--selected' : 'terminal-word';
        token.textContent = word;
        fragment.append(token);

        if (index < words.length - 1) {
            fragment.append(document.createTextNode(' '));
        }
    });

    output.replaceChildren(fragment);
}

function simulateTerminalNavigation(output, commandHistory, schedule, onComplete) {
    if (commandHistory.length < 2 || Math.random() > terminalNavigation.chance) return false;

    let historyIndex = commandHistory.length - 2;
    let step = 0;

    const navigate = () => {
        const direction = Math.random() < 0.5 ? -1 : 1;
        historyIndex = (historyIndex + direction + commandHistory.length - 1) % (commandHistory.length - 1);
        const recalledLine = commandHistory[historyIndex];
        output.textContent = recalledLine;

        if (Math.random() < 0.55) selectRandomTerminalWord(output, recalledLine);

        step++;
        if (step < 3 || Math.random() < 0.72) {
            schedule(navigate, randomBetween(terminalNavigation.min, terminalNavigation.max));
        } else {
            onComplete();
        }
    };

    schedule(navigate, randomBetween(terminalNavigation.min, terminalNavigation.max));
    return true;
}

export function startTerminalReadout({ output, prefersReducedMotion }) {
    if (!output) return;

    stopTerminalReadout();

    if (prefersReducedMotion) {
        output.textContent = terminalLineFactories[0]();
        return;
    }

    output.replaceChildren();
    let lineIndex = nextTerminalLine(terminalLineFactories, -1);
    let line = createTerminalLine(terminalLineFactories[lineIndex]);
    const commandHistory = [];
    let characterIndex = 0;
    let deleting = false;
    let commandResponse = false;
    let correctionMode = false;
    let correctionTarget = 0;
    let correctionUsed = false;
    let correctionPoint = randomBetween(8, Math.max(8, line.length - 6));

    const scheduleTerminalPhase = (callback, delay) => {
        terminalTimer = setTimeout(() => {
            terminalTimer = null;
            callback();
        }, delay);
    };

    const beginNextTerminalLine = (delay = randomBetween(terminalTiming.idle.min, terminalTiming.idle.max)) => {
        output.textContent = '';
        lineIndex = nextTerminalLine(terminalLineFactories, lineIndex);
        line = createTerminalLine(terminalLineFactories[lineIndex]);
        characterIndex = 0;
        deleting = false;
        commandResponse = false;
        correctionMode = false;
        correctionUsed = false;
        correctionPoint = randomBetween(8, Math.max(8, line.length - 6));
        scheduleTerminalPhase(tick, delay);
    };

    const tick = () => {
        if (!deleting) {
            characterIndex++;
            output.textContent = mutateTerminalText(line.slice(0, characterIndex));
            if (characterIndex === line.length) {
                selectRandomTerminalWord(output, line);
                if (commandResponse) {
                    commandResponse = false;
                    scheduleTerminalPhase(
                        () => beginNextTerminalLine(),
                        randomBetween(terminalTiming.hold.min, terminalTiming.hold.max)
                    );
                    return;
                }

                const commandResponseText = getCommandResponse(line);
                const response = commandResponseText ?? getTransmissionResponse(line);
                if (response) {
                    const submittedLine = line;
                    const beginResponse = () => {
                        line = response;
                        characterIndex = 0;
                        deleting = false;
                        commandResponse = true;
                        output.textContent = '';
                        tick();
                    };

                    if (!commandResponseText) {
                        scheduleTerminalPhase(beginResponse, randomBetween(terminalTiming.hold.min, terminalTiming.hold.max));
                        return;
                    }

                    commandHistory.push(line);
                    if (commandHistory.length > 12) commandHistory.shift();

                    if (simulateTerminalNavigation(
                        output,
                        commandHistory,
                        scheduleTerminalPhase,
                        () => {
                            output.textContent = submittedLine;
                            scheduleTerminalPhase(beginResponse, randomBetween(terminalTiming.hold.min, terminalTiming.hold.max));
                        }
                    )) return;

                    scheduleTerminalPhase(beginResponse, randomBetween(terminalTiming.hold.min, terminalTiming.hold.max));
                    return;
                }

                deleting = true;
                scheduleTerminalPhase(tick, randomBetween(terminalTiming.hold.min, terminalTiming.hold.max));
                return;
            }

            if (!correctionUsed && characterIndex >= correctionPoint && Math.random() < 0.2) {
                correctionMode = true;
                correctionUsed = true;
                correctionTarget = Math.max(2, characterIndex - randomBetween(2, 5));
                deleting = true;
                scheduleTerminalPhase(tick, randomBetween(terminalTiming.delete.min, terminalTiming.delete.max));
                return;
            }
        } else {
            characterIndex--;
            output.textContent = line.slice(0, characterIndex);

            if (correctionMode && characterIndex <= correctionTarget) {
                correctionMode = false;
                deleting = false;
                scheduleTerminalPhase(tick, randomBetween(terminalTiming.idle.min, terminalTiming.idle.max));
                return;
            }

            if (characterIndex === 0) {
                beginNextTerminalLine();
                return;
            }
        }

        const timing = deleting ? terminalTiming.delete : terminalTiming.type;
        scheduleTerminalPhase(tick, randomBetween(timing.min, timing.max));
    };

    tick();
}
