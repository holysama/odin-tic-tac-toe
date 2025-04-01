//gameBoard module

const gameBoard = (function() {
    //create game board
    const rows = 3;
    const columns = 3;
    let board = [];

   
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = "";
        }
    }

    //get current board
    const getBoard = () => board;

    //place marker
    const placeMark = (row, col, mark) => {
        if (board[row][col] === "") {
            board[row][col] = mark;
        }   
    }

    //reset board
    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = "";
            }
        }
    }
    //get cell value
    const getCellValue = (row, col) => board[row][col];
    
    return {getBoard, placeMark, resetBoard, getCellValue}

})();

//create player
const createPlayer = (name, mark) => {
    let score = 0;
    const getPlayerName = () => name;
    const getPlayerMark = () => mark;
    const getPlayerScore = () => score;
    const incrementScore = () => score++;
    const resetScore = () => score = 0;

    return {getPlayerName, getPlayerMark, getPlayerScore, incrementScore, resetScore}
}

//game controller

const gameController = (function() {
    //players name creation
    let player1;
    let player2;
    let activePlayer;

    const setPlayerNames = (name1, name2) => {
        player1 = createPlayer(name1 || "Player 1", "X");
        player2 = createPlayer(name2 || "Player 2", "O");
        activePlayer = player1;
    }

    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;   
    
    //turn based player switch
    

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const getActivePlayer = () => activePlayer;

    //winning patterns array
    const winningPatterns = [
        //row patterns
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        //column patterns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        //diagonal patterns
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    let roundCount = 1;

    const getRoundCount = () => roundCount;

    let roundStatusMessege = "";
    let getRoundStatusMessege = () => roundStatusMessege;

    //play single round
    const playRound = (row, col) => {
        //place mark player choice
        let activePlayerMark =  activePlayer.getPlayerMark(); 
        gameBoard.placeMark(row, col, activePlayerMark);
        //check if we have a round winner
        const winner = checkWinner();
        


        if (winner) {
            roundStatusMessege = `${activePlayer.getPlayerName()} won the round!`
            activePlayer.incrementScore();
            roundCount++;
            gameBoard.resetBoard();
            if (checkMatchEnd()) return;
            return;
        }
        
        //check if it's a round tie
        const tie = checkTie();

        if (tie) {
            roundStatusMessege = "It's a tie";
            roundCount++;
            gameBoard.resetBoard();
            if (checkMatchEnd()) return;
            return;
        }  
        
        //switches player each round
        switchPlayerTurn();
    }
    
    //check winner function
    const checkWinner = () => {
        let board = gameBoard.getBoard();
        for (let i = 0; i < winningPatterns.length; i++) {
            const[[aRow, aCol], [bRow, bCol], [cRow, cCol]] = winningPatterns[i];

            const a = board[aRow][aCol];
            const b = board[bRow][bCol];
            const c = board[cRow][cCol];

            if (a !== "" && a === b && b === c) {
                return a;
            }
        }
        return null;
    }
    
    //check round tie function
    const checkTie = () => {
        let board = gameBoard.getBoard();
        const isBoardFull = board.flat().every(cell => cell !== "");
        return isBoardFull;
    }
    
    //check match end
    const checkMatchEnd = () => {
        if (roundCount === 6) {
            if (player1.getPlayerScore() === player2.getPlayerScore()) {
                roundStatusMessege = "The match ended in a tie!";
            } else {
                roundStatusMessege =
                    player1.getPlayerScore() > player2.getPlayerScore()
                        ? `${player1.getPlayerName()} won the match!`
                        : `${player2.getPlayerName()} won the match!`
                ;
            }
            roundCount = 1;
            player1.resetScore();
            player2.resetScore();
            return true;
        }
        return false;
    };

    return {
        getPlayer1, 
        getPlayer2, 
        playRound, 
        getRoundCount, 
        getActivePlayer, 
        checkMatchEnd, 
        getRoundStatusMessege, 
        setPlayerNames
    }
})();

//display controller

const displayController = (function() {
    //dom elements
    const boardDiv = document.querySelector(".board-container");
    const playerTurnDiv = document.querySelector(".turn-text");

    //render board squares

    let abort = false;
    
    const updateScreen = () => {
        boardDiv.innerHTML = "";
        const board = gameBoard.getBoard();
        //display player's turn
        const activePlayer = gameController.getActivePlayer();
        playerTurnDiv.textContent = `${activePlayer.getPlayerName()}'s turn!`;

        //display round
        let round = gameController.getRoundCount();
        let roundDisplayDiv = document.querySelector(".round-count");
        roundDisplayDiv.textContent = `Round: ${round}`;

        //display player's score
        let player1 = gameController.getPlayer1();
        let player2 = gameController.getPlayer2();
        const player1ScoreDiv = document.querySelector(".player1-score");
        const player2ScoreDiv = document.querySelector(".player2-score");
        player1ScoreDiv.textContent = `${player1.getPlayerName()}'s score: ${player1.getPlayerScore()}`;
        player2ScoreDiv.textContent = `${player2.getPlayerName()}'s score ${player2.getPlayerScore()}`
        
        //render board
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.textContent = board[i][j];

                
                //add event listeners for buttons
                cellBtn.addEventListener("click", () => {
                    const cellValue = gameBoard.getCellValue(i, j);

                    if (cellValue !== "") {
                        const alreadyMarked = document.querySelector(".already-marked");
                        alreadyMarked.textContent = "That spot is already taken!"
                        setTimeout(() => { 
                            alreadyMarked.textContent = ""
                        }, 5000);
                        return;
                    };
                    
                    gameController.playRound(i, j);
                    updateScreen();
                });

                boardDiv.appendChild(cellBtn);
            }
        }

        //display round winner
        const checkMatchEnd = gameController.getRoundStatusMessege();
        const winnerDiv = document.querySelector(".winner");
        winnerDiv.textContent = checkMatchEnd;
    }

    //set player names
    let startBtn = document.querySelector(".start-btn");
    let hideInputs = document.querySelector(".player-container");

    startBtn.addEventListener("click", () => {
        let player1Div = document.getElementById("player1").value;
        let player2Div = document.getElementById("player2").value;

        gameController.setPlayerNames(player1Div, player2Div);

        hideInputs.style.display = "none";
        
        updateScreen();

    });
    
    return {updateScreen}
})();
