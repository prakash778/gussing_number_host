let playerName, computerNumber, guessCount, startTime;

function startGame() {
    playerName = document.getElementById("player-name").value;
    if (!playerName) {
        alert("Please enter your name.");
        return;
    }

    
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    
    document.getElementById("greeting").innerText = `Welcome, ${playerName}!`;


    computerNumber = generateUniqueNumber();
    guessCount = 0;
    startTime = Date.now();


    displayBestPlayer();
}

function generateUniqueNumber() {
    let digits = new Set();
    while (digits.size < 4) {
        digits.add(Math.floor(Math.random() * 10));
    }
    return Array.from(digits).join('');
}

function checkGuess() {
    const guess = document.getElementById("guess").value;
    if (!/^\d{4}$/.test(guess)) {
        alert("Please enter a valid 4-digit number.");
        return;
    }

    guessCount++;
    document.getElementById("guess-count").innerText = guessCount;

    const feedback = getFeedback(computerNumber, guess);
    document.getElementById("feedback").innerText = `Feedback: ${feedback}`;

    if (feedback === "++++") {
        endGame();
    }
}

function getFeedback(computerNumber, guess) {
    let feedback = '';
    let computerDigits = computerNumber.split('');
    let guessDigits = guess.split('');
    
    let exactMatches = [false, false, false, false];
    let guessUsed = [false, false, false, false]; 
    let computerUsed = [false, false, false, false];


    for (let i = 0; i < 4; i++) {
        if (guessDigits[i] === computerDigits[i]) {
            feedback += '+';
            exactMatches[i] = true;
            computerUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    
    for (let i = 0; i < 4; i++) {
        if (!exactMatches[i]) {
            for (let j = 0; j < 4; j++) {
                if (!computerUsed[j] && guessDigits[i] === computerDigits[j]) {
                    feedback = feedback.substring(0, i) + '-' + feedback.substring(i + 1);
                    computerUsed[j] = true;
                    guessUsed[i] = true;
                    break;
                }
            }
        }
    }

    return feedback;
}

function endGame() {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000); 

    
    const bestScore = getBestScore();
    const currentPlayerScore = {
        name: playerName,
        guesses: guessCount,
        timeTaken: timeTaken,
        gameNumber: computerNumber
    };

    if (!bestScore || (guessCount + timeTaken < bestScore.guesses + bestScore.timeTaken)) {
        localStorage.setItem("bestScore", JSON.stringify(currentPlayerScore));
    }


    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");


    document.getElementById("total-guesses").innerText = guessCount;
    document.getElementById("total-time").innerText = timeTaken;
    document.getElementById("generated-number").innerText = computerNumber;

    
    displayBestPlayer();
}

function getBestScore() {
    return JSON.parse(localStorage.getItem("bestScore"));
}

function displayBestPlayer() {
    const bestScore = getBestScore();

    if (bestScore) {
        document.getElementById("best-player-name").innerText = `Name: ${bestScore.name}`;
        document.getElementById("best-player-guesses").innerText = `Guesses: ${bestScore.guesses}`;
        document.getElementById("best-player-time").innerText = `Time: ${bestScore.timeTaken} seconds`;
    } else {
        document.getElementById("best-player-name").innerText = "No best player yet.";
        document.getElementById("best-player-guesses").innerText = "";
        document.getElementById("best-player-time").innerText = "";
    }
}

function resetGame() {
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("welcome-screen").classList.remove("hidden");
    document.getElementById("player-name").value = '';
}
