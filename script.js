setInterval(() => date.textContent = time(), 1000);

let score, answer, level, player_name = "";
const levelArr = document.getElementsByName("level");
const scoreArr = [];
let startMs = 0;
let totalTime = 0;
let fastest = Infinity;

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);


function time(){
    let d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[d.getMonth()];
    let day = d.getDate();

    let suffix = "th";
    if(![11, 12, 13].includes(day % 100)){
        if(day % 10 === 1){
            suffix = "st";
        }
        else if(day % 10 === 2){
            suffix = "nd";
        }
        else if(day % 10 === 3){
            suffix = "rd";
        }
    }

    let hours = d.getHours();
    let minutes = String(d.getMinutes()).padStart(2, "0");
    let seconds = String(d.getSeconds()).padStart(2, "0");
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    let str = `${month} ${day}${suffix}, ${d.getFullYear()}, ${hours}:${minutes}:${seconds} ${period}`;
    return str;
}

function play(){
    if(!player_name){
        player_name = prompt("Enter your name:");
        while(!player_name){
            player_name = prompt("You must enter enter your name:");
        }
        player_name = player_name[0].toUpperCase() + player_name.slice(1).toLowerCase();
    }

    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    guess.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
    }

    answer = Math.floor(Math.random() * level) + 1;
    msg.textContent = player_name + ", guess a number 1-" + level;
    guess.placeholder = "";
    score = 0;
    startMs = new Date().getTime();
}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = player_name + ", INVALID, guess a number between 1 and " + level;
        return;
    }
    score++;

    let diff = Math.abs(userGuess - answer);
    let feedback = "";
    if(diff === 0) feedback = "Correct";
    else if(diff <= level / 10) feedback = "Hot";
    else if(diff <= level / 5) feedback = "Warm";
    else feedback = "Cold";

    if(userGuess < answer){
        msg.textContent = feedback + " Too low" + player_name + "!";
    }
    else if(userGuess > answer){
        msg.textContent = feedback + " Too high" + player_name + "!";
    }
    else{
        let endMs = new Date().getTime();
        msg.textContent = "Correct! " + player_name + ", you got it in " + score + " guesses.";
        reset();
        updateScore();
        updateTimers(endMs);
    }
}

function giveUp(){
    msg.textContent = player_name + "Nice try! The answer was " + answer + ".";
    reset();
}

function reset(){
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    scoreArr.push(score);
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    scoreArr.sort((a, b) => a - b);
    const lb = document.getElementsByName("leaderboard");
   
    for(let i = 0; i < scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average guesses: " + avg.toFixed(2);

    if(score <= level/5) msg.textContent += " Amazing!";
    else if(score <= level/2) msg.textContent += " Decent job!";
    else msg.textContent += " Still developing.";
}

function updateTimers(endMs){
    let roundTime =(endMs - startMs)/1000;
    totalTime += roundTime;
    if(roundTime < fastest) fastest = roundTime;

    if(!document.getElementById("fastest")){
        let p1 = document.createElement("p");
        p1.id = "fastest";
        document.body.appendChild(p1);
        let p2 = document.createElement("p");
        p2.id = "avgTime";
        document.body.appendChild(p2);
    }

    document.getElementById("fastest").textContent = "Fastest game: " + fastest.toFixed(2) + " sec";
    document.getElementById("avgTime").textContent = "Average time: " +(totalTime/scoreArr.length).toFixed(2) + " sec";
}