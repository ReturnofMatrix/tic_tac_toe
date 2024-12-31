       // GameBoard fun will store the current state of the board. 
       function  gameBoard() {

        let gameBoard = [ ];
        const row = 3;
        const column = 3;

        for(let i = 0; i < row; i++)
        {
            gameBoard[i] = [];

            for(let j = 0; j < column; j++)
            {
                gameBoard[i].push(cell());
            }
        }

        const reset = () => {

            gameBoard.length = 0;

            for(let i = 0; i < row; i++)
                {
                    gameBoard[ i ] = [ ];
                    for(let j = 0; j < column; j++)
                    {
                        gameBoard[ i ].push(cell());
                    }
                }

        }

        //Method will be used by UI to know whole board state.
        const getBoard = () => gameBoard;

        // to print board cell values in the console. No you when UI.
        const printBoard = () =>
        {
            boardCellValue = gameBoard.map((row)=> row.map((column) => column.getValue() ));
            console.log(boardCellValue);
        }

        // Will change the player value to the passed cell.
        // Here i am trying to manually pass row and column value. and change that cell value to token.
        const markCell = (row, column, mark) => {

            if (gameBoard[row][column].getValue() == 0)
            {
                gameBoard[row][column].addMark(mark);   
            }

        }

        return { getBoard, printBoard, markCell, reset };
    }

    // is the individual element in the grid which uses methods to manipulate the square value. 
    function cell(){
        // Is the each square field on 3 X 3 board where default 0 means empty.
        // 1 is player1 and 2 means player 2. 
        // addToken will change the value of the cell.
        // getValue will return the value of the cell.

        let value = 0;

        const addMark = (mark) =>
        {
            value = mark;
        }

        const getValue = () =>
        {
            return value;
        }

        return { addMark, getValue }
    }

    // gameController will have the flow of the game, player turns and who wins the game.
    function gameController( )
    {
    
        let board = gameBoard();
        // let gameOn = true;

        // if(gameOn)
        // {
        //     board = gameBoard();
        // }

        const players = [
            {
                name : '',
                mark : 1,
                score : 0
            },
            {
                name : '',
                mark : 2,
                score : 0
            }
        ];

        let activePlayer = players[0];

        // Switch function will change the active player to other player.
        const switchTurn = () => {

            activePlayer = ( activePlayer === players[0] ) ? players[1] : players[0];
            console.log(`${getActivePlayer().name}'s turn`);
        };

        const getActivePlayer = () => activePlayer;

        const printNewRound = () => {

            board.printBoard();

        };

        // playRound is how we play game. the attached row and column datasets is how we know we have 
        // clicked which square. 

        const playRound = (row, column) => {

            let winnerf = null;
            const boardArr = board.getBoard();

            if( boardArr[row][column].getValue() == 0)
            {
                    board.markCell(row, column, activePlayer.mark);
                    switchTurn();
                    printNewRound();
            }

            // Win game over condition.
            // 3.1. Check all rows for a win
            for (let i = 0; i < 3; i++) {
                // Check if all cells in the row have the same value (either 1 or 2)
                // If they do, the active player wins, and you should stop the game
                let winnerR1 = boardArr[ i ].every(ele => ele.getValue() == 1);
                let winnerR2 = boardArr[ i ].every(ele => ele.getValue() == 2);
                let winnerC1 = [ 0, 1, 2].every( j => boardArr[ j ][ i ].getValue() == 1);
                let winnerC2 = [ 0, 1, 2].every( j => boardArr[ j ][ i ].getValue() == 2);

                if(winnerR1 || winnerC1)
                {
                    winnerf = players[0];
                    break;
                }

                if(winnerR2 || winnerC2)
                {
                    winnerf = players[1];
                    break;
                }
            }

            let mainDigo = [];
            let antiDigo = [];

            let winnerDm1 = [ 0, 1, 2].every( j => boardArr[ j ][ j ].getValue() == 1);
            let winnerDm2 = [ 0, 1, 2].every( j => boardArr[ j ][ j ].getValue() == 2);
            let winnerDa1 = [ 0, 1, 2].every( j => boardArr[ j ][ 2 - j ].getValue() == 1);
            let winnerDa2 = [ 0, 1, 2].every( j => boardArr[ j ][ 2 - j  ].getValue() == 2);

            if(winnerDm1 || winnerDa1)
            {
                winnerf = players[0];
            }

            if(winnerDm2 || winnerDa2)
            {
                winnerf = players[1];
            }

            if(winnerf)
            {
                console.log(`Winner is ${winnerf.name} Let's go.`);
                winnerf.score++;
                console.log(`${winnerf.name}'s score is ${winnerf.score}`);
                board.reset();
            }
        
        }

        const reset = () =>{

            board.reset();

        }

        const changeNames = ( player1, player2 ) => {

            players[0].name = player1;
            players[1].name = player2

        }

        console.log('Start game');
        console.log(`${getActivePlayer().name}'s turn`);

        return { playRound, getActivePlayer, getBoard : board.getBoard, reset, changeNames }

    } 

    // const game = gameController();

    //  screenController is to control the UI of the screen 
    function screenController () {

        let game = gameController();

        const turnDiv = document.querySelector('.turn');
        const boardDiv = document.querySelector('.board');

        const namesB = document.querySelector('#namesB');

        if( namesB )
        {
            namesB.addEventListener('click', () => {

                event.preventDefault();
                    
                const form = document.querySelector('form');
    
                const player1n = document.querySelector('#player1');
                const player2n = document.querySelector('#player2');
    
                const player1Name = player1n.value;
                const player2Name = player2n.value;
    
                game.changeNames(player1Name, player2Name);;
    
                form.remove();
                updateScreen();
            })
        }

        function updateScreen()
        {
            boardDiv.textContent = '';
            // Get the current state of the board.
            const board = game.getBoard();
            const activePlayer = game.getActivePlayer();
            
            turnDiv.textContent = `${activePlayer.name}'s turn`;

            for(let row = 0; row < 3; row++)
            {
                for(let column = 0; column < 3; column++)
                {
                    // Anything clickable should be button.
                    const cell = document.createElement('button');
                    cell.textContent = board[row][column].getValue();
                    cell.classList.add('cell');
                    cell.dataset.row = row;
                    cell.dataset.column = column;
                    boardDiv.appendChild(cell);
                }
            }

            const resetB = document.createElement('button');
            resetB.textContent = 'Reset game.';
            boardDiv.appendChild(resetB);

            resetB.addEventListener('click', () => {
                game.reset();
                updateScreen();
            })
        }

        function squareClicked (e)
            {
                if(e.target.matches('.cell'))
                {
                    const row = parseInt(e.target.dataset.row, 10);
                    const column = parseInt(e.target.dataset.column, 10);

                    game.playRound(row, column);
                    updateScreen()
                }
            }

        boardDiv.addEventListener('click', squareClicked);

        if( !namesB )
        {
            updateScreen();
        }  
        // updateScreen();
    }
    
    screenController();