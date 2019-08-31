
const social = document.querySelector(".social");
const icons = social.children;

const iconsSum = icons.length;
const resolution = 500;
let tick = 0;
const tickEnd = 10;

const glitch = () => {
    if (tick === tickEnd) {
        tick = 0;
    }
    if (tick === iconsSum){
        icons[tick - 1].classList.remove("glitch");
    }
    if (tick < iconsSum) {
        icons[tick].classList.add("glitch");
        if (tick > 0) {
            icons[tick - 1].classList.remove("glitch");
        }
    }
    ++tick;
}


let intervalID;

const intervalManager = (flag) => {
    if (flag) {
        setTimeout(intervalID = setInterval(glitch, resolution), 4000);
    }
    else {
        let hovered = document.querySelector(".glitch");
        if (hovered && hovered.classList) {
            hovered.classList.remove("glitch");
            clearInterval(intervalID);
        }
    }

}


social.addEventListener("mouseenter", (e) => {
    intervalManager(false);
});
social.addEventListener("mouseleave", (e) => {
    intervalManager(true);
});

intervalManager(true);


export default () => { };