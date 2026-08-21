const GLITCH_INTERVAL_MS = 500;
const RESET_MULTIPLIER = 12;

let currentIndex = 0;
let glitchInterval = null;
let resetInterval = null;
let icons = [];
let listenersAttached = false;

export function stopSocialGlitch() {
    clearInterval(glitchInterval);
    clearInterval(resetInterval);
    glitchInterval = null;
    resetInterval = null;
    icons.forEach(icon => icon?.classList.remove('glitch'));
}

export function startSocialGlitch({ container, prefersReducedMotion }) {
    if (!container || prefersReducedMotion) return;

    stopSocialGlitch();
    icons = Array.from(container.children);
    currentIndex = 0;

    const advanceGlitch = () => {
        if (currentIndex >= icons.length) {
            icons.forEach(icon => icon?.classList.remove('glitch'));
            return;
        }

        icons.forEach(icon => icon?.classList.remove('glitch'));
        icons[currentIndex]?.classList.add('glitch');
        currentIndex++;
    };

    glitchInterval = setInterval(advanceGlitch, GLITCH_INTERVAL_MS);
    resetInterval = setInterval(() => {
        currentIndex = 0;
    }, RESET_MULTIPLIER * GLITCH_INTERVAL_MS);

    if (listenersAttached) return;
    listenersAttached = true;
    container.addEventListener('mouseenter', stopSocialGlitch);
    container.addEventListener('mouseleave', () => startSocialGlitch({ container, prefersReducedMotion }));
    icons.forEach(icon => {
        icon?.addEventListener('mouseenter', () => icon.classList.add('glitch'));
        icon?.addEventListener('mouseleave', () => icon.classList.remove('glitch'));
    });
}
