const wordDisplay = document.getElementById('wordDisplay');
const letterButtons = document.getElementById('letterButtons');
const livesCount = document.getElementById('livesCount');
const playAgainButton = document.getElementById('playAgainButton');
const hangmanCanvas = document.getElementById('hangmanCanvas');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const closePopup = document.getElementById('closePopup');
const hintText = document.getElementById('hint-text');

const ctx = hangmanCanvas.getContext('2d');
const maxLives = 10;
let word = '';
let guessedWord = [];
let lives = maxLives;
let gameOver = false;

// Initialize the game
function initGame() {
    fetchWord();
    lives = maxLives;
    livesCount.textContent = lives;
    gameOver = false;
    clearCanvas();
    drawGallows();
    setupLetterButtons();
    playAgainButton.style.display = 'none';
}

// Fetch random word from API
async function fetchWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        word = data[0].toLowerCase();
        guessedWord = Array(word.length).fill('_');
        wordDisplay.textContent = guessedWord.join(' ');
        fetchHint(word); // Fetch hint for the new word
    } catch (error) {
        console.error('Error fetching word:', error);
    }
}

// Fetch hint from Oxford Dictionaries API
async function fetchHint(word) {
    const url = `http://localhost:3000/api/word/${word}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const definition = data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
        hintText.textContent = `Hint: ${definition}`;
    } catch (error) {
        console.error('Error fetching hint:', error);
        hintText.textContent = 'Hint: Not available';
    }
}



// Setup letter buttons
function setupLetterButtons() {
    letterButtons.innerHTML = '';
    for (let i = 97; i <= 122; i++) {
        const button = document.createElement('button');
        button.textContent = String.fromCharCode(i);
        button.addEventListener('click', handleGuess);
        letterButtons.appendChild(button);
    }
}

// Handle letter guess
function handleGuess(e) {
    const letter = e.target.textContent;
    e.target.disabled = true;

    if (word.includes(letter)) {
        updateGuessedWord(letter);
        wordDisplay.textContent = guessedWord.join(' ');
        checkWin();
    } else {
        lives--;
        livesCount.textContent = lives;
        drawHangman();
        checkLoss();
    }
}

// Update the guessed word array with the correct letter
function updateGuessedWord(letter) {
    word.split('').forEach((char, index) => {
        if (char === letter) {
            guessedWord[index] = letter;
        }
    });
}

// Check if player has won
function checkWin() {
    if (!guessedWord.includes('_')) {
        endGame('You Won!', 'green');
    }
}

// Check if player has lost
function checkLoss() {
    if (lives === 0) {
        endGame('GAME OVER! You Lost! The word was: ' + word, 'red');
    }
}

// End game and show popup
function endGame(message, color) {
    gameOver = true;
    popupMessage.textContent = message;
    popupMessage.style.color = color;
    popup.classList.remove('hidden');
    playAgainButton.style.display = 'block';
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
}

// Draw gallows
function drawGallows() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;

    // Base
    ctx.beginPath();
    ctx.moveTo(20, 230);
    ctx.lineTo(180, 230);
    ctx.stroke();

    // Vertical pole
    ctx.moveTo(60, 230);
    ctx.lineTo(60, 20);
    ctx.stroke();

    // Horizontal pole
    ctx.moveTo(60, 20);
    ctx.lineTo(150, 20);
    ctx.stroke();

    // Rope
    ctx.moveTo(150, 20);
    ctx.lineTo(150, 50);
    ctx.stroke();
}

// Draw hangman step by step
function drawHangman() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;

    switch (lives) {
        case 9:
            // Draw head
            ctx.beginPath();
            ctx.arc(150, 70, 20, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 8:
            // Draw torso
            ctx.moveTo(150, 90);
            ctx.lineTo(150, 150);
            ctx.stroke();
            break;
        case 7:
            // Draw left arm
            ctx.moveTo(150, 100);
            ctx.lineTo(120, 130);
            ctx.stroke();
            break;
        case 6:
            // Draw right arm
            ctx.moveTo(150, 100);
            ctx.lineTo(180, 130);
            ctx.stroke();
            break;
        case 5:
            // Draw left leg
            ctx.moveTo(150, 150);
            ctx.lineTo(120, 190);
            ctx.stroke();
            break;
        case 4:
            // Draw right leg
            ctx.moveTo(150, 150);
            ctx.lineTo(180, 190);
            ctx.stroke();
            break;
        case 3:
            // Draw left eye
            ctx.beginPath();
            ctx.arc(140, 65, 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 2:
            // Draw right eye
            ctx.beginPath();
            ctx.arc(160, 65, 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 1:
            // Draw mouth
            ctx.beginPath();
            ctx.moveTo(140, 85);
            ctx.lineTo(160, 85);
            ctx.stroke();
            break;
    }
}

// Restart game
playAgainButton.addEventListener('click', initGame);

// Close popup
closePopup.addEventListener('click', () => {
    popup.classList.add('hidden');
});

// Initialize game on page load
window.addEventListener('load', initGame);
