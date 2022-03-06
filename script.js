//tic tac toe game
//the-odin-project exercise
//author: Julius Palon

//gameboard
//scope: array of each player's marks
//update the gameboard array with each player's turn?
const gameBoard = (function(){
    const board_array = [];

    const _playGame = function(){
        const playBtn = document.querySelector('#btn-play');
        document.querySelector('.X-score').textContent = '0';
        document.querySelector('.O-score').textContent = '0';
        playBtn.addEventListener('click', ()=>{
            document.querySelector('.game-play').style.display = "none";
            document.querySelector('.game-options').style.display = "grid";
            _startGame();
        })
    }

    const _startGame = function(){
        const startBtn = document.querySelector('#btn-start');
        startBtn.addEventListener('click', ()=>{
            let _player1 = document.querySelector('#player1').value;
            let _player2 = document.querySelector('#player2').value;
            if (_player1 === '' || _player2 === ''){
                alert('Please provide the names for both players.')
                return false;
            }
            document.querySelector('.game-options').style.display = "none";
            document.querySelector('.overlay').style.display = "none";
            document.querySelector('.player1').textContent = _player1;
            document.querySelector('.player2').textContent = _player2;
            document.querySelector('.target-score').textContent = document.querySelector('.option-scores').value;
            loopGame();
        })
    }
   
    const _updateArray = (box_num, marker) => {
        if (box_num < 1) return;
        board_array[box_num-1] = marker;
    }

    const _clearArray = () => {
        board_array.length = 0;
        const boxes = document.getElementsByClassName('box');
        for(let x in Array.from(boxes)){
            boxes[x].textContent = '';
            boxes[x].classList.remove('blinking');
        }
    }

    const _winningPatterns = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ]

    const _createPlayer = (name, marker) => {
        const _score = [];
        const _markBox = function(element, marker){
            if (element === null) return;
            element.textContent = marker;
        }
    
        const _updateScore = function(){
            _score.push(null); //populate score array then just count the length
            // console.log(this);
        }
    
        const _resetScore = function(){
            _score.length = 0;
            // console.log(this);
        }
    
        return {
            name: name,
            marker: marker,
            markBox: _markBox,
            updateScore: _updateScore,
            resetScore: _resetScore,
            "score": _score,
        }
    }

    const _checkWinner = function (marker){
        //get X/O position
        const marker_positions = [];
        for (let x=0; x<=board_array.length; x++){
            if (board_array[x] === marker) {
                marker_positions.push(x+1); // offset to 1 since box numbering starts with 1
            }
        }

        //compare X and O positions to the winning patterns
        const comparePlayerPatterns = function(marker_array){
            let matches = 0; //init
            let winningCombi = [];
            if (marker_array.length < 3) return false;
            for (let n=0; n<_winningPatterns.length; n++){
                matches = 0; // reset for every pattern
                winningCombi.length = 0; // reset for every pattern
                for (let m=0; m<_winningPatterns[n].length; m++){
                    for (let i=0; i<marker_array.length; i++){
                        if(marker_array[i] === _winningPatterns[n][m]){
                            matches++;
                            winningCombi.push(marker_array[i]);
                            if (matches === 3) {
                                blinkCombination(winningCombi);
                                return true; // found a winning combi
                            }
                        }
                    }
                }
            }
        }
        return (comparePlayerPatterns(marker_positions) || false);        
    }

    function blinkCombination (blocks){
        for (let x in blocks){
            document.querySelector(`div[data-boxnum="${blocks[x]}"]`).classList.add('blinking')
        }
    }

    return {
        playGame: _playGame,
        updateBoxes: _updateArray,
        resetGame: _clearArray,      
        createPlayer: _createPlayer,
        checkWinner: _checkWinner,
    }

})();

const loopGame = () => {
    const player1 = gameBoard.createPlayer(document.querySelector('.player1').textContent,"X");
    const player2 = gameBoard.createPlayer(document.querySelector('.player2').textContent,"O");   
    restartStats();

    //set player's turn from the options
    let current_marker, first_turn, round_marker;
    let turn = document.querySelector('input[name="turn"]:checked');
    switch(turn.value){
        case("X"): {
            first_turn = 'X';
            break;
        }
        case("O"): {
            first_turn = 'O';
            break;
        }
        case("alternate"): {
            first_turn = 'alternate';
            break;
        }
    }

    
    if (first_turn === "alternate") {
        round_marker = "X";
    } else {
        round_marker = first_turn;
    }

    let boxes = document.getElementsByClassName('box');
    let box_number = null;
    let box_filled = 0;
    current_marker = round_marker;
    highlightActivePlayer(current_marker);
    const gameBoardBoxes = Array.from(boxes);
    gameBoardBoxes.forEach(box => {
        box.addEventListener('click',()=>{    
            box_number = box.dataset.boxnum;
            if (box.textContent !== '') return;
            if (current_marker === 'X'){
                player1.markBox(box, player1.marker);
                gameBoard.updateBoxes(box_number,player1.marker);
                if (box_filled > 3){
                    if(gameBoard.checkWinner(player1.marker)){
                        declareRoundWinner(player1);
                        return;
                    }
                }
                current_marker = "O";
                box_filled++;
            } else {
                player1.markBox(box,player2.marker);
                gameBoard.updateBoxes(box_number,player2.marker);
                if (box_filled > 3){
                    if(gameBoard.checkWinner(player2.marker)){
                        declareRoundWinner(player2);
                        return;
                    }
                }
                current_marker = "X";
                box_filled++;
            }
            highlightActivePlayer(current_marker);
            floatingMarker.textContent = current_marker;
            if (box_filled === 9){
                declareRoundWinner(null);
            }           
        })
    });

    function declareRoundWinner(player){
        let message = document.querySelector('.winner');
        document.querySelector('.notification').style.opacity = 1;
        if (player !== null){
            message.textContent = `${player.name} wins this one!`;
            player.updateScore();
            document.querySelector(`.${player.marker}-score`).textContent = player.score.length;
        } else {
            message.textContent = "It's a tie! Try again on the next round.";
        }
        box_filled = 0;
        toggleBoardClicking();
        if (player !==null) checkForOverAllWinner(player);
    }

    function toggleBoardClicking(){
        for (let x in Array.from(boxes)){
            boxes[x].classList.toggle("click-disabled");
        }
    }

    let nextBtn = document.getElementById('nextRound')
    nextBtn.addEventListener('click', ()=>{
        gameBoard.resetGame();
        document.querySelector('.notification').style.opacity = 0;
        toggleBoardClicking();
        if (first_turn === "alternate"){
            if (round_marker === "X"){
                round_marker = "O";
            } else {
                round_marker = "X";
            }
        }
        current_marker = round_marker;
        highlightActivePlayer(current_marker);
    })

    function highlightActivePlayer(marker){
        let player1 = document.querySelector('.player1');
        let player2 = document.querySelector('.player2');
        if (marker === 'X'){
            player1.classList.add('active-player');
            player2.classList.remove('active-player');
        } else {
            player2.classList.add('active-player');
            player1.classList.remove('active-player');
        }
    }

    let gameboard = document.querySelector('.game-board');
    let floatingMarker = document.querySelector('.mouse-marker');
    const offset = -10;
    gameboard.addEventListener('mousemove', (e)=>{
        floatingMarker.style.top = e.clientY - offset + 'px';
        floatingMarker.style.left = e.clientX + offset+ 'px';
        floatingMarker.textContent = current_marker;
        gameboard.style.cursor = 'none';
     })

    gameboard.addEventListener('mouseout', ()=>{
        floatingMarker.textContent = "";
    })

    function checkForOverAllWinner(player){
        if (player.score.length === parseInt(document.querySelector('.option-scores').value)){
            setTimeout(function(){
                alert(`${player.name} is the final winner! Congratulations.`)
                if(confirm('Play another set?\nClick OK to Reset the game,\nCancel to continue playing...')){
                    location.reload();
                } else {
                    let updated_target = parseInt(document.querySelector('.option-scores').value) + 5;
                    document.querySelector('.option-scores').value = updated_target;
                    document.querySelector('.target-score').textContent = updated_target;
                    return false;
                }
            }, 1000);
        }
    }

    function restartStats(){
        delete player1, player2;
        player1.resetScore();
        player2.resetScore();
        gameBoard.resetGame();
        gameBoard.playGame();
    }
} 

gameBoard.playGame();
