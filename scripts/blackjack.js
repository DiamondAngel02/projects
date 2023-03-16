// Before game starts
let player = {
    name: "Lisa",
    chips: 0
}

let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = ""

// DOM
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");
let playerEl = document.getElementById("player-el");
let aceEl = document.getElementById("ace-el");
let elevenEl = document.getElementById("eleven-el");


playerEl.textContent = player.name + ": $" + player.chips

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1;
    if (randomNumber > 10) {
        return 10;
    } else if (randomNumber === 1) {
        return 11;
    } else {
        return randomNumber;
    };
}

function startGame() { //function starts when start button pressed
    isAlive = true;
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    cards = [firstCard, secondCard]; //object
    sum = firstCard + secondCard;
    renderGame();

}

function renderGame() {
    cardsEl.textContent = "Cards: ";
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " ";
    }

    sumEl.textContent = "Sum: " + sum;
   
    let message = "Do you want to draw a new card?";

    if (sum <= 20) {
        
    } else if (sum === 21){
        message = "You've got Blackjack!";
        hasBlackJack = true;
        addChips();
    } else {
        message = "You're out of the game!";
        isAlive = false;
        removeChips();
    }

    
    messageEl.textContent = message;
}

function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard();
    
        sum += card;
        cards.push(card)
        renderGame()
    }
    hasBlackJack = false;
}

function addChips() {
    if (isAlive === true && hasBlackJack === true) {
        player.chips += 50;
        playerEl.textContent = player.name + ": $" + player.chips
        
    }
}

function removeChips() {
    if (isAlive === false && hasBlackJack === false) {
        player.chips -= 1;
        // if (player.chips < 0) {
        //     player.chips = 0;
        // } // If you dont want to get negative chips
        playerEl.textContent = player.name + ": $" + player.chips
        
    }
}
