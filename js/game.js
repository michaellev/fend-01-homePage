/**
 * Created by Michael Lev on 21/02/2017.
 */
/*************************/
/****** Handle game ******/
/*************************/

// Those are global variables, they stay alive
// and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var busy = false;

// This is a constant that we don't change during the game
// (we mark those with CAPITAL letters)
const TOTAL_COUPLES_COUNT = 6;

// Load audio files
const AUDIO_RIGHT = new Audio('../allData/game/sound/right.mp3');
const AUDIO_WRONG = new Audio('../allData/game/sound/wrong.mp3');
const AUDIO_WIN   = new Audio('../allData/game/sound/win.mp3');

var insideGame = false;
var timeStart, timeEnd, newTimeDurationSec;

// display_html_page_after_loading_complete - js part - start
document.getElementById("hideAll").style.display = "block";
window.onload = function()
{
    document.getElementById("hideAll").style.display = "none";
};
// display_html_page_after_loading_complete - js part - end

// stackoverflow javascript that executes after page load
// http://stackoverflow.com/questions/807878/javascript-that-executes-after-page-load
// http://stackoverflow.com/questions/1033398/execute-javascript-when-page-has-fully-loaded
// my selected solution:
// http://www.mredkj.com/javascript/plinko_rules.html
// https://msdn.microsoft.com/en-us/library/ms536957(v=vs.85).aspx
// https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState
//
// Initialization, to shuffle cards randomly right from the beginning.
// Do initialization once, just after page-load completes.
// put next line outside of functions so it'll occur when the page loads
document.onreadystatechange=fnStartInit;//google fnStartInit
function fnStartInit()
//document.onreadystatechange=function() //anonymous function also works
{
    if (document.readyState=="complete")
    {
        myInit();
    }
}
function localStorageIncrementCounter(){
    if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount)+1;
    } else {
        localStorage.clickcount = 1;
    }
    localStorage.clickcount %= 100;
}
function getLocalStorageUserName(){
    if (   localStorage.memoryMonstersUserName !== 'undefined'
        && localStorage.memoryMonstersUserName !== null){
        sessionStorage.idSpanPlayer = localStorage.memoryMonstersUserName;
        sessionStorage.isPlayer = "true";
    }
}function changePlayer(){
    if (sessionStorage.isAfterGame !== "true"){
        sessionStorage.isPlayer = "false"
    }
    sessionStorage.changingPlayer = 'true';
    myInit();
}
function myInit() {
    localStorageIncrementCounter();
    logg("entered. counter in 1-100 = *** " + localStorage.clickcount + " ***");
    logg("  localStorage.memoryMonstersUserName = " + localStorage.memoryMonstersUserName);
    logg("  sessionStorage.idSpanPlayer = "         + sessionStorage.idSpanPlayer);
    getLocalStorageUserName();
    if (sessionStorage.playingAgain          === 'true'
        || sessionStorage.isAfterGame        === "true"
        || sessionStorage.clickedOutsideTabs === "true"){
        sessionStorage.playingAgain       = 'false';
    }
    if (sessionStorage.isPlayer === "true"){
        document.getElementById("idSpanPlayer")      .innerHTML = sessionStorage.idSpanPlayer;
        document.getElementById("idSpanPlayerPrev")  .innerHTML = sessionStorage.idSpanPlayer;
        document.getElementById("idSpanBestGameTime").innerHTML = sessionStorage.storedUserBestTimeSec;
        unhideItem("idBtnChangePlayer");
        if (sessionStorage.isAfterGame === "true") {
            unhideItem("idElBestGameTime");
        }
    }
    if (sessionStorage.isAfterGame === "true" || sessionStorage.changingPlayer === 'true'){
        logg("  -> reset()");
        reset();
        sessionStorage.isAfterGame        = "false";
        sessionStorage.clickedOutsideTabs = "false";
        sessionStorage.changingPlayer     = 'false';
    } else {
        logg("  -> promptPlayer()");
        promptPlayer();
    }
    logg("  exit");
}
function promptPlayer(){
    if (sessionStorage.isPlayer !== "true"){
        sessionStorage.idSpanPlayer = "פלוני אלמוני";
    }
    sessionStorage.    idSpanPlayer = prompt("בבקשה הכנס את שמך טרם שתתחיל במשחק", sessionStorage.idSpanPlayer);
    if (sessionStorage.idSpanPlayer === "null" ||
        sessionStorage.idSpanPlayer === "undefined" ||
        sessionStorage.idSpanPlayer === "" ||
        sessionStorage.idSpanPlayer === "פלוני אלמוני"){
        promptPlayer();
    }
    localStorage.memoryMonstersUserName = sessionStorage.idSpanPlayer;
    sessionStorage.isPlayer = "true";
    document.getElementById("idSpanPlayer")    .innerHTML = sessionStorage.idSpanPlayer;
    document.getElementById("idSpanPlayerPrev").innerHTML = sessionStorage.idSpanPlayer;
    unhideItem("idBtnChangePlayer");
    sessionStorage.storedUserBestTimeSec = (-1).toString();
    document.getElementById("idSpanBestGameTime").innerHTML = sessionStorage.storedUserBestTimeSec;
    var oldTimeDurationSec = Number(sessionStorage.storedUserBestTimeSec);
    reset();
}
function playAgain() {
    sessionStorage.playingAgain = 'true';
    reset();
    sessionStorage.playingAgain = 'false';
}
// prepare to enable game-start
function reset() {
    var cards = document.getElementsByClassName("card");
    for (var i = 0; i < cards.length; ++i) {
        cards[i].classList.remove('flipped');
    }
    elPreviousCard      = null;
    flippedCouplesCount = 0;
    busy                = false;
    shuffleCardsRandomly();
    insideGame          = false;
    hideItem('idBtnPlayAgain');
}
function measureGameTime(){
    timeEnd = Date.now();
    newTimeDurationSec = (timeEnd - timeStart)/1000;
    var oldTimeDurationSec = Number(sessionStorage.storedUserBestTimeSec);
    if (oldTimeDurationSec === -1 || newTimeDurationSec < oldTimeDurationSec){
        sessionStorage.storedUserBestTimeSec = newTimeDurationSec.toString();
    }
    sessionStorage.isAfterGame = "true";
    unhideItem('idBtnPlayAgain');
    unhideItem("idElBestGameTime");
    document.getElementById("idSpanBestGameTime").innerHTML = sessionStorage.storedUserBestTimeSec;
}
function toggle_visibility(id) {
    var e = document.getElementById(id);
    if(e.style.display === 'block') {
        e.style.display = 'none';
    }
    else {
        e.style.display = 'block';
    }
}
function unhideItem(id) {
    var e = document.getElementById(id);
    e.style.display = 'block';
}
function hideItem(id) {
    var e = document.getElementById(id);
    e.style.display = 'none';
}

// rearrange all cards on board randomly, for next game
// http://stackoverflow.com/questions/7070054/javascript-shuffle-html-list-element-order
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffleCardsRandomly(){
    // exploit the fact that when you append a node,
    // it's removed from its old place.
    var board = document.querySelector('.board');
    for (var i = board.children.length; i >= 1; i--) {
        // random index_in_array such that 0 ≤ index_in_array ≤ length-1
        var index = Math.random() * i | 0;
        board.appendChild(board.children[index]);
        // same as
        //board.appendChild(board.children[Math.floor(Math.random() * i)]);
    }
}

// only after handling current click has completely finished,
// enable handling next button click
function clearBusy(){
    busy = false;
}

// This function is called whenever the user click a card
function cardClicked(elCard) {
    // do nothing if busy
    if (busy){
        return;
    }

    if (!insideGame){
        insideGame = true;
        timeStart = Date.now();
    }

    // do nothing, if user clicked an already flipped card
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // start doing function task
    busy = true;

    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
        clearBusy();
    } else {
        // get the data-card attribute's value from both cards
        var card1Type = elPreviousCard.getAttribute('cardType');
        var card2Type =         elCard.getAttribute('cardType');

        // A match?
        if (card1Type !== card2Type){
            // No match... Play audio, then flip both cards back
            AUDIO_WRONG.play();//asynchronously plays 1 second
            setTimeout(function () {//do after audio duration time
                elCard.        classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                clearBusy();
            }, 1100);
        } else {
            // Yes! a match! :-)

            //handle flipped cards pair - leave them flipped
            flippedCouplesCount++;
            elPreviousCard = null;

            // All card pairs flipped?
            if (flippedCouplesCount !== TOTAL_COUPLES_COUNT) {
                // Not all cards flipped yet...
                AUDIO_RIGHT.play();//asynchronously plays 2 seconds
                setTimeout(function(){//do after audio duration time
                    clearBusy();
                }, 2100);
            } else {
                // All cards flipped!!!!
                measureGameTime();
                AUDIO_WIN.play();//asynchronously plays 5 seconds
                setTimeout(function(){//do after audio duration time
                    unhideItem('idBtnPlayAgain');
                }, 5100);
            }
        }
    }
}
function logg(message) {
    var caller = arguments.callee.caller.name;
    console.log(caller + ": " + message);
}