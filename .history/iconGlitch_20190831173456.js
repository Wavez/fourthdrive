const icons = document.querySelectorAll(".social a");
let iconTick = 1;
const timer = new TaskTimer(500);
timer.add([
    {
        id: 'task-1',       // unique ID of the task
        tickInterval: 1,    // run every 5 ticks (5 x interval = 5000 ms)
        totalRuns: 0,      // run 10 times only. (set to 0 for unlimited times)
        callback(task) {
            // code to be executed on each run
            console.log(`${task.id} task has run ${task.currentRuns} times.`);
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

export default () => {};