var humanPlayer = 'X';
var aiPlayer = 'O';
var winningPosition = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
]
var cells = document.querySelectorAll(".cell");     //returns a Nodelist object
var origBoard;
var aiScore = 0;
var humanScore = 0;

start();        //initial run of the start function

function start(){
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];        //original board values
    document.querySelector(".finish").style.display = "none";
    document.getElementById("aiscore").innerHTML = "AI: " + aiScore;         //set the scores
    document.getElementById("humanscore").innerHTML = "You: " + humanScore;
    for(var  i=0; i<cells.length; i+=1){
        cells[i].innerHTML = ' ';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', humanTurn, false);
    }
}

function humanTurn(square){
    if(typeof(origBoard[square.target.id]) == 'number'){
        turn(square.target.id, humanPlayer);     //call this on click event as the human is gonna click it 
        if(!isDraw() && !isWinner(origBoard, humanPlayer)){
            turn(bestMove(), aiPlayer);
        }
    }
}

function turn(squareID, player){
    origBoard[squareID] = player;       //manipulate the array to contain the player's sign i.e X/O
    document.getElementById(squareID).innerHTML = player;        //show it on the grid
    let isWon = isWinner(origBoard, player);
    if(isWon){
        winAction(player);
    }
}

var winDex = 0;
function isWinner(board, player){
    var winFlag = 0;
    for(let i=0; i<winningPosition.length; i+=1){
        if(board[winningPosition[i][0]] == player && 
           board[winningPosition[i][1]] == player && 
           board[winningPosition[i][2]] == player){
                winFlag = 1;
                winDex = i;
                break;      //break out of the loop        
            }
    }
    return winFlag;
}   

function winAction(player){
     //set bgcolor to green to indicate victory
     document.getElementById(winningPosition[winDex][0]).style.backgroundColor = "lightgreen";
     document.getElementById(winningPosition[winDex][1]).style.backgroundColor = "lightgreen";
     document.getElementById(winningPosition[winDex][2]).style.backgroundColor = "lightgreen";
     //disable clicks
     for(let i = 0; i < cells.length; i++){
         cells[i].removeEventListener('click', humanTurn, false)
     }
     document.querySelector(".finish").style.display = "block";
     if(player == humanPlayer){
         document.querySelector(".finish").innerHTML = "You WIN!!";
         humanScore += 1;
         document.getElementById("humanscore").innerHTML = "AI: " + aiScore; 
     }

     if(player == aiPlayer){
        document.querySelector(".finish").innerHTML = "You LOSE!!";
        aiScore += 1;
        document.getElementById("aiscore").innerHTML = "AI: " + aiScore; 

     }
     else{
        document.querySelector(".finish").innerHTML = "Draw";
     }
}

function emptySquares() {
	return origBoard.filter(s => s!="X" && s!="O");
}

function isDraw(){
    var availLocs = emptySquares();

    if(availLocs.length == 0){      //i.e no more places to move i.e draw the X
        for(let i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "crimson";
            cells[i].removeEventListener('click', humanTurn, false)
        }
        document.querySelector(".finish").style.display = "block";
        document.querySelector(".finish").style.backgroundColor = "chocolate";
        document.querySelector(".finish").innerHTML = "DRAW!";
        return true;
    } 
    else{
        return false;
    }
}

//minimax function returns an object with the best move index and result
function minimax(newBoard, player){

    var availLocs = emptySquares();

    //check for terminal states
    if(isWinner(newBoard, humanPlayer)){
        return {score: -10};
    }else if(isWinner(newBoard, aiPlayer)){
        return {score: 10};
    }else if(availLocs.length == 0){
        return {score: 0};
    }

    //to collect scores from each empty spot:
    var moves = [];     //this will be an array of objects move = {index: '', score: ''}
    

    for(let i = 0; i < availLocs.length; i+=1){
        var move = {};
        move.index = newBoard[availLocs[i]];
        newBoard[availLocs[i]] = player;        //play the move to check

        if(player == aiPlayer){
            var result = minimax(newBoard, humanPlayer);        //recursive call
            move.score = result.score;      //note that result will be an object, we access it's score attribute
        }
        else if(player == humanPlayer){
            var result = minimax(newBoard, aiPlayer);           //recursive call
            move.score = result.score;
        }

        newBoard[availLocs[i]] = move.index;        //clear the newBoard for the next iteration

        moves.push(move);   //push the move object to the moves array

    }

    //Now let's find the best move
    //The minimax algorithm should return the highest score for the AI player
    //and lowest score for the human player
    var bestMove;

    //minimax should maximise the AI score
    if(player === aiPlayer){
        var bestScore = -99999;     //set it to a low value
        for(let i = 0; i  < moves.length; i+=1){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;           //note that 'i' is just the index of the object
            }  
        }
    }   //aiPlayer best

    //minimax should minimise the human score
    else if(player === humanPlayer){
        var bestScore = 99999;     //set it to a high value
        for(let i = 0; i < moves.   length; i+=1){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;           //note that 'i' is just the index of the object
            }
        }
    }   //humanPlayer best (worst as it select the lowest human score)

    return moves[bestMove];     //returns the best move object from the moves array
}



function bestMove(){
//Uncomment the following code to play with a 'dumb' (randomized) opponent
/*    availLocs = origBoard.filter(s => typeof(s)=='number');
    arbitraryPosition = Math.floor(Math.random() * availLocs.length);

    return availLocs[arbitraryPosition];
*/
    return minimax(origBoard, aiPlayer).index;
}

