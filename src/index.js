import './style.css'

const CONFIG = {
    GLITCH_INTERVAL_MS: 500,
    RESET_MULTIPLIER: 12
};

const elements = {
    iframe: document.getElementById('spotify-player'),
    socialContainer: document.querySelector('.social'),
    spinner: document.getElementById('spotify-spinner')
};

const state = {
    currentIndex: 0,
    glitchInterval: null,
    resetInterval: null,
    prefersReducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
};

const iconElements = elements.socialContainer ? Array.from(elements.socialContainer.children) : [];
const resetIntervalMs = CONFIG.RESET_MULTIPLIER * CONFIG.GLITCH_INTERVAL_MS;

elements.iframe?.addEventListener('load', () => {
    elements.spinner?.classList.add('hidden');
    elements.iframe.classList.add('animate-spotify-fade-in');
});

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

