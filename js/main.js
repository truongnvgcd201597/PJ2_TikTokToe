import { CELL_VALUE, GAME_STATUS, TURN } from './constant.js';
import {
    getCellElementList,
    getCellListElement,
    getCurrentTurnElement,
    getGameStatusElement,
    getReplayButtonElement
} from './selectors.js'
import { checkGameStatus } from './untils.js';

/**
 * Global variables
 */
 let currentTurn = TURN.CROSS;
 let gameStatus = GAME_STATUS.PLAYING;
 let cellValues = new Array(9).fill("");
 
 function toggleTurn(){
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }

 }
 function updateGameStatus(newGameStatus){
     const getGameStatus = getGameStatusElement();
     getGameStatus.textContent = newGameStatus;
 }
 function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add("show");
  }
  function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove("show");
  }
 function highlightWinCell(winPositions){
    if(!winPositions || !Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error('Invalid win positions');
    }
     const cellElementList = getCellElementList();
     winPositions.forEach(x=>{
        cellElementList[x].classList.add('CELL_VALUE.WIN');
     })
 }
function handleCellClick(cell, index){
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    if(isEndGame || isClicked) return;
    //selected cell values
    cell.classList.add(currentTurn);
    //convert index position to XO figures
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
    toggleTurn();
    //check game status
    const game = checkGameStatus(cellValues);
    const getGameStatus = getGameStatusElement();
    switch(game.status){
        case GAME_STATUS.ENDED:{
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }
        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN:{
            updateGameStatus(game.status);
            showReplayButton();
            highlightWinCell(game.winPositions);
            break;
        }
        default:
            getGameStatus.textContent = game.status === GAME_STATUS.O_WIN ? GAME_STATUS.O_WIN : GAME_STATUS.PLAYING;
            break;
    }
}
function initCellElementList(){
    const liList = getCellElementList();
    liList.forEach((cell, index)=>{
    //    cell.addEventListener('click', ()=> handleCellClick(cell, index))}
    cell.dataset.idx = index;
   }
  )};
    //attach event click
    const ulElement = getCellListElement();
    if(ulElement){
        ulElement.addEventListener('click', (event)=>{
            if(event.target.tagName !== 'LI') return;
            const index = Number.parseInt(event.target.dataset.idx);
            console.log('click', event.target, index);
           handleCellClick(event.target, index);
        })
    }
 function resetGame() {
    // reset temp global vars
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");
  
    // reset dom elements
    // reset game status
    updateGameStatus(GAME_STATUS.PLAYING);
  
    // reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
      currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
      currentTurnElement.classList.add(TURN.CROSS);
    }
  
    // reset game board
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
      cellElement.className = "";
    }
  
    hideReplayButton();
  }
  function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
      replayButton.addEventListener("click", resetGame);
    }
  }
 /**
  * TODOs
  *
  * 1. Bind click event for all cells
  * 2. On cell click, do the following:
  *    - Toggle current turn
  *    - Mark current turn to the selected cell
  *    - Check game state: win, ended or playing
  *    - If game is win, highlight win cells
  *    - Not allow to re-click the cell having value.
  *
  * 3. If game is win or ended --> show replay button.
  * 4. On replay button click --> reset game to play again.
  *
  */
 (()=>{
    //bind click event for all li element
    initCellElementList();
    //bind click event for replay button
    initReplayButton();
 })()