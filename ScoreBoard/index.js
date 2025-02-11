// Constants
const GAME_CONFIG = {
    SCORE_INCREMENTS: {
        ONE: 1,
        TWO: 2,
        THREE: 3
    },
};

// Sound Effects
const SOUNDS = {
    buttonClick: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhcAYAAAD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A'),
    scoreChange: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhcAYAAAD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A')
};

// DOM Elements
const elements = {
    homeScore: document.getElementById("home-score-el"),
    awayScore: document.getElementById("away-score-el"),
    periodDisplay: document.getElementById("period-display"),
    timer: document.getElementById("timer"),
    restartBtn: document.getElementById("restart-btn")
};

// Game State
const gameState = {
    home: 0,
    away: 0,
    period: 1,
    timeRemaining: GAME_CONFIG.PERIOD_LENGTH_MINUTES * 60,
    isTimerRunning: false
};

// Initialize button event listeners
function initializeEventListeners() {
    // Remove inline onclick attributes and add event listeners
    document.querySelectorAll('.btn').forEach(button => {
        const id = button.id;
        const team = id.includes('home') ? 'home' : 'away';
        const increment = parseInt(button.textContent.replace('+', ''));
        
        button.addEventListener('click', () => {
            SOUNDS.buttonClick.play();
            incrementScore(team, increment);
        });
    });

    elements.restartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to start a new game?')) {
            resetGame();
        }
    });

    // Load saved state from localStorage
    loadGameState();
}

// Timer functions
function updateTimer() {
    if (gameState.isTimerRunning && gameState.timeRemaining > 0) {
        gameState.timeRemaining--;
        displayTime();
        
        if (gameState.timeRemaining === 0) {
            if (gameState.period < GAME_CONFIG.TOTAL_PERIODS) {
                gameState.period++;
                gameState.timeRemaining = GAME_CONFIG.PERIOD_LENGTH_MINUTES * 60;
                updatePeriodDisplay();
            } else {
                gameState.isTimerRunning = false;
            }
        }
    }
}

function displayTime() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    elements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updatePeriodDisplay() {
    elements.periodDisplay.textContent = `Period: ${gameState.period}`;
}

// Score functions
function incrementScore(team, amount) {
    const newScore = gameState[team] + amount;
    if (newScore <= GAME_CONFIG.MAX_SCORE) {
        gameState[team] = newScore;
        SOUNDS.scoreChange.play();
        updateDisplay();
        highlightLeader();
        saveGameState();
        
        // Add animation
        const scoreElement = team === 'home' ? elements.homeScore : elements.awayScore;
        scoreElement.classList.remove('score-changed');
        void scoreElement.offsetWidth; // Trigger reflow
        scoreElement.classList.add('score-changed');
    }
}

function updateDisplay() {
    elements.homeScore.textContent = gameState.home;
    elements.awayScore.textContent = gameState.away;
    displayTime();
    updatePeriodDisplay();
}

function highlightLeader() {
    elements.homeScore.classList.toggle('highlight', gameState.home > gameState.away);
    elements.awayScore.classList.toggle('highlight', gameState.away > gameState.home);
}

// Game state management
function saveGameState() {
    localStorage.setItem('basketballGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('basketballGameState');
    if (savedState) {
        Object.assign(gameState, JSON.parse(savedState));
        updateDisplay();
        highlightLeader();
    }
}

function resetGame() {
    gameState.home = 0;
    gameState.away = 0;
    gameState.period = 1;
    gameState.timeRemaining = GAME_CONFIG.PERIOD_LENGTH_MINUTES * 60;
    gameState.isTimerRunning = false;
    updateDisplay();
    highlightLeader();
    saveGameState();
}

// Start timer update interval
setInterval(updateTimer, 1000);

// Initialize the game
initializeEventListeners();
updateDisplay();