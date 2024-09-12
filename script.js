import { questions } from './data.js';

const startBtn = document.getElementById("start");
const header = document.getElementById("header");
const task = document.getElementById("task");
const input = document.getElementById("input");
const nextButton = document.getElementById("next-btn");
const bar = document.getElementById("progress-bar");
const dsp = document.getElementById("progress-display");
const joker = document.getElementById("Joker");
let time = 1;
let currentQuestionIndex = 0;
let currentQuestionBlock = 0;
let tasksperblock = 9;
let blocks = 10;
let alive = true;
let score = 0;
let total = 100;
let finaltime = "";
let arr;
let inpcorrect = 0;
let jkused = false;
let jkquestion;
let jkquestionres;
const answerButtons = document.getElementById("btns");
const tb = document.getElementById("transform-bar");


startBtn.addEventListener("click", startQuiz);


function startQuiz(){
    joker.addEventListener("click", handleJoker);
    generatearray();
    startBtn.style.display = "none";
    header.style.display = "none";
    clock.style.display = "block";
    task.style.display = "block";
    nextButton.style.display = "inline";
    joker.style.display = "inline";
    setInterval(clockrun, 1000);
    showQuestions();
    dsp.style.display = "block";
    tb.style.background = "#383838";
}
function updatebar(){
    let progress = score / total;
    progress = Math.floor(progress * 100);
    bar.style.width = progress + "%";
    dsp.innerText = progress + "%";
}

function showQuestions(){
    



    if(currentQuestionBlock >= blocks){
        showresults();
        return;
    }

    resetState();
    updatebar();
    console.log("----");
    console.log(currentQuestionBlock + " " + arr[currentQuestionIndex]);
    let currentQuestion = questions[currentQuestionBlock].tasks[arr[currentQuestionIndex]];
    let type = questions[currentQuestionBlock].type;
    console.log(currentQuestion);
    task.innerText = currentQuestion.task;
    if(currentQuestionIndex == tasksperblock){
        currentQuestionBlock++;
        currentQuestionIndex = 0;
        generatearray();
    }else{
        currentQuestionIndex++;
    }
   

    if(type == 1){
        console.log("beta: " + currentQuestion.result);
        nextButton.disabled = false;
        input.style.display = "inline";
        tracknextbuttoninput(currentQuestion.result);
        if(!jkused){
            jkquestion = currentQuestion.task;
            jkquestionres = currentQuestion.result;
        }
    }
    if(type == 2){
        nextButton.disabled = true;
        currentQuestion.result.forEach(result => {
            const button = document.createElement("button");
            button.innerHTML = result.text;
            button.classList.add("btn");
            answerButtons.appendChild(button);
            if(result.correct){
                button.dataset.correct = result.correct;
            }
            button.addEventListener("click", selectAnswer);
        });
        if(!jkused){
            jkquestion = currentQuestion.task;
            jkquestionres = (currentQuestion.result.find(item => item.correct === "true") || {}).text || null;
        }
    }

}
function selectAnswer (e){
    const selectedBtn = e.target;
    joker.disabled = true;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        tracknextbuttonbtns();
    }else{
        selectedBtn.classList.add("incorrect");
        nextButton.innerText = "Ergebniss anzeigen";
        nextButton.disabled = false;
        nextButton.addEventListener("click", ()=>{
            showresults();
        })
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
}

function resetState(){
    while(btns.firstChild){
        btns.removeChild(btns.firstChild);
    }
}
function clockrun(){
    let minutes = Math.floor(time / 60);
    let extraSeconds = time % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
    document.getElementById("clock").innerText = minutes + ":" + extraSeconds;
    finaltime = minutes + ":" + extraSeconds;
    time++;
}
function tracknextbuttoninput(y) {
    inpcorrect = y;
    nextButton.addEventListener("click", handleClick);
}

function handleClick() {
    console.log("into: y=" + inpcorrect + ", inp: " + input.value);
    nextButton.removeEventListener("click", handleClick);
    if(input.value != inpcorrect){
        alive = false;
        console.log("faliled");
    }else{
        score++;
    }
    input.value = "";
    input.style.display = "none";
    if(alive){
        showQuestions();
    }else{
        task.innerText = "Game Over!";
        showresults();
    }
}


function tracknextbuttonbtns(){
    nextButton.disabled = false;

    function handleClick() {
        if(!jkused){
            joker.disabled = false;
        }
        score++;
        nextButton.disabled = true;
        nextButton.removeEventListener("click", handleClick);
        showQuestions();
        
    }

    nextButton.addEventListener("click", handleClick);
}

function handleJoker(){
    score++;
    jkused = true;
    joker.disabled = true;
    nextButton.removeEventListener("click", handleClick);
    showQuestions();
}


function showresults(){
    document.getElementById("Field").style.display = "none";
    document.getElementById("result-box").style.display = "flex";

    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue = -1;
    let progressEndValue = (score / total)*100;
    let speed = 20;




    let progress = setInterval(() => {
        progressStartValue++;
        console.log(progressStartValue);
        document.getElementById("score").innerText = `Du hast ${score} von ${total} richtig!`;
        document.getElementById("timescore").innerText = `benötigte Zeit: ${finaltime}`;
        if(jkused){
            document.getElementById("jkscore").innerText = `Joker: ${jkquestion} = ${jkquestionres}`;
        }else{
            document.getElementById("jkscore").innerText = `Joker: nicht benutzt`;
        }

        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#c40094 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1) ${(progressStartValue * 3.6) + 10}deg)`;

        if(progressStartValue == progressEndValue){
        

            clearInterval(progress);
            document.getElementById("tryAgainbtn").addEventListener("click", ()=>{
                location.reload();
                console.log("bye");
            });
        }
    }, speed);
}

function generatearray(){

    arr = Array.from({ length: 10 }, (_, i) => i);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; 
    }

    console.log(arr);

}