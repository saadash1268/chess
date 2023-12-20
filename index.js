// Setting up the chessboard and related elements:
//   Selecting the gameboard, player display, and info display elements from the DOM
//   Defining the width of the chessboard grid (8 squares per row)
const gameboard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
let playerGo = 'black'
playerDisplay.textContent = 'black'


// Defining the initial arrangement of chess pieces on the board:
//   Using variables representing SVG images of chess pieces
//   The array 'startPieces' defines the initial layout of pieces on the board
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,     
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,     
    rook, knight, bishop, queen, king, bishop, knight, rook
]



function createBoard(){
    startPieces.forEach((startPiece, i) => {
       const square = document.createElement('div');
       square.classList.add('square');
       square.innerHTML = startPiece;
       square.firstChild && square.firstChild.setAttribute('draggable', true);
       square.setAttribute('square-id', i);
       const row = Math.floor((63 - i) / 8) + 1
       if(row % 2 === 0){
        square.classList.add(i % 2 === 0 ? "biege" : "brown")
       } else {
        square.classList.add(i % 2 === 0 ? "brown" : "biege")
       }
       if(i <= 15){
        square.firstChild.firstChild.classList.add('black')
       }
       if(i >= 48){
        square.firstChild.firstChild.classList.add('white')
       }
       gameboard.append(square);
    })
}

createBoard();


const allSquares = document.querySelectorAll(".square");
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)

})

let startPositionId;
let draggedElement; 

function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e){
    e.preventDefault()
}

function dragDrop(e){
    e.stopPropagation()
    const taken = e.target.classList.contains('piece')
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild ?.classList.contains(opponentGo)


    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()
            return
        }

        if(taken && !takenByOpponent){
            infoDisplay.textContent = "You cannot go here!"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            
            return
        }
        if(valid) {
                e.target.append(draggedElement)
                changePlayer()
                return

        }
    }
    
    
}


function checkIfValid(target){
    const targetId = Numver(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId)
    const piece = draggedElement.id

    switch(piece){
        case 'pawn' : 
            const starterRow = [8,9,10,11,12,13,14,15]
            if(starterRow.includes(startId) && startId + width * 2 === targetId ||
               startId + width === targetId ||
               startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width -1}"]`).firstChild ||
               startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width +1}"]`).firstChild 

            ){
                return true  
            }
            break;
            case 'knight': 
                if( startId + width * 2 - 1 === targetId ||
                    startId + width * 2 + 1 === targetId ||
                    startId + width * 2 - 2 === targetId ||
                    startId + width * 2 + 2 === targetId ||
                    startId - width * 2 - 1 === targetId ||
                    startId - width * 2 + 1 === targetId ||
                    startId - width * 2 - 2 === targetId ||
                    startId - width * 2 + 2 === targetId 
                    ) {
                        return true 
                    }
            break;
            case 'bishop':
                if (
                    startId + width + 1 === targetId || 
                    startId + width * 2 + 2 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                    startId + width * 3 + 3 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                    startId + width * 4 + 4 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                    startId + width * 5 + 5 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                    startId + width * 6 + 6 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                    startId + width * 7 + 7 && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                )        
    }
}



function changePlayer(){
    if(playerGo === "black"){
        reverseIds()
        playerGo = "white"
        playerDisplay.textContent = 'white'
    } else {
        reverseIds()
        playerGo = "black"
        playerDisplay.textContent = 'black'

    }
}

function reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', (width * width - 1) -i ))
}

function reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}