const ALARM = "./sound/bell.wav";
/* alarm soundtrack taken from https://mixkit.co */

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
                this.playAlarm().then(()=>{
                    console.log("Countdown ends.");
                    if (confirm("Time's Up!\n\nClick OK to remove completed items from your to do list.\nClick Cancel to manually update your to do list.")){
                        toDo.clearCheckedItems();
                        toDo.refreshToDoList();
                    }
                });


                this.pauseBtn.disabled = true;
                this.stopBtn.disabled = true;
                this.startBtn.disabled = false;
                this.pauseBtn.value = "PAUSE";

                this.#start = false;
                this.#pause = false;
            }
        },1000);
    }

    playAlarm(){
        return new Promise((resolve)=>{
        const alarm = new Audio (ALARM);
        alarm.play();
        alarm.onended = resolve;
    })
    }

}

class ToDoList{

    #taskID = 0;

    #toDoList={
        pending:[],
        completed:[],
    };

    constructor(inputField, displayArea){
        this.inputField = inputField;
        this.displayArea = displayArea;
    }

    updateToDoList(){

        if (this.inputField.value){
            const arr = this.inputField.value.split(/[;\n]/).map(str=>str.trim()).filter(str=>str);
            this.createItems(arr);
        }

        this.inputField.value = "";

        this.clearCheckedItems();

        this.refreshToDoList();
    }

    createItems(arr){
        
        for (let item of arr){
            const span = document.createElement("span");
            const checkbox = document.createElement("input");
            const label = document.createElement("label");
            checkbox.type = "checkbox";
            checkbox.name = item;
            checkbox.className = "to-do-checkbox";
            checkbox.id = "a"+this.#taskID;
            label.setAttribute("for","a"+this.#taskID);
            label.innerText = item;
            label.className = "to-do-item";
            this.#taskID++;
            span.appendChild(checkbox);
            span.appendChild(label);
            this.#toDoList["pending"].push(span);
        }
    }

    clearCheckedItems(){
        for (let i in this.#toDoList["pending"]){
            if (this.#toDoList["pending"][i].querySelector("input[type='checkbox']").checked){
                this.#toDoList["completed"].push(this.#toDoList["pending"][i]);
            }
        }
            this.#toDoList["pending"] = this.#toDoList["pending"].filter(item=>!item.querySelector("input[type='checkbox']").checked);
    }

    refreshToDoList(){
        this.displayArea.innerText="";
        for (let item of this.#toDoList["pending"]){
            this.displayArea.appendChild(item);
        }
    }
}


const timerDisplay = document.querySelector("#countdown-timer");
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');
const countdownSelector = document.querySelector("#duration");
const timeLog = document.querySelector("#time-log");

const toDoInput = document.querySelector("#to-do-textarea");
const toDoList = document.querySelector("#to-do-list");
console.log(toDoList);
const toDoButton = document.querySelector("#to-do-submit");

window.onload = ()=>toDoInput.focus();

const timer = new Timer(timerDisplay, startButton ,pauseButton, stopButton);
const toDo = new ToDoList(toDoInput, toDoList);


toDoButton.addEventListener("click", ()=>{toDo.updateToDoList();});

startButton.addEventListener("click",()=>{
    timer.timeStart(countdownSelector.value);
    timeLog.innerText = `Start Time: ${("0"+timer.startTime.getHours()).slice(-2)}:${("0"+timer.startTime.getMinutes()).slice(-2)}:${("0"+timer.startTime.getSeconds()).slice(-2)}`;
});

pauseButton.addEventListener("click", ()=>{timer.timePause();});

stopButton.addEventListener("click", ()=>{
    timer.timeReset();
    timeLog.innerText = "Start Time:";
}
)
