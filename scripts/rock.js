const computerChoiceDisplay = document.getElementById("computer-choice");
const playerChoiceDisplay = document.getElementById("player-choice");
const resultDisplay = document.getElementById("result");
const possibleChoices = document.querySelectorAll("button");
let playerChoice
let computerChoice

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
    playerChoice = e.target.id
    playerChoiceDisplay.innerHTML = playerChoice
    generateComputerChoice()
    getResult()
}));

function generateComputerChoice() {
    const randomNumber = Math.floor(Math.random() * 3) + 1; // or use possibleChoices.length;
    
    if (randomNumber === 1) {
        computerChoice = "rock";
    };
    if (randomNumber === 2) {
        computerChoice = "paper";
    };
    if (randomNumber === 3) {
        computerChoice = "scissors";
    };
    computerChoiceDisplay.innerHTML = computerChoice
};

function getResult(){
    if (computerChoice === playerChoice) {
        result = "It's a draw!"
    }
    if (computerChoice === "rock" && playerChoice === "paper") {
        result = "Computer won!"
    }
    if (computerChoice === "rock" && playerChoice === "scissors") {
        result = "Player won!"
    }
    if (computerChoice === "paper" && playerChoice === "rock") {
        result = "Computer won!"
    }
    if (computerChoice === "scissors" && playerChoice === "rock") {
        result = "Computer won!"
    }
    if (computerChoice === "scissors" && playerChoice === "paper") {
        result = "Player won!"
    }
    if (computerChoice === "paper" && playerChoice === "scissors") {
        result = "Player won!"
    }
    resultDisplay.innerHTML = result
};