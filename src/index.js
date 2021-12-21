class Timer{
    #startTime;
    #stopTime;
    #durationLeftInSeconds;
    #countdownID;
    #pause = false;
    #start = false;

    constructor(display, startBtn, pauseBtn, stopBtn, startTime=0, stopTime=0){
        this.display = display;
        this.startBtn = startBtn;
        this.pauseBtn = pauseBtn;
        this.stopBtn = stopBtn;
        this.#startTime = new Date(startTime);
        this.#stopTime = new Date(stopTime);
        this.#durationLeftInSeconds = this.durationLeftInSeconds;
        console.log(this.#durationLeftInSeconds);
        console.log(this.display);
        this.pauseBtn.disabled=true;
        this.stopBtn.disabled =true;
    }

    get durationLeftInSeconds(){
        if (!(this.#pause)){
            const timeNow = new Date();
            return Math.ceil((this.#stopTime.getTime() - timeNow.getTime())/1000) > 0 ? Math.ceil((this.#stopTime.getTime() - timeNow.getTime())/1000): 0;
        }else{
            return this.#durationLeftInSeconds;
        }
    }

    get hoursLeft(){
        return Math.floor(this.durationLeftInSeconds / (60*60));
    }

    get minutesLeft(){
        return Math.floor(this.durationLeftInSeconds / 60) % 60;
    }

    get secondsLeft(){
        return this.durationLeftInSeconds % 60;
    }

    get startTime(){
        return this.#startTime;
    }

    get stopTime(){
        return this.#stopTime;
    }

    get hasStarted(){
        return this.#start;
    }

    get isPause(){
        return this.#pause;
    }

    timeStart(durationInHours){
        
        console.log("Countdown started.")
        this.#startTime = new Date();
        const durationInMilliSeconds = durationInHours*60*60*1000;
        this.#stopTime = new Date(this.#startTime.getTime()+durationInMilliSeconds);
        this.#start = true;
        console.log(this.#startTime,this.#stopTime);
        this.countdown();
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
    }

    timePause(){
        if (this.isPause){
            console.log("Countdown resumed.")
            this.#pause = false;
            this.timeStart(this.#durationLeftInSeconds/3600);
            this.stopBtn.disabled = true;
            this.pauseBtn.value = "PAUSE";
        }else{
            console.log("Countdown paused.")
            this.#durationLeftInSeconds = this.durationLeftInSeconds;
            clearInterval(this.#countdownID);
            this.#pause = true;
            this.stopBtn.disabled = false;
            this.pauseBtn.value = "RESUME";
        }
    }

    timeReset(){
        if (this.hasStarted){
            clearInterval(this.#countdownID);
            console.log("Countdown Reset.")
            this.#durationLeftInSeconds=0;
            this.display.innerText = `${("0"+this.hoursLeft).slice(-2)}:${("0"+this.minutesLeft).slice(-2)}:${("0"+this.secondsLeft).slice(-2)}`;
            this.#start = false;
            this.#pause = false;
            this.pauseBtn.disabled = true;
            this.stopBtn.disabled = true;
            this.startBtn.disabled = false;
            this.pauseBtn.value = "PAUSE";

        }
    }

    countdown(){
        this.#countdownID = setInterval(()=>{

            this.display.innerText = `${("0"+this.hoursLeft).slice(-2)}:${("0"+this.minutesLeft).slice(-2)}:${("0"+this.secondsLeft).slice(-2)}`;

            if (this.durationLeftInSeconds===0){
                clearInterval(this.#countdownID);
                console.log("Countdown ends.")
                alert("Time is Up!");

                this.pauseBtn.disabled = true;
                this.stopBtn.disabled = true;
                this.startBtn.disabled = false;
                this.pauseBtn.value = "PAUSE";

                this.#start = false;
                this.#pause = false;
            }
        },1000);
    }

}

const timerDisplay = document.querySelector("#countdown-timer");
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');
const timer = new Timer(timerDisplay, startButton ,pauseButton, stopButton);
const countdownSelector = document.querySelector("#duration");
const timeLog = document.querySelector("#time-log");


window.onload=()=>{

};

startButton.addEventListener("click",()=>{
    timer.timeStart(countdownSelector.value);
    timeLog.innerText = `Start Time: ${timer.startTime}`;
});

pauseButton.addEventListener("click", ()=>{timer.timePause();});

stopButton.addEventListener("click", ()=>{
    timer.timeReset();
    timeLog.innerText = "Start Time:";
}
)
