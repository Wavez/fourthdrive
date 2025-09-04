import './style.css'

// Configuration
const CONFIG = {
    GLITCH_INTERVAL_MS: 500,
    RESET_MULTIPLIER: 12
};

// DOM elements
const elements = {
    iframe: document.getElementById('spotify-player'),
    socialContainer: document.querySelector(".social")
};

// State
const state = {
    currentIndex: 0,
    glitchInterval: null,
    resetInterval: null,
    prefersReducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
};

// Derived values
const iconElements = elements.socialContainer ? Array.from(elements.socialContainer.children) : [];
const resetIntervalMs = CONFIG.RESET_MULTIPLIER * CONFIG.GLITCH_INTERVAL_MS;

// Spotify player initialization
elements.iframe?.addEventListener('load', () => {
    elements.iframe.classList.add('animate-spotify-fade-in');
});

// Glitch animation functions
function advanceGlitch() {
    if (state.currentIndex >= iconElements.length) {
        iconElements[iconElements.length - 1]?.classList.remove("glitch");
        return;
    }

    const currentIcon = iconElements[state.currentIndex];
    const previousIcon = iconElements[state.currentIndex - 1];

    currentIcon?.classList.add("glitch");
    previousIcon?.classList.remove("glitch");

    state.currentIndex++;
}

function startGlitchSequence() {
    stopGlitchSequence(); // Prevent duplicates
    
    // Reset to start immediately
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

    const lastIcon = iconElements[state.currentIndex - 1];
    lastIcon?.classList.remove("glitch");
}

// Initialize glitch animations if conditions are met
if (elements.socialContainer && !state.prefersReducedMotion) {
    elements.socialContainer.addEventListener("mouseenter", stopGlitchSequence);
    elements.socialContainer.addEventListener("mouseleave", startGlitchSequence);
    startGlitchSequence();
}

