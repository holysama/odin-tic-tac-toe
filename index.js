const gameBoard = (function() {
    const rows = 3;
    const columns = 3;
    board = []

    //create board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = ""
        }
    }

    console.log(board);

    //render board
    const getBoard = () => board;

    //place marks
    const placeMark = (row, col, marker) => {
        if (board[row][col] === "") {
            board[row][col] = marker;
        } 
    }

    //reset board
    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = ""
            }
        }
    }

    return {getBoard, placeMark, resetBoard}
})();

const gameController = (function() {
    const playerOneName = "Player 1";
    const playerTwoName = "Player 2";

    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name:playerTwoName,
            mark: "O"
        }
    ]

    let activePlayer = players[0];
    
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (row, col) => {
        if (gameBoard.getBoard()[row][col] === "") {
            gameBoard.placeMark(row, col, activePlayer.mark);
            console.log(gameBoard.getBoard());
            switchPlayerTurn();
        } else {
            console.log("It's already occupied you can't put it there");
        }
    } 
    
    return {playRound}
})();