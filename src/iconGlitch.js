import { TaskTimer } from 'tasktimer';
const social = document.querySelector(".social");
const icons = social.children;
const iconsLength = icons.length;
let animatedNode = 0;
const timer = new TaskTimer(500);
timer.add([
    {
        id: 'reset-counter',      
        tickInterval: 12,
        totalRuns: 0,
        callback(task) {
            animatedNode = 0;
        }
    },
    {
        id: 'icon-glitch',
        tickInterval: 1,
        totalRuns: 0,
        callback(task) {
            if (animatedNode <= iconsLength) {
                if (animatedNode === iconsLength) {
                    icons[iconsLength-1].classList.remove("glitch");
                }
                else {
                    icons[animatedNode].classList.add("glitch");
                    if (animatedNode > 0) {
                        icons[animatedNode - 1].classList.remove("glitch");
                    }
                    ++animatedNode;
                }
            }
        }
    }

]);

timer.on(TaskTimer.Event.STOPPED, () => {
    if (icons[animatedNode-1]){
        icons[animatedNode-1].classList.remove("glitch");
    }
});
timer.on(TaskTimer.Event.STARTED, () => {
    animatedNode = 0;
});

timer.start();

 
social.addEventListener("mouseenter", (e) => { 
    timer.stop();
});
social.addEventListener("mouseleave", (e) => { 
    timer.start();
});

 

export default () => { };