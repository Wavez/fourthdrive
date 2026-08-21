import './style.css';
import { startTerminalReadout, stopTerminalReadout } from './terminal/readout.js';
import { startStatusCycle, stopStatusCycle } from './status-cycle.js';
import { setupSpotify } from './spotify.js';
import { startSocialGlitch, stopSocialGlitch } from './social-glitch.js';

const elements = {
    player: document.getElementById('spotify-player'),
    socialContainer: document.querySelector('.social'),
    spinner: document.getElementById('spotify-spinner'),
    terminalReadout: document.querySelector('.terminal-readout'),
    statusGlyph: document.querySelector('.status-glyph__text'),
    lunarPhase: document.querySelector('.lunar-phase')
};

const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

startTerminalReadout({
    output: elements.terminalReadout?.querySelector('.terminal-readout__text'),
    prefersReducedMotion
});
startStatusCycle({
    glyph: elements.statusGlyph,
    phase: elements.lunarPhase,
    prefersReducedMotion
});
setupSpotify({ player: elements.player, spinner: elements.spinner });
startSocialGlitch({ container: elements.socialContainer, prefersReducedMotion });

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        stopTerminalReadout();
        stopStatusCycle();
        stopSocialGlitch();
    });
}

document.addEventListener('touchmove', (event) => {
    if (!event.target.closest('#spotify-container')) {
        event.preventDefault();
    }
}, { passive: false });
