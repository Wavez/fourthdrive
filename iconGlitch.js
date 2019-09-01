const iconSwitch = () => {
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
}


let intervalID;

const intervalManager = (flag, fnc, time) => {
   if(flag)
     intervalID =  setInterval(fnc, time);
   else
     clearInterval(intervalID);
}

const social = document.querySelector(".social");
social.addEventListener("mouseenter", (e) => { 
    intervalManager(false);
});
social.addEventListener("mouseleave", (e) => { 
    intervalManager(true, iconSwitch, 4000);
});

intervalManager(true, iconSwitch, 4000);


export default () => {};