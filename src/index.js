import 'particles.js';
import socialFacebook from '@iconify/icons-simple-line-icons/social-facebook';
import socialSoundcloud from '@iconify/icons-simple-line-icons/social-soundcloud';
import socialInstagram from '@iconify/icons-simple-line-icons/social-instagram';
import socialYoutube from '@iconify/icons-simple-line-icons/social-youtube';
import SVGAnim from "snapsvg-animator";
import "snapsvg-cjs";
import Iconify from '@iconify/iconify';

import classes from './index.scss';
import particlesJSON from './particles.json';
import logo from './logo.json';
import iconGlitch from './iconGlitch';



particlesJS("particles-js", particlesJSON);
const container = document.getElementById('logo');
const svg = new SVGAnim(logo, 200, 220, 40);
container.appendChild(svg.s.node);
