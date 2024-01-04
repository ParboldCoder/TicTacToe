// Initialize variables for the current player, game board, and game status, I also added variable to store player's mark ('X' or 'O') and the variable to store bot's mark ('X' or 'O')
let currentPlayer;
let playerMark;
let botMark; 
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

// I added the function to start the game and prompt the player to choose 'X' or 'O'
function startGame() {
    const playerChoice = prompt("Choose 'X' or 'O'");
    if (playerChoice && (playerChoice.toUpperCase() === 'X' || playerChoice.toUpperCase() === 'O')) {
        playerMark = playerChoice.toUpperCase();
        botMark = playerMark === 'X' ? 'O' : 'X'; // Set the bot's mark opposite to the player's mark
        currentPlayer = playerMark; // Start with the chosen mark as the first player
        gameActive = true;
        resetGame();
    } else {
        alert("Invalid choice. Please choose 'X' or 'O'.");
        startGame(); // Restart the function if an invalid choice is made as the X or O needs to be capitalized
    }
}

// This section indicates where the player will select their move.
function placeMark(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        updateBoard(index);
        checkWinner();
        togglePlayer();
        if (currentPlayer === botMark && gameActive) {
            setTimeout(() => botMove(), 500);
        }
    }
}

// Here I added a bot that makes a move based on more challenging conditions
function botMove() {
    const emptyCells = findEmptyCells();

    for (const index of emptyCells) {
        const tempBoard = [...gameBoard];
        tempBoard[index] = botMark;
        if (isWinner(tempBoard, botMark)) {
            makeBotMove(index);
            return;
        }
    }

    // Here the bot will check if the player can win in the next move and block them
    for (const index of emptyCells) {
        const tempBoard = [...gameBoard];
        tempBoard[index] = playerMark;
        if (isWinner(tempBoard, playerMark)) {
            makeBotMove(index);
            return;
        }
    }

    // If the center is empty, the bot will take the center
    if (emptyCells.includes(4)) {
        makeBotMove(4);
        return;
    }

    // If none of the above conditions are met, the bot will make a random move
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    makeBotMove(emptyCells[randomIndex]);
}

// Here is where the Bot will execute its move
function makeBotMove(index) {
    gameBoard[index] = botMark;
    updateBoard(index);
    checkWinner();
    togglePlayer();
}

// Switch the current player between 'X' and 'O'
function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check if there is a winner or if it's a draw
function checkWinner() {
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            displayWinner();
            return;
        }
    }
    if (!gameBoard.includes('')) {
        displayDraw();
        return;
    }
    gameActive = true;
}

// Standard game reset button
function resetGame() {
    currentPlayer = playerMark; // Start with the chosen mark as the first player
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    clearBoard();
    clearResultDisplay();
}

// Check if a given player has won on a specific board
function isWinner(board, player) {
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === player) {
            return true;
        }
    }
    return false;
}

// Helper function to find all empty cells on the board
function findEmptyCells() {
    return gameBoard.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);
}

// Helper function to update the board display at the specified index with the player's mark
function updateBoard(index) {
    document.getElementById('board').children[index].innerText = currentPlayer;
}

function displayWinner() {
    document.getElementById('result').innerText = `Player ${currentPlayer} wins!`;
    gameActive = false;
}

function displayDraw() {
    document.getElementById('result').innerText = "It's a draw!";
    gameActive = false;
}

function clearBoard() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('board').children[i].innerText = '';
    }
}

function clearResultDisplay() {
    document.getElementById('result').innerText = '';
}

startGame();
