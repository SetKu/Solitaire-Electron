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
var GamePositions;
(function (GamePositions) {
    GamePositions[GamePositions["stockRevealedCards"] = 0] = "stockRevealedCards";
    GamePositions[GamePositions["workingPile0"] = 1] = "workingPile0";
    GamePositions[GamePositions["workingPile1"] = 2] = "workingPile1";
    GamePositions[GamePositions["workingPile2"] = 3] = "workingPile2";
    GamePositions[GamePositions["workingPile3"] = 4] = "workingPile3";
    GamePositions[GamePositions["workingPile4"] = 5] = "workingPile4";
    GamePositions[GamePositions["workingPile5"] = 6] = "workingPile5";
    GamePositions[GamePositions["workingPile6"] = 7] = "workingPile6";
    GamePositions[GamePositions["foundationDeckSpades"] = 8] = "foundationDeckSpades";
    GamePositions[GamePositions["foundationDeckClubs"] = 9] = "foundationDeckClubs";
    GamePositions[GamePositions["foundationDeckHearts"] = 10] = "foundationDeckHearts";
    GamePositions[GamePositions["foundationDeckDiamonds"] = 11] = "foundationDeckDiamonds";
})(GamePositions || (GamePositions = {}));
class Card {
    constructor(suit, value) {
        this.draggable = true;
        this.dropTarget = false;
        this.suit = suit;
        this.value = value;
        this.id = uuid.v4();
    }
    get html() {
        return `<div class="card ${this.color}${this.dropTarget ? ' drop-target' : ''}" id="${this.id}" draggable="${this.draggable}">
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
    get color() {
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
Card.invisibleDropTargetHTML = `<div class="card--invisible drop-target">`;
Card.prototype.valueOf = function () {
    if (Number(this.value)) {
        return Number(this.value);
    }
    else {
        if (this.value == 'J')
            return 11;
        if (this.value == 'Q')
            return 12;
        if (this.value == 'K')
            return 13;
        throw new Error("Unable to determine primitive value of card.");
    }
};
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
        this.dropTarget = true;
        this.suit = suit;
    }
    get html() {
        return `<div class="card--suit-placeholder${this.dropTarget ? ' drop-target' : ''}"><img src="./media/${this.suit}.svg" draggable="false"></div>`;
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
        this.allCards = [];
        for (const card of this.stockDeck.cards) {
            const reference = card;
            this.allCards.push(reference);
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
            pile.innerHTML += Card.invisibleDropTargetHTML;
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
        const cards = document.getElementsByClassName("card");
        const invisibleCards = document.getElementsByClassName("card--invisible");
        for (let i = 0; i < cards.length; i++) {
            const card = cards.item(i);
            card.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("id", event.target.id);
                for (let i = 0; i < invisibleCards.length; i++) {
                    invisibleCards.item(i).style.pointerEvents = 'auto';
                }
            });
            card.addEventListener("dragend", (event) => {
                for (let i = 0; i < invisibleCards.length; i++) {
                    invisibleCards.item(i).style.pointerEvents = 'none';
                }
            });
        }
        const dropTargets = document.getElementsByClassName("drop-target");
        for (let i = 0; i < dropTargets.length; i++) {
            const dropTarget = dropTargets.item(i);
            dropTarget.addEventListener("dragover", (event) => {
                const dragCard = cardWith(event.dataTransfer.getData("id"));
                if (isMoveValid(dragCard, gamePositionFor(dropTarget))) {
                    event.preventDefault();
                }
            });
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
let dragTemp = undefined;
function styleAllPiles() {
    const piles = document.getElementsByClassName("pile");
    const offsetStart = 5.5;
    for (let i = 0; i < piles.length; i++) {
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
    throw new Error("Unable to find card specified by ID: " + id);
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
function gamePositionFor(gameElement) {
    const parentElement = gameElement.parentElement;
    if (parentElement.classList.contains("game__stock-cloth__revealed-cards")) {
        return GamePositions.stockRevealedCards;
    }
    if (parentElement.classList.contains("pile")) {
        switch (parentElement.dataset.index) {
            case "0":
                return GamePositions.workingPile0;
            case "1":
                return GamePositions.workingPile1;
            case "2":
                return GamePositions.workingPile2;
            case "3":
                return GamePositions.workingPile3;
            case "4":
                return GamePositions.workingPile4;
            case "5":
                return GamePositions.workingPile5;
            case "6":
                return GamePositions.workingPile6;
            default:
                throw new Error("Unable to match gameElement.parentElement's pile data index to a working pile position: " + gameElement);
        }
    }
    for (let i = 0; i < parentElement.classList.length; i++) {
        if (parentElement.classList.item(i).includes("foundation-cloth")) {
            switch (parentElement.classList.item(i)) {
                case "game__foundation-cloth__spades":
                    return GamePositions.foundationDeckSpades;
                case "game__foundation-cloth__clubs":
                    return GamePositions.foundationDeckClubs;
                case "game__foundation-cloth__hearts":
                    return GamePositions.foundationDeckHearts;
                case "game__foundation-cloth__diamonds":
                    return GamePositions.foundationDeckDiamonds;
                default:
                    throw new Error("Unable to find matching foundation cloth position for gameElement's parentElement: " + parentElement);
            }
        }
    }
    throw new Error("Unable to find position of element specified: " + gameElement);
}
function isMoveValid(card, destination) {
    console.log("isMoveValid fired.");
    const cardElement = document.getElementById(card.id);
    console.log(GamePositions[gamePositionFor(cardElement)]);
    console.log(GamePositions[destination]);
    if (gamePositionFor(cardElement) == destination) {
        console.log(0);
        return false;
    }
    if (destination > 7) {
        console.log("here");
        const check = function (foundationSuit, foundationCloth) {
            if (card.suit !== foundationSuit) {
                console.log(2);
                return false;
            }
            const topElement = foundationCloth.children.item(0);
            if (topElement.classList.contains("card--suit-placeholder") && card.value == Values.ace) {
                return true;
            }
            else if (card > cardWith(topElement.id)) {
                console.log(4);
                return true;
            }
        };
        switch (destination) {
            case GamePositions.foundationDeckClubs:
                return check(Suits.clubs, gameFoundationClothClubs);
            case GamePositions.foundationDeckDiamonds:
                return check(Suits.diamonds, gameFoundationClothDiamonds);
            case GamePositions.foundationDeckHearts:
                return check(Suits.hearts, gameFoundationClothHearts);
            case GamePositions.foundationDeckSpades:
                return check(Suits.spades, gameFoundationClothSpades);
        }
    }
    if (destination > 0 && destination < 8) {
        console.log(9);
        const pile = state.workingPiles[destination];
        const topCard = pile[pile.length - 1];
        console.log(card.color !== topCard.color);
        console.log(card.valueOf());
        console.log(topCard.valueOf());
        console.log(topCard.valueOf() - 1);
        console.log(card.valueOf() === topCard.valueOf() - 1);
        if (card.color !== topCard.color && card.valueOf() === topCard.valueOf() - 1) {
            console.log(10);
            return true;
        }
    }
    return false;
}
