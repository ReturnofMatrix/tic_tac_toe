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
        let gameOn = true;
        let draw = false;

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

            const boardArr = board.getBoard();
            let notSame = false;

            if( boardArr[row][column].getValue() == 0)
            {
                board.markCell(row, column, activePlayer.mark);
                notSame = true;
            }

            // Win game over condition.
            // 3.1. Check all rows for a win
            let winnerf = null;

            // Check rows, columns, and diagonals
            for (let i = 0; i < 3; i++) {
                // Row and column checks
                const rowWinner1 = boardArr[i].every(cell => cell.getValue() === 1);
                const rowWinner2 = boardArr[i].every(cell => cell.getValue() === 2);
                const colWinner1 = [0, 1, 2].every(j => boardArr[j][i].getValue() === 1);
                const colWinner2 = [0, 1, 2].every(j => boardArr[j][i].getValue() === 2);

                if (rowWinner1 || colWinner1) {
                    winnerf = players[0];
                    break; // Stop further checks
                }

                if (rowWinner2 || colWinner2) {
                    winnerf = players[1];
                    break; // Stop further checks
                }
            }

            // Check diagonals
            if (!winnerf) {
                const mainDiagonalWinner1 = [0, 1, 2].every(i => boardArr[i][i].getValue() === 1);
                const mainDiagonalWinner2 = [0, 1, 2].every(i => boardArr[i][i].getValue() === 2);
                const antiDiagonalWinner1 = [0, 1, 2].every(i => boardArr[i][2 - i].getValue() === 1);
                const antiDiagonalWinner2 = [0, 1, 2].every(i => boardArr[i][2 - i].getValue() === 2);

                if (mainDiagonalWinner1 || antiDiagonalWinner1) {
                    winnerf = players[0];
                } else if (mainDiagonalWinner2 || antiDiagonalWinner2) {
                    winnerf = players[1];
                }
            }

            // Announce the winner
            if (winnerf) 
                {
                    console.log(`Winner is ${getActivePlayer().name}! Let's go.`);
                    getActivePlayer().score++;
                    console.log(`${getActivePlayer().name}'s score is ${getActivePlayer().score}`);
                    // board.reset();
                    gameOn = false;
                }
            
            //Draw condition if all cells value is 1 or 2 and winnerf == null then draw.
            let ttt = true;
            for(let row = 0; row < 3; row++)
            {
                for( let column = 0; column < 3; column++)
                {
                    if(boardArr[row][column].getValue() == 0)
                    {
                        ttt = false; 
                        break;
                    }
                }
            }

            if(ttt && !winnerf)
            {
                // board.reset();
                gameOn = false;
                draw = true;
            }

            if(gameOn && notSame)
            {
                switchTurn();
                
            }
        
        }

        const drawF = () => draw;

        const drawC = () => {
            draw = false;
        }

        const reset = () =>{

            board.reset();
            draw = false;
            gameOn = true;

        }

        const changeNames = ( player1, player2 ) => {

            players[0].name = player1;
            players[1].name = player2

        }

        const gameOnf = () => {
            return gameOn;
        }

        const getPlayers = () => players;

        const changeOn = () => {
            gameOn = true;
        }

        return {printNewRound, playRound, getActivePlayer, getBoard : board.getBoard, reset, changeNames, gameOnf, getPlayers, changeOn, drawC, drawF }

    } 

    //  screenController is to control the UI of the screen 
    function screenController () {

        let game = gameController();

        const turnDiv = document.querySelector('.turn');
        const boardDiv = document.querySelector('.board');
        const containerDiv = document.querySelector('.container');

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
            if(containerDiv.style.display == 'none')
            {
                    containerDiv.style.display = 'block';
            }
            // boardDiv.style.display = 'grid';
            boardDiv.textContent = '';
            // Get the current state of the board.
            const board = game.getBoard();
            if(game.gameOnf() == false)
                {
                    game.printNewRound();
            }
            const activePlayer = game.getActivePlayer();
            
            turnDiv.textContent = `${activePlayer.name}'s turn`;

            for(let row = 0; row < 3; row++)
            {
                for(let column = 0; column < 3; column++)
                {
                    // Anything clickable should be button.
                    const cell = document.createElement('button');
                    let val = board[row][column].getValue();
                    if(val == 0)
                    {
                        cell.textContent = ' ';
                    }else if(val == 1)
                    {
                            cell.textContent = 'X';
                    }else if(val == 2)
                    {
                        cell.textContent = 'O';
                    }
                    cell.classList.add('cell');
                    cell.dataset.row = row;
                    cell.dataset.column = column;
                    boardDiv.appendChild(cell);
                }
            }

            const resetB = document.querySelector('.reset');

            if(!resetB){
                const resetB = document.createElement('button');
                resetB.classList.add('reset');
                resetB.textContent = 'Reset game.';
                containerDiv.appendChild(resetB);

                resetB.addEventListener('click', () => {
                    game.reset();
                    updateScreen();
                })
            }
        }

        function squareClicked (e)
        {
            if (!game.gameOnf())
            {
                return;
            }

            if(e.target.matches('.cell'))
            {
                const row = parseInt(e.target.dataset.row, 10);
                const column = parseInt(e.target.dataset.column, 10);

                game.playRound(row, column);
                    // If round is finished that is winner is declared. gameOn vari is set to false. and 
                    // score card displayed for player and score.

                if( game.gameOnf() == false )
                {
                        const resultDiv = document.createElement('div');
                        resultDiv.classList.add('result');
                        const body = document.querySelector('body');

                        // Winner header after round.
                        const h2 = document.createElement('h2');

                        if(game.drawF())
                        {
                            turnDiv.textContent = 'Match is draw !';
                            h2.textContent = 'Match is draw !';
                            game.drawC();
                        }
                        else
                        {
                            turnDiv.textContent = `Winner is ${game.getActivePlayer().name} !`;
                            h2.textContent = `Winner is ${game.getActivePlayer().name} !`;
                        }
                        resultDiv.appendChild(h2);
                        updateScreen();

                        setTimeout( () => {
                        containerDiv.style.display = 'none';
                            // Score table. with name and score.
                        const table = document.createElement('table');
                        const thead = document.createElement('thead');
                        const hrow = document.createElement('tr');

                        let headers = [ 'Name', 'Score' ];

                        for( const header of headers)
                        {
                            const th = document.createElement('th');
                            th.textContent = header;
                            hrow.appendChild(th);
                        }

                        thead.appendChild(hrow);
                        table.appendChild(thead);

                        let data = game.getPlayers();

                        for( const player of data)
                        {
                            const drow = document.createElement('tr');

                            for( const keys of Object.keys(player))
                            {
                                if(keys == 'name' || keys == 'score')
                                {
                                    const td = document.createElement('td');
                                    td.textContent = player[keys]
                                    drow.appendChild(td); 
                                }
                            }

                            table.appendChild(drow);
                        }

                        const caption = document.createElement('caption');
                        const captext = document.createTextNode('Score Card');
                        caption.appendChild(captext);
                        table.appendChild(caption);

                        resultDiv.appendChild(table);

                        // playAgain for same game new set.
                        const playAgain = document.createElement('button');
                        playAgain.textContent = 'Play Again';

                        playAgain.addEventListener('click', () => {

                            event.preventDefault();
                            game.reset();
                            updateScreen();
                            game.changeOn();
                            resultDiv.remove();
                        })
                        resultDiv.appendChild(playAgain);

                        // newAgain for new game.
                        const newGame = document.createElement('button');
                        newGame.textContent = 'New Game';

                        newGame.addEventListener('click', () => {

                            event.preventDefault();
                            location.reload();
                        })
                        resultDiv.appendChild(newGame);
                        body.appendChild(resultDiv);
                        }, 1500);                        
                }

                    if(game.gameOnf())
                    {
                        updateScreen();
                    }
            }
        }

        boardDiv.addEventListener('click', squareClicked);
    }
    
screenController();


// PLayer turn is changing even after you click the occupied square. 
// It should not change the  turn . styling of result display .