import './style.css'

const CONFIG = {
    GLITCH_INTERVAL_MS: 500,
    RESET_MULTIPLIER: 12
};

const elements = {
    player: document.getElementById('spotify-player'),
    socialContainer: document.querySelector('.social'),
    spinner: document.getElementById('spotify-spinner'),
    terminalReadout: document.querySelector('.terminal-readout')
};

const state = {
    currentIndex: 0,
    glitchInterval: null,
    resetInterval: null,
    prefersReducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
};

const iconElements = elements.socialContainer ? Array.from(elements.socialContainer.children) : [];
const resetIntervalMs = CONFIG.RESET_MULTIPLIER * CONFIG.GLITCH_INTERVAL_MS;

function revealSpotifyPlayer() {
    elements.spinner?.classList.add('hidden');
    elements.player?.classList.add('animate-spotify-fade-in');
}

function startTerminalReadout() {
    const readout = elements.terminalReadout;
    const output = readout?.querySelector('.terminal-readout__text');
    if (!output) return;

    const lines = ['⟦ ϟ7E ⟧', '⟦ 0x04 ⟧', '░▒▓ 4TH ▓▒░', '⫷ ∿◇∿ ⫸'];

    if (state.prefersReducedMotion) {
        output.textContent = lines[0];
        return;
    }

    let lineIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const tick = () => {
        const line = lines[lineIndex];
        if (!deleting) {
            characterIndex++;
            output.textContent = line.slice(0, characterIndex);
            if (characterIndex === line.length) {
                deleting = true;
                setTimeout(tick, 1300);
                return;
            }
        } else {
            characterIndex--;
            output.textContent = line.slice(0, characterIndex);
            if (characterIndex === 0) {
                deleting = false;
                lineIndex = (lineIndex + 1) % lines.length;
            }
        }

        setTimeout(tick, deleting ? 55 : 105);
    };

    tick();
}

startTerminalReadout();

window.onSpotifyIframeApiReady = (IFrameAPI) => {
    if (!elements.player) return;

    const spotifyUrl = elements.player.dataset.spotifyUrl;
    if (!spotifyUrl) return;

    IFrameAPI.createController(elements.player, {
      url: spotifyUrl,
      width: '100%',
      height: '152',
      theme: 'dark'
    }, controller => {
        controller.addListener('ready', revealSpotifyPlayer);
    });
};

function advanceGlitch() {
    if (state.currentIndex >= iconElements.length) {
        iconElements.forEach(icon => icon?.classList.remove('glitch'));
        return;
    }

    iconElements.forEach(icon => icon?.classList.remove('glitch'));
    iconElements[state.currentIndex]?.classList.add('glitch');
    state.currentIndex++;
}

function startGlitchSequence() {
    stopGlitchSequence();
    state.currentIndex = 0;

    state.glitchInterval = setInterval(advanceGlitch, CONFIG.GLITCH_INTERVAL_MS);
    state.resetInterval = setInterval(() => {
        state.currentIndex = 0;
    }, resetIntervalMs);
}

function stopGlitchSequence() {
    clearInterval(state.glitchInterval);
    clearInterval(state.resetInterval);
    state.glitchInterval = null;
    state.resetInterval = null;

    iconElements.forEach(icon => icon?.classList.remove('glitch'));
}

if (elements.socialContainer && !state.prefersReducedMotion) {
    elements.socialContainer.addEventListener('mouseenter', stopGlitchSequence);
    elements.socialContainer.addEventListener('mouseleave', startGlitchSequence);

    iconElements.forEach(icon => {
        if (icon) {
            icon.addEventListener('mouseenter', () => icon.classList.add('glitch'));
            icon.addEventListener('mouseleave', () => icon.classList.remove('glitch'));
        }
    });

    startGlitchSequence();
}

// Prevent mobile scrolling
document.addEventListener('touchmove', (e) => {
    if (!e.target.closest('#spotify-container')) {
        e.preventDefault();
    }
}, { passive: false });
