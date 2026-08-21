import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
    buildRandomTerminalLine,
    getCommandResponse,
    getTransmissionResponse,
    nextTerminalLine
} from '../src/terminal/content.js';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/style.css', import.meta.url), 'utf8');
const script = await readFile(new URL('../src/index.js', import.meta.url), 'utf8');
const terminalContent = await readFile(new URL('../src/terminal/content.js', import.meta.url), 'utf8');
const terminalReadout = await readFile(new URL('../src/terminal/readout.js', import.meta.url), 'utf8');
const statusCycle = await readFile(new URL('../src/status-cycle.js', import.meta.url), 'utf8');
const socialGlitch = await readFile(new URL('../src/social-glitch.js', import.meta.url), 'utf8');
const spotify = await readFile(new URL('../src/spotify.js', import.meta.url), 'utf8');
const terminalScript = `${terminalContent}\n${terminalReadout}`;
const logo = await readFile(new URL('../public/logo.svg', import.meta.url), 'utf8');

test('homepage keeps the existing media and logo inside the terminal shell', () => {
    assert.match(html, /<title>Fourth Drive — Techno Producer &amp; Modular Synths<\/title>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/fourthdrive\.com\/"\/>/);
    assert.doesNotMatch(html, /<meta name="keywords"/);
    assert.match(html, /"@type": "MusicGroup"/);
    assert.match(html, /class="terminal-shell"/);
    assert.match(html, /class="spacetime-grid"/);
    assert.match(html, /class="site-status"/);
    assert.match(html, /<header class="site-status" aria-hidden="true">/);
    assert.match(html, /class="status-glyph__text"/);
    assert.match(html, /class="lunar-phase"/);
    assert.match(html, /class="terminal-readout"/);
    assert.match(html, /aria-label="Lunar phase: waxing crescent"/);
    assert.match(html, /id="logo"/);
    assert.match(html, /class="logo-frame"/);
    assert.match(html, /<div id="logo"[\s\S]*<div class="logo-frame">/);
    assert.doesNotMatch(html, /<div id="logo" class="logo-frame"/);
    assert.match(html, /class="frame-runner"/);
    assert.match(html, /class="frame-runner frame-runner--reverse"/);
    assert.match(html, /id="spotify-player"/);
    assert.match(html, /data-spotify-url=/);
    assert.match(html, /iframe-api\/v1/);
    assert.doesNotMatch(html, /<iframe id="spotify-player"/);
    assert.match(html, /class="player-viewport"/);
    assert.match(html, /class="player-scanline"/);
    assert.match(html, /class="spotify-tint"/);
    assert.match(html, /class="social"/);
});

test('bunker atmosphere is CSS-only and respects reduced motion', () => {
    assert.match(css, /--bunker-/);
    assert.match(css, /--bunker-ink:/);
    assert.match(css, /--bunker-paper:/);
    assert.match(css, /--bunker-olive:/);
    assert.match(css, /--bunker-signal:/);
    assert.match(css, /\.terminal-shell::before/);
    assert.match(css, /@keyframes logo-frame-motion/);
    assert.match(css, /@keyframes frame-runner/);
    assert.match(css, /frame-runner 14s ease-in-out infinite reverse/);
    assert.match(css, /spotify-tint/);
    assert.match(css, /\.spotify-tint[^}]*opacity: 0\.38/s);
    assert.match(css, /prefers-reduced-motion: reduce/);
    assert.match(css, /@keyframes glyph-orbit/);
    assert.match(css, /@keyframes grid-warp/);
    assert.match(css, /background-size: 42px 42px/);
    assert.match(css, /terminal-readout__cursor/);
    assert.doesNotMatch(css, /chromatic-degradation/);
    assert.match(css, /\.signal-status \.lunar-phase[^}]*box-shadow: none/s);
    assert.match(css, /\.signal-status \.lunar-phase[^}]*width: 1\.25rem/s);
    assert.match(css, /\.signal-status \.lunar-phase[^}]*font-size: 1\.05rem/s);
    assert.match(css, /\.site-status > span[^}]*flex: 1 1 0/s);
    assert.match(css, /\.status-glyph--center[^}]*justify-content: center/s);
});

test('terminal readout keeps one cancellable timer', () => {
    assert.match(terminalReadout, /terminalTimer = null/);
    assert.match(terminalReadout, /clearTimeout\(terminalTimer\)/);
    assert.match(terminalReadout, /scheduleTerminalPhase\(tick/);
    assert.match(terminalReadout, /beginNextTerminalLine/);
    assert.match(terminalScript, /ORBITAL DESYNC/);
    assert.match(terminalScript, /ЛУННЫЙ УЗЕЛ/);
    assert.match(terminalScript, /未知の物体/);
    assert.match(terminalScript, /☾|◐|◒/);
    assert.match(terminalScript, /ЛУННЫЙ|ΣΗΜΑ|信号幽霊/);
    assert.match(terminalScript, /Math\.random\(\)/);
    assert.match(terminalScript, /nextTerminalLine/);
    assert.match(terminalScript, /terminalTiming/);
    assert.match(terminalReadout, /correctionMode/);
    assert.match(terminalReadout, /correctionTarget/);
    assert.match(terminalReadout, /selectRandomTerminalWord/);
    assert.match(css, /\.terminal-word--selected/);
    assert.match(terminalContent, /> TRACE/);
    assert.match(terminalContent, /DECODE/);
    assert.match(terminalContent, /ARCHIVE \/\/ DON/);
    assert.match(terminalContent, /WARNING: OBJECT INSIDE/);
    assert.match(terminalContent, /terminalLineFactories/);
    assert.match(terminalContent, /> whoami/);
    assert.match(terminalContent, /> cat \/etc\/orbit/);
    assert.match(terminalReadout, /commandResponse/);
    assert.match(terminalReadout, /output\.textContent = ''/);
    assert.match(terminalContent, /getTransmissionResponse/);
    assert.match(terminalContent, /PACKET ACCEPTED|SIGNAL CAST|ECHO RETURNED/);
    assert.match(terminalContent, /meaning unstable|DEVICE DENIES EXISTING|MEMORY OF FUTURE EVENT/);
    assert.match(terminalContent, /terminalImpossibleLines/);
    assert.match(terminalContent, /mutateTerminalText/);
    assert.match(terminalContent, /00:00:BEFORE/);
    assert.match(terminalContent, /YOU ARE THE INPUT/);
    assert.match(terminalContent, /ECHO \/\/ ECHO/);
    assert.match(terminalContent, /MEMORY EMBARRASSED/);
    assert.match(terminalContent, /SIGИAL|SΙGNAL/);
    assert.match(terminalContent, /buildRandomTerminalLine/);
    assert.match(terminalContent, /terminalFragments/);
    assert.match(terminalReadout, /getCommandResponse/);
    assert.match(terminalContent, /↳/);
    assert.match(terminalReadout, /commandHistory/);
    assert.match(terminalReadout, /simulateTerminalNavigation/);
    assert.match(terminalContent, /terminalNavigation/);
    assert.match(terminalReadout, /step < 3/);
    assert.match(terminalReadout, /Math\.random\(\) < 0\.72/);
    assert.match(terminalReadout, /terminal-word--selected/);
    assert.match(terminalReadout, /commandHistory\.length > 12/);
    assert.doesNotMatch(css, /terminal-readout__history/);
});

test('status line cycles alien glyphs and lunar phases', () => {
    assert.match(statusCycle, /statusGlyphs/);
    assert.match(statusCycle, /lunarPhases/);
    assert.match(statusCycle, /statusCycleInterval = null/);
    assert.match(statusCycle, /clearInterval\(statusCycleInterval\)/);
    assert.match(statusCycle, /setInterval\(cycleStatusLine, STATUS_CYCLE_INTERVAL_MS\)/);
});

test('page integrations have focused lifecycle modules', () => {
    assert.match(script, /startTerminalReadout/);
    assert.match(script, /setupSpotify/);
    assert.match(script, /startStatusCycle/);
    assert.match(script, /startSocialGlitch/);
    assert.match(socialGlitch, /startSocialGlitch/);
    assert.match(socialGlitch, /stopSocialGlitch/);
    assert.match(spotify, /setupSpotify/);
});

test('terminal content helpers keep their contracts', () => {
    assert.equal(nextTerminalLine(['only'], 0), 0);
    assert.notEqual(nextTerminalLine(['first', 'second'], 0), 0);
    assert.equal(getCommandResponse('> whoami // UNKNOWN'), '↳ OPERATOR: UNKNOWN // OK');
    assert.equal(getTransmissionResponse('> not-a-transmission'), null);
    assert.match(buildRandomTerminalLine(), /^⟦ .+ ⟧$/);
});

test('logo animation adds breathing, eye focus, and power-cycle motion', () => {
    assert.match(logo, /id="cloud"/);
    assert.match(logo, /id="cloud-rain"/);
    assert.match(logo, /id="text-lockup"/);
    assert.doesNotMatch(logo, /id="text-scanline"/);
    assert.match(logo, /id="eye-inner"/);
    assert.match(logo, /@keyframes cloud-pressure/);
    assert.match(logo, /stroke="#d7ec99" stroke-width="1\.5"/);
    assert.match(logo, /<path d="M43,58 c1\.6,3\.2 1\.9,5\.4 1\.9,6\.6 a1\.9,1\.9 0 1,1 -3\.8,0 c0,-1\.2 0\.3,-3\.4 1\.9,-6\.6 z" \/>/);
    assert.match(logo, /#cloud-rain path/);
    assert.match(logo, /@keyframes cloud-rain-fall/);
    assert.match(logo, /transform: translateY\(120px\)/);
    assert.match(logo, /path:nth-child\(4\).*0\.5s/s);
    assert.match(logo, /path:nth-child\(6\).*3s/s);
    assert.match(logo, /scale\(1\.08, 1\.02\)/);
    assert.match(logo, /@keyframes eye-focus/);
    assert.match(logo, /@keyframes tear-fall/);
    assert.match(logo, /@keyframes spinner[\s\S]*scale\(1\.12\)/);
    assert.match(logo, /@keyframes bone-twitch/);
    assert.match(logo, /@keyframes bones[\s\S]*scaleX\(1\.05\)/);
    assert.match(logo, /@keyframes text-signal/);
    assert.match(logo, /@keyframes glyph-float/);
    assert.doesNotMatch(logo, /@keyframes text-scan/);
    assert.doesNotMatch(logo, /id="text-crawler"/);
    assert.doesNotMatch(logo, /id="text-distortion-layer"/);
    assert.doesNotMatch(logo, /feDisplacementMap/);
    assert.doesNotMatch(logo, /spinner-pulse/);
    assert.match(logo, /animation: cloud-pressure/);
    assert.match(logo, /eye-focus 4\.6s/);
    assert.match(logo, /animation: tear-fall/);
    assert.doesNotMatch(logo, /@keyframes power-surge/);
    assert.match(logo, /animation: text-signal/);
    assert.match(logo, /#text-lockup \.shape-fill/);
    assert.match(logo, /translateY\(-1\.4px\)/);
});
