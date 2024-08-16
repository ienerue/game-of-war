let deckId = ""
let computerScore = 0
let myScore = 0

const newDeck = document.getElementById("new-deck")
const drawCards = document.getElementById("draw-cards")
const cardsLeft = document.getElementById("cards-left")
const cards = document.getElementById("cards")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")
const header = document.getElementById("header")

newDeck.addEventListener("click", function(){
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle")
        .then(response => response.json())
        .then(data => {
            computerScore = 0
            myScore = 0
            computerScoreEl.textContent = `Computer score: ${computerScore}`
            myScoreEl.textContent = `My score: ${myScore}`
            cards.innerHTML = `
                <div class="card-placeholder"></div>
                <div class="card-placeholder"></div>`
            drawCards.disabled = false
            deckId = data.deck_id
            cardsLeft.textContent = `Cards left: ${data.remaining}`
        })
})

drawCards.addEventListener("click", function(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(response => response.json())
        .then(data => {
            if (data.remaining > 0) {
                let cardImages = ``
                let cardsArray = []
                for (let card of data.cards) {
                    cardImages += `<img class="card" src="${card.image}">`
                    cardsArray.push(card)
                }
                cards.innerHTML = cardImages
                cardsLeft.textContent = `Cards left: ${data.remaining}`
                determineWinner(cardsArray)
            } else {
                cardsLeft.textContent = `No cards left`
                drawCards.disabled = true
                if (computerScore > myScore) {
                    header.textContent = "Computer won!"
                } else if (computerScore < myScore) {
                    header.textContent = "You won!"
                } else {
                    header.textContent = "It's a tie!"
                }
            }
            
        })
})

function determineWinner(array) {
    const cardValuesArray = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1Index = cardValuesArray.indexOf(array[0].value)
    const card2Index = cardValuesArray.indexOf(array[1].value)
    if (card1Index > card2Index) {
        computerScore++
        computerScoreEl.textContent = `Computer score: ${computerScore}`
    } else if (card1Index < card2Index) {
        myScore++
        myScoreEl.textContent = `My score: ${myScore}`
    }
}