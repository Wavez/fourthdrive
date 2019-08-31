import { TaskTimer } from 'tasktimer';
const icons = document.querySelectorAll(".social a");
const iconsLength = icons.length;
let iconNode = 0;
const timer = new TaskTimer(500);
timer.add([
    {
        id: 'reset-counter',       // unique ID of the task
        tickInterval: 12,    // run every 5 ticks (5 x interval = 5000 ms)
        totalRuns: 0,      // run 10 times only. (set to 0 for unlimited times)
        callback(task) {
            iconNode = 0;
        }
    },
    {
        id: 'icon-glitch',       // unique ID of the task
        tickInterval: 1,    // run every 5 ticks (5 x interval = 5000 ms)
        totalRuns: 0,      // run 10 times only. (set to 0 for unlimited times)
        callback(task) {
            // code to be executed on each run
            if (iconNode <= iconsLength) {
                if (iconNode === iconsLength) {
                    icons[iconsLength-1].classList.remove("glitch");
                }
                else {
                    icons[iconNode].classList.add("glitch");
                    if (iconNode > 0) {
                        icons[iconNode - 1].classList.remove("glitch");
                    }
                    ++iconNode;
                }
            }
        }
    }

]);

// You can also execute some code on each tick... (every 1000 ms)
timer.on('tick', () => {
    console.log('tick count: ' + timer.tickCount);
    console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
    // stop timer (and all tasks) after 1 hour
    if (timer.tickCount >= 3600000) timer.stop();
});

// Start the timer
timer.start();

/* const iconSwitch = () => {
    const icons = document.querySelectorAll(".social a");
    let i = 0;
    const glitchOrder = setInterval(() => {
        console.log(i);
        if (i === 4) {
            icons[3].classList.remove("glitch");
            clearInterval(glitchOrder);
        }
        else {
            icons[i].classList.add("glitch");
            if (i > 0) {
                icons[i - 1].classList.remove("glitch");
            }
            ++i;
        }

    }, 500);
} */


/* 
const social = document.querySelector(".social");
social.addEventListener("mouseenter", (e) => { 
    intervalManager(false);
});
social.addEventListener("mouseleave", (e) => { 
    intervalManager(true, iconSwitch, 4000);
});

 */

export default () => { };