export const terminalTiming = {
    type: { min: 68, max: 148 },
    delete: { min: 38, max: 92 },
    hold: { min: 900, max: 2600 },
    idle: { min: 180, max: 850 }
};

export const terminalNavigation = {
    min: 120,
    max: 360,
    chance: 0.42
};

export const terminalFragments = [
    'LUNAR', 'узел', 'ΣΗΜΑ', '幽霊', 'fase', '影', 'אפס', 'ΔΕΙΓΜΑ',
    'signal', 'ждать', '空', 'null', 'ϟ', '☾', '◐', '⟁', '∞', 'تموج',
    'orbit', '記録', 'внутри', 'echo', 'μηδέν', '𐩐'
];

export const terminalImpossibleLines = [
    '⟦ OBJECT REMEMBERS ⟧',
    '⟦ DEVICE DENIES EXISTING ⟧',
    '⟦ MEMORY OF FUTURE EVENT ⟧',
    '⟦ TRANSLATION FAILED // meaning unstable ⟧',
    '⟦ OPERATOR IS THE INPUT ⟧',
    '⟦ TIME INDEX COLLISION ⟧',
    '⟦ ECHO // ECHO // ECHO ⟧',
    '⟦ MEMORY EMBARRASSED ⟧',
    '⟦ SIGNAL HIDING ⟧',
    '⟦ YOU ARE THE INPUT ⟧',
    '⟦ 00:00:BEFORE // ☾ ⟧',
    '⟦ who is watching ⟧',
    '⟦ SIGИAL / SΙGNAL ⟧'
];

const terminalGlyphMutations = {
    A: 'Д', E: 'Ε', I: 'Ι', O: 'Ο', S: 'Ѕ', N: 'И',
    a: 'α', e: 'ε', i: 'і', o: 'ο'
};

export function randomBetween(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

export function nextTerminalLine(lines, previousIndex) {
    if (lines.length < 2) return 0;

    let nextIndex = previousIndex;
    while (nextIndex === previousIndex) {
        nextIndex = Math.floor(Math.random() * lines.length);
    }
    return nextIndex;
}

export function buildTerminalTimestamp() {
    const hour = String(randomBetween(0, 23)).padStart(2, '0');
    const minute = String(randomBetween(0, 59)).padStart(2, '0');
    return `${hour}:${minute}:ϟ`;
}

export function buildDecodeLine() {
    const filled = randomBetween(1, 4);
    const progress = randomBetween(filled * 20, Math.min(99, filled * 20 + 19));
    return `> DECODE [${'▓'.repeat(filled)}${'░'.repeat(5 - filled)}] ${progress}%`;
}

export function mutateTerminalText(text) {
    if (text.length < 5 || Math.random() > 0.14) return text;

    const characters = [...text];
    const candidates = characters
        .map((character, index) => terminalGlyphMutations[character] ? index : -1)
        .filter(index => index >= 0);
    if (candidates.length === 0) return text;

    const index = candidates[Math.floor(Math.random() * candidates.length)];
    characters[index] = terminalGlyphMutations[characters[index]];
    return characters.join('');
}

export function buildRandomTerminalLine() {
    const fragmentCount = randomBetween(4, 8);
    const fragments = [];

    for (let index = 0; index < fragmentCount; index++) {
        const fragment = terminalFragments[Math.floor(Math.random() * terminalFragments.length)];
        const separator = index > 0 && Math.random() < 0.3 ? `${['·', '::', '→', '／'][randomBetween(0, 3)]}` : ' ';
        fragments.push(`${separator}${fragment}`);
    }

    const punctuation = ['…', ' //', ' ::', ' ⟧', ' ϟ', ' ?'][randomBetween(0, 5)];
    return `⟦ ${fragments.join('')}${punctuation} ⟧`;
}

export function createTerminalLine(factory) {
    if (Math.random() < 0.08) return '⟦ WARNING: OBJECT INSIDE ⟧';
    if (Math.random() < 0.08) {
        return terminalImpossibleLines[Math.floor(Math.random() * terminalImpossibleLines.length)];
    }
    if (Math.random() < 0.12) return buildRandomTerminalLine();
    return factory();
}

export function getCommandResponse(line) {
    if (line.startsWith('> TRACE')) return '↳ TRACE LOCKED // ☾';
    if (line.startsWith('> DECODE')) return '↳ PHASE MAP // ◐';
    if (line.startsWith('> LISTEN')) return '↳ SIGNAL RETURNED // ϟ';
    if (line.startsWith('> OPEN PHASE')) return '↳ ΣΗΜΑ: ΑΣΤΑΘΕΣ';
    if (line.startsWith('> uname')) return '↳ LUNAR-CORE // ONLINE';
    if (line.startsWith('> ps -aux')) return '↳ ϟϟϟ // 1 PROCESS';
    if (line.startsWith('> mount')) return '↳ /dev/moon: ATTACHED';
    if (line.startsWith('> whoami')) return '↳ OPERATOR: UNKNOWN // OK';
    if (line.startsWith('> cat /etc/orbit')) return '↳ ☾ ORBIT TABLE // READ';
    if (line.startsWith('> ping')) return '↳ PONG // ϟ 04ms';
    if (line.startsWith('> sync')) return '↳ GHOST BUFFER: SYNCED';
    if (line.startsWith('fn ')) return '↳ ◐ // RETURNED';
    if (line.startsWith('λ ')) return '↳ PHASE SHIFT: OK';
    if (line.startsWith('invoke(')) return '↳ UNKNOWN // WAIT';
    return null;
}

export function getTransmissionResponse(line) {
    if (line.startsWith('>') || Math.random() > 0.52) return null;

    const responses = [
        '↳ PACKET ACCEPTED // ◐',
        '↳ SIGNAL CAST // ϟ',
        '↳ ECHO RETURNED // ☾',
        '↳ GLYPH STREAM: OK',
        '↳ UNKNOWN TONGUE // PASS'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

export const terminalLineFactories = [
    () => `> TRACE // ${Math.random() < 0.16 ? '00:00:BEFORE' : buildTerminalTimestamp()}`,
    () => '⟦ ☾ ORBITAL DESYNC // 07 ⟧',
    () => '⟦ ◐ ЛУННЫЙ УЗЕЛ // 07 ⟧',
    () => '⟦ ☿ ΣΗΜΑ: ΑΣΤΑΘΕΣ ⟧',
    () => '⟦ ✶ 信号幽霊 // ϟϟϟ ⟧',
    () => '⟦ ◒ 未知の物体: LISTENING ⟧',
    () => '⟦ ⟁ ASTRAL TIDE // NULL ⟧',
    () => buildDecodeLine(),
    () => '> LISTEN // ϟϟϟ',
    () => '> OPEN PHASE // ΣΗΜΑ',
    () => '> uname -a // LUNAR-CORE',
    () => '> ps -aux // ϟϟϟ',
    () => '> mount /dev/moon',
    () => '> whoami // UNKNOWN',
    () => '> cat /etc/orbit',
    () => '> ping -c 1 ☾',
    () => '> sync --ghost',
    () => 'fn astral_fold() => ◐',
    () => 'λ phase_shift(◐) => OK',
    () => 'invoke(unknown) :: WAIT',
    () => '...ARCHIVE // DON\'T LOOK...',
    () => '⟦ MEMORY: 信号幽霊 ⟧',
    () => buildRandomTerminalLine()
];
