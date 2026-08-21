const STATUS_CYCLE_INTERVAL_MS = 2800;
const statusGlyphs = ['⟟ 04', '☾ ϟ 04', '⟡ 𐩐 04', '◌ ⟁ 04', '☽ ⟐ 04', '⟒ 04'];
const lunarPhases = ['◐', '◑', '◒', '◓', '●', '◒'];
const lunarPhaseLabels = ['waxing crescent', 'first quarter', 'waxing gibbous', 'full moon', 'waning gibbous', 'last quarter'];

let statusCycleInterval = null;
let statusIndex = 0;

export function stopStatusCycle() {
    clearInterval(statusCycleInterval);
    statusCycleInterval = null;
}

export function startStatusCycle({ glyph, phase, prefersReducedMotion }) {
    if (!glyph || !phase) return;

    stopStatusCycle();
    const cycleStatusLine = () => {
        const index = statusIndex % statusGlyphs.length;
        glyph.textContent = statusGlyphs[index];
        phase.textContent = lunarPhases[index % lunarPhases.length];
        phase.parentElement?.setAttribute('aria-label', `Lunar phase: ${lunarPhaseLabels[index % lunarPhaseLabels.length]}`);
        statusIndex++;
    };

    cycleStatusLine();
    if (!prefersReducedMotion) {
        statusCycleInterval = setInterval(cycleStatusLine, STATUS_CYCLE_INTERVAL_MS);
    }
}
