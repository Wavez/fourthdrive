import { TaskTimer } from 'tasktimer';
const social = document.querySelector(".social");
const icons = social.children;
const iconsLength = icons.length;
let animatedNode = 0;
const timer = new TaskTimer(500);
timer.add([
    {
        id: 'reset-counter',       // unique ID of the task
        tickInterval: 12,    // run every 5 ticks (5 x interval = 5000 ms)
        totalRuns: 0,      // run 10 times only. (set to 0 for unlimited times)
        callback(task) {
            animatedNode = 0;
        }
    },
    {
        id: 'icon-glitch',       // unique ID of the task
        tickInterval: 1,    // run every 5 ticks (5 x interval = 5000 ms)
        totalRuns: 0,      // run 10 times only. (set to 0 for unlimited times)
        callback(task) {
            // code to be executed on each run
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

// You can also execute some code on each tick... (every 1000 ms)
timer.on('tick', () => {
    console.log('tick count: ' + timer.tickCount);
    console.log('elapsed time: ' + timer.time.elapsed + ' ms.');
    // stop timer (and all tasks) after 1 hour
    if (timer.tickCount >= 3600000) timer.stop();
});

// Start the timer
timer.start();

 
social.addEventListener("mouseenter", (e) => { 
    intervalManager(false);
});
social.addEventListener("mouseleave", (e) => { 
    intervalManager(true, iconSwitch, 4000);
});

 

export default () => { };