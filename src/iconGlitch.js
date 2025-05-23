const socialContainer = document.querySelector(".social");
const iconElements = Array.from(socialContainer.children);
const GLITCH_INTERVAL_MS = 500;
const RESET_INTERVAL_MS = 12 * GLITCH_INTERVAL_MS;

let currentIndex = 0;
let glitchInterval = null;
let resetInterval = null;

function advanceGlitch() {
    if (currentIndex >= iconElements.length) {
        iconElements[iconElements.length - 1]?.classList.remove("glitch");
        return;
    }

    const currentIcon = iconElements[currentIndex];
    const previousIcon = iconElements[currentIndex - 1];

    currentIcon?.classList.add("glitch");
    previousIcon?.classList.remove("glitch");

    currentIndex++;
}

function startGlitchSequence() {
    stopGlitchSequence(); // Prevent duplicates

    glitchInterval = setInterval(advanceGlitch, GLITCH_INTERVAL_MS);
    resetInterval = setInterval(() => {
        currentIndex = 0;
    }, RESET_INTERVAL_MS);
}

function stopGlitchSequence() {
    clearInterval(glitchInterval);
    clearInterval(resetInterval);
    glitchInterval = null;
    resetInterval = null;

    const lastIcon = iconElements[currentIndex - 1];
    lastIcon?.classList.remove("glitch");
}

socialContainer.addEventListener("mouseenter", stopGlitchSequence);
socialContainer.addEventListener("mouseleave", startGlitchSequence);

startGlitchSequence();

export default () => {};
