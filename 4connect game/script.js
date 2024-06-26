const ROWS = 6;
const COLS = 7;
const WIN_LENGTH = 4;

let currentPlayer = 'red';
let gameBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let isGameOver = false;
let moveHistory = [];

const boardElement = document.getElementById('board');
const resetButton = document.getElementById('reset');
const currentPlayerElement = document.getElementById('current-player');
const winnerModal = document.getElementById('winner-modal');
const closeModal = document.getElementById('close-modal');
const playAgainButton = document.getElementById('play-again');
const winnerMessage = document.getElementById('winner-message');

// Create the game board cells
function createBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Handle cell click event
function handleCellClick(event) {
    if (isGameOver) return;
    const col = Number(event.target.dataset.col);
    const row = getAvailableRow(col);
    if (row === -1) return;
    gameBoard[row][col] = currentPlayer;
    moveHistory.push({ row, col });
    updateBoard();
    if (checkWin(row, col)) {
        isGameOver = true;
        highlightWinningCells(row, col);
        announceWinner(currentPlayer);
        return;
    }
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    updateCurrentPlayer();
}

// Get the available row in the clicked column
function getAvailableRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            return row;
        }
    }
    return -1;
}

// Update the board UI
function updateBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.classList.remove('red', 'yellow', 'highlight');
            if (gameBoard[row][col]) {
                cell.classList.add(gameBoard[row][col]);
            }
        }
    }
}

// Update the current player display
function updateCurrentPlayer() {
    const playerSpan = currentPlayerElement;
    playerSpan.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    playerSpan.style.color = currentPlayer === 'red' ? '#FF6347' : '#FFD700';
}

// Check for a win
function checkWin(row, col) {
    return (
        checkDirection(row, col, 1, 0) || // Horizontal
        checkDirection(row, col, 0, 1) || // Vertical
        checkDirection(row, col, 1, 1) || // Diagonal /
        checkDirection(row, col, 1, -1)   // Diagonal \
    );
}

// Check a specific direction for a win
function checkDirection(row, col, rowDir, colDir) {
    const color = gameBoard[row][col];
    let count = 1;

    // Check in positive direction
    let r = row + rowDir;
    let c = col + colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === color) {
        count++;
        r += rowDir;
        c += colDir;
    }

    // Check in negative direction
    r = row - rowDir;
    c = col - colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === color) {
        count++;
        r -= rowDir;
        c -= colDir;
    }

    return count >= WIN_LENGTH;
}

// Highlight the winning cells
function highlightWinningCells(row, col) {
    const color = gameBoard[row][col];
    let directions = [
        [1, 0], // Horizontal
        [0, 1], // Vertical
        [1, 1], // Diagonal /
        [1, -1] // Diagonal \
    ];

    directions.forEach(([rowDir, colDir]) => {
        let r = row;
        let c = col;
        let count = 0;

        // Count in positive direction
        while (count < WIN_LENGTH && r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === color) {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            cell.classList.add('highlight');
            r += rowDir;
            c += colDir;
            count++;
        }

        // Count in negative direction
        r = row - rowDir;
        c = col - colDir;
        while (count < WIN_LENGTH && r >= 0 && r < ROWS && c >= 0 && c < COLS && gameBoard[r][c] === color) {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            cell.classList.add('highlight');
            r -= rowDir;
            c -= colDir;
            count++;
        }
    });
}

// Announce the winner
function announceWinner(player) {
    winnerMessage.textContent = `${player.charAt(0).toUpperCase() + player.slice(1)} wins!`;
    winnerModal.style.display = 'block';
}

// Reset the game
function resetGame() {
    gameBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = 'red';
    isGameOver = false;
    moveHistory = [];
    updateBoard();
    updateCurrentPlayer();
}

// Close the winner modal
function closeWinnerModal() {
    winnerModal.style.display = 'none';
}

// Event listeners
resetButton.addEventListener('click', resetGame);
closeModal.addEventListener('click', closeWinnerModal);
playAgainButton.addEventListener('click', () => {
    closeWinnerModal();
    resetGame();
});

// Initialize the game
createBoard();
updateCurrentPlayer();