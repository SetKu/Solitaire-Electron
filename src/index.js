let uuid = require('uuid');
/* Static Game Elements */
var gameStockClothRevealedCards = document.querySelector('.game__stock-cloth__revealed-cards');
var gameWorkingClothPiles = document.querySelector('.game__working-cloth__piles');
var gameFoundationCloth = document.querySelector('.game__foundation-cloth');
var gameFoundationClothSpades = document.querySelector('.game__foundation-cloth__spades');
var gameFoundationClothClubs = document.querySelector('.game__foundation-cloth__clubs');
var gameFoundationClothHearts = document.querySelector('.game__foundation-cloth__hearts');
var gameFoundationClothDiamonds = document.querySelector('.game__foundation-cloth__diamonds');
/* Data Model */
var SuitColors;
(function (SuitColors) {
    SuitColors["black"] = "black";
    SuitColors["red"] = "red";
})(SuitColors || (SuitColors = {}));
/*
* Deck and Card class naming structure inspired by Web Dev Simplified's video on recreating the card game war for the web.
* Web Dev Simplified. (2020, November 14). "How To Build A Simple Card Game With JavaScript." YouTube. Retrieved November 23, 2021, from https://youtu.be/NxRwIZWjLtE.
*/
var Suits;
(function (Suits) {
    Suits["spades"] = "spades";
    Suits["clubs"] = "clubs";
    Suits["hearts"] = "hearts";
    Suits["diamonds"] = "diamonds";
})(Suits || (Suits = {}));
var Values;
(function (Values) {
    Values["ace"] = "A";
    Values["two"] = "2";
    Values["three"] = "3";
    Values["four"] = "4";
    Values["five"] = "5";
    Values["six"] = "6";
    Values["seven"] = "7";
    Values["eight"] = "8";
    Values["nine"] = "9";
    Values["ten"] = "10";
    Values["jack"] = "J";
    Values["queen"] = "Q";
    Values["king"] = "K";
})(Values || (Values = {}));
class State {
    constructor() {
        this.resetState();
    }
    resetState() {
        this.stockDeck = Deck.newDeck().shuffled();
        this.stockRevealedCards = [];
        let workingPiles = [];
        for (let iA = 1; iA < 8; iA++) {
            var pile = [];
            for (let iB = 0; iB < iA; iB++) {
                pile.push(this.stockDeck.cards.pop());
            }
            workingPiles.push(pile);
        }
        this.workingPiles = workingPiles;
        this.foundationDecks = {
            spades: new Array(),
            clubs: new Array(),
            hearts: new Array(),
            diamonds: new Array()
        };
    }
    forceUpdateUI() {
        gameStockClothRevealedCards.innerHTML = "";
        this.stockRevealedCards.forEach((card) => {
            gameStockClothRevealedCards.innerHTML += card.html + "\n";
        });
        for (let i = 0; i < 7; i++) {
            const pile = gameWorkingClothPiles.children[i];
            pile.innerHTML = "";
            const cards = this.workingPiles[i];
            for (let i = 0; i < cards.length; i++) {
                if (i == cards.length - 1) {
                    pile.innerHTML += cards[i].html;
                }
                else {
                    pile.innerHTML += Card.faceDownHTML;
                }
            }
        }
        styleAllPiles();
        for (const key in this.foundationDecks) {
            if (this.foundationDecks[key].length != 0) {
                foundationDeckParentFor(key).innerHTML = this.foundationDecks[key][this.foundationDecks[key].length - 1].innerHTML;
            }
            else {
                foundationDeckParentFor(key).innerHTML = SuitPlaceholder[key];
            }
        }
    }
}
class Deck {
    constructor(cards) {
        this.cards = cards;
    }
    shuffled() {
        for (var i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
    }
    static newDeck() {
        let cards = [];
        for (const suit of Object.values(Suits)) {
            for (const value of Object.values(Values)) {
                cards.push(new Card(suit, value));
            }
        }
        return new Deck(cards);
    }
}
class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.id = uuid.v4();
    }
    /*
    * HTML structuring for cards adapted from code examples shown in a Medium post by Juha Lindstedt.
    * Lindstedt, Juda. (2018, November 6). "JavaScript Playing Cards Part 2: Graphics." Medium. Retrieved November 26, 2021 from https://medium.com/@pakastin/javascript-playing-cards-part-2-graphics-cd65d331ad00.
    */
    get html() {
        return `<div class="card ${this.cardColor}" id="${this.id}">
      <div class="card__top-left">
        <div class="card__corner-value">${this.value}</div>
        <img src="./media/${this.suit}.svg" class="card__corner-suit">
      </div>
      <div class="card__bottom-right">
        <div class="card__corner-value">${this.value}</div>
        <img src="./media/${this.suit}.svg" class="card__corner-suit">
      </div>
    </div>`;
    }
    get cardColor() {
        switch (this.suit) {
            case Suits.spades || Suits.clubs:
                return SuitColors.black;
            case Suits.diamonds || Suits.hearts:
                return SuitColors.red;
        }
    }
}
Card.faceDownHTML = `<div class="card--face-down"></div>`;
class SuitPlaceholder {
    constructor(suit) {
        this.suit = suit;
        this.id = uuid.v4();
    }
    get html() {
        return `<div class="card--suit-placeholder"><img src="./media/${this.suit}.svg"></div>`;
    }
}
SuitPlaceholder.spades = new SuitPlaceholder(Suits.spades);
SuitPlaceholder.clubs = new SuitPlaceholder(Suits.clubs);
SuitPlaceholder.hearts = new SuitPlaceholder(Suits.hearts);
SuitPlaceholder.diamonds = new SuitPlaceholder(Suits.diamonds);
function foundationDeckParentFor(key) {
    switch (key) {
        case "spades":
            return gameFoundationClothSpades;
        case "clubs":
            return gameFoundationClothClubs;
        case "hearts":
            return gameFoundationClothHearts;
        case "diamonds":
            return gameFoundationClothDiamonds;
    }
}
/* Functional Code */
function styleAllPiles() {
    const piles = document.getElementsByClassName("pile");
    const offsetStart = 5.5;
    for (let i = 0; i < piles.length; i++) {
        let element = piles.item(i);
        for (let i = 0; i < element.children.length; i++) {
            let child = element.children[i];
            if (i == 0) {
                continue;
            }
            child.setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
        }
    }
}
styleAllPiles();
let _state = new State();
let state = new Proxy(_state, {
    set: (object, prop, value) => {
        object[prop] = value;
        return true;
    }
});
export {};
