let uuid = require('uuid');
var gameStockCloth = document.querySelector(".game__stock-cloth");
var gameStockClothDeck = document.querySelector(".deck");
var gameStockClothRevealedCards = document.querySelector('.game__stock-cloth__revealed-cards');
var gameWorkingClothPiles = document.querySelector('.game__working-cloth__piles');
var gameFoundationCloth = document.querySelector('.game__foundation-cloth');
var gameFoundationClothSpades = document.querySelector('.game__foundation-cloth__spades');
var gameFoundationClothClubs = document.querySelector('.game__foundation-cloth__clubs');
var gameFoundationClothHearts = document.querySelector('.game__foundation-cloth__hearts');
var gameFoundationClothDiamonds = document.querySelector('.game__foundation-cloth__diamonds');
var SuitColors;
(function (SuitColors) {
    SuitColors["black"] = "black";
    SuitColors["red"] = "red";
})(SuitColors || (SuitColors = {}));
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
class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.id = uuid.v4();
    }
    get html() {
        return `<div class="card ${this.cardColor}" id="${this.id}" draggable="${this.draggable}">
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
            case Suits.spades:
                return SuitColors.black;
            case Suits.clubs:
                return SuitColors.black;
            case Suits.diamonds:
                return SuitColors.red;
            case Suits.hearts:
                return SuitColors.red;
        }
    }
}
Card.faceDownHTML = `<div class="card--face-down"></div>`;
class Deck {
    constructor(cards) {
        this.cards = cards;
    }
    shuffled() {
        for (var a = this.cards.length - 1; a > 0; a--) {
            const b = Math.floor(Math.random() * (a + 1));
            [this.cards[a], this.cards[b]] = [this.cards[b], this.cards[a]];
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
class SuitPlaceholder {
    constructor(suit) {
        this.suit = suit;
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
class State {
    constructor(silent = false) {
        this.resetState();
        if (silent)
            return;
        this.forceUpdateUI();
    }
    resetState() {
        this.stockDeck = Deck.newDeck().shuffled();
        this.referenceCards = [];
        for (const card of this.stockDeck.cards) {
            const reference = card;
            this.referenceCards.push(reference);
        }
        this.stockRevealedCards = [];
        let workingPiles = [];
        for (let iA = 1; iA < 8; iA++) {
            var pile = [];
            for (let iB = 0; iB < iA; iB++) {
                let card = this.stockDeck.cards.pop();
                pile.push(card);
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
        gameStockClothRevealedCards.replaceChildren();
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
        clearFoundationDecksContent();
        for (const key in this.foundationDecks) {
            if (this.foundationDecks[key].length != 0) {
                let topCard = this.foundationDecks[key][this.foundationDecks[key].length - 1];
                topCard.draggable = false;
                foundationDeckParentFor(key).innerHTML = topCard.html;
            }
            else {
                foundationDeckParentFor(key).innerHTML = SuitPlaceholder[key].html;
            }
        }
    }
}
let _state = new State();
let state = new Proxy(_state, {
    set: (object, prop, value) => {
        object[prop] = value;
        return true;
    }
});
function styleAllPiles() {
    const piles = document.getElementsByClassName("pile");
    const offsetStart = 5.5;
    for (let i = 0; i < piles.length; i++) {
        if (i == 0) {
            continue;
        }
        let pile = piles.item(i);
        for (let i = 0; i < pile.children.length; i++) {
            pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
        }
    }
}
function clearFoundationDecksContent() {
    let successful = true;
    for (let i = 0; i < gameFoundationCloth.children.length; i++) {
        gameFoundationCloth.children[i].replaceChildren();
        if (gameFoundationCloth.children[i].children.length != 0) {
            successful = false;
        }
        ;
    }
    return successful;
}
function cardWith(id) {
    for (const card of state.stockDeck.cards) {
        if (card.id === id)
            return card;
    }
    for (const card of state.stockRevealedCards) {
        if (card.id === id)
            return card;
    }
    for (const pile of state.workingPiles) {
        for (const card of pile) {
            if (card.id === id)
                return card;
        }
    }
    for (const key in state.foundationDecks) {
        for (const card of state.foundationDecks[key]) {
            if (card.id === id)
                return card;
        }
    }
    throw new Error("Unable to find card specified by id: " + id);
}
gameStockClothDeck.addEventListener("click", (event) => {
    const sRC = state.stockRevealedCards;
    const sDC = state.stockDeck.cards;
    if (sRC.length < 3) {
        sRC.unshift(sDC.pop());
    }
    else {
        sDC.unshift(sRC.pop());
        sRC.unshift(sDC.pop());
    }
    state.forceUpdateUI();
});
