let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function placeMark(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        document.getElementById('board').children[index].innerText = currentPlayer;
        checkWinner();
        togglePlayer();

        if (currentPlayer === 'O' && gameActive) {
            setTimeout(() => botMove(), 500);
        }
    }
}

function botMove() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    for (const index of emptyCells) {
        const tempBoard = [...gameBoard];
        tempBoard[index] = currentPlayer;

        if (isWinner(tempBoard, currentPlayer)) {
            makeBotMove(index);
            return;
        }
    }

    for (const index of emptyCells) {
        const tempBoard = [...gameBoard];
        tempBoard[index] = 'X';

        if (isWinner(tempBoard, 'X')) {
            makeBotMove(index);
            return;
        }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    makeBotMove(emptyCells[randomIndex]);
}

function makeBotMove(index) {
    gameBoard[index] = currentPlayer;
    document.getElementById('board').children[index].innerText = currentPlayer;

    checkWinner();
    togglePlayer();
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            document.getElementById('result').innerText = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
    }

    if (!gameBoard.includes('')) {
        document.getElementById('result').innerText = "It's a draw!";
        gameActive = false;
        return;
    }

    gameActive = true;
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    for (let i = 0; i < 9; i++) {
        document.getElementById('board').children[i].innerText = '';
    }

    document.getElementById('result').innerText = '';
}

function isWinner(board, player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === player) {
            return true;
        }
    }

    return false;
}
