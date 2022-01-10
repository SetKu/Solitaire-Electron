let uuid = require('uuid');
var deckSurface = document.querySelector(".deck-surface");
var game = document.querySelector('.game');
var gameStockCloth = document.querySelector(".game__stock-cloth");
var gameStockClothDeck = document.querySelector(".deck");
var gameStockClothRevealedCards = document.querySelector('.game__stock-cloth__revealed-cards');
var gameWorkingClothPiles = document.querySelector('.game__working-cloth__piles');
var gameControlsNewGame = document.querySelector('.game__controls__new-game');
var gameFoundationCloth = document.querySelector('.game__foundation-cloth');
var gameFoundationClothSpades = document.querySelector('.game__foundation-cloth__spades');
var gameFoundationClothClubs = document.querySelector('.game__foundation-cloth__clubs');
var gameFoundationClothHearts = document.querySelector('.game__foundation-cloth__hearts');
var gameFoundationClothDiamonds = document.querySelector('.game__foundation-cloth__diamonds');
var clickSoundEffect = new Audio('./media/nirmatara_click-sound-effect.wav');
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
    GamePositions[GamePositions["stockDeck"] = 12] = "stockDeck";
})(GamePositions || (GamePositions = {}));
class Card {
    constructor(suit, value, idOverride) {
        this.draggable = true;
        this.dropTarget = false;
        this.forceFaceUp = false;
        this.suit = suit;
        this.value = value;
        if (idOverride) {
            this.id = idOverride;
        }
        else {
            this.id = uuid.v4();
        }
    }
    get html() {
        return `<div class="card ${this.color}${this.dropTarget ? ' drop-target' : ''}" id="${this.id}" draggable="${this.draggable}">
      <div class="card__top-left">
        <div class="card__corner-value">${this.value}</div>
        <img src="./media/${this.suit}.svg" class="card__corner-suit" draggable="false">
      </div>
      <div class="card__bottom-right">
        <div class="card__corner-value">${this.value}</div>
        <img src="./media/${this.suit}.svg" class="card__corner-suit" draggable="false">
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
    clone() {
        let newCard = new Card(this.suit, this.value, this.id);
        newCard.draggable = this.draggable;
        newCard.forceFaceUp = this.forceFaceUp;
        newCard.dropTarget = this.dropTarget;
        return newCard;
    }
}
Card.faceDownHTML = `<div class="card--face-down"></div>`;
Card.prototype.valueOf = function () {
    if (Number(this.value)) {
        return Number(this.value);
    }
    else {
        if (this.value == 'A')
            return 1;
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
class StateLog {
    constructor(state, id, timeDiscarded) {
        this.state = state;
        if (id) {
            this.id = id;
        }
        else {
            this.id = uuid.v4();
        }
        if (timeDiscarded) {
            this.timeDiscarded = timeDiscarded;
        }
        else {
            this.timeDiscarded = new Date();
        }
    }
}
class State {
    constructor() {
        this.history = [];
        this.gameEnded = false;
        this.forceUpdateUICount = 0;
        this.resetState();
        this.history.push(new StateLog(this));
    }
    resetState() {
        this.gameEnded = false;
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
        if (this.forceUpdateUICount < 1) {
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
        }
        gameStockClothRevealedCards.replaceChildren();
        this.stockRevealedCards.forEach((card, index) => {
            if (index === 0) {
                gameStockClothRevealedCards.innerHTML += card.html + "\n";
            }
            else {
                const cardCopy = card.clone();
                cardCopy.draggable = false;
                gameStockClothRevealedCards.innerHTML += cardCopy.html + "\n";
                document.getElementById(cardCopy.id).style.opacity = "0.5";
            }
        });
        for (let i = 0; i < 7; i++) {
            const pile = gameWorkingClothPiles.children[i];
            pile.innerHTML = "";
            const cards = this.workingPiles[i];
            if (cards.length === 0) {
                continue;
            }
            for (let i = 0, makeDragPile = false, pileId = ""; i < cards.length; i++) {
                const card = cards[i];
                let cardCopy = card.clone();
                if (makeDragPile === true) {
                    if (card === cards[cards.length - 1]) {
                        document.getElementById(pileId).innerHTML += card.html;
                    }
                    else {
                        cardCopy.draggable = false;
                        document.getElementById(pileId).innerHTML += cardCopy.html;
                    }
                }
                else if (card.forceFaceUp === true && i !== cards.length - 1) {
                    makeDragPile = true;
                    pileId = uuid.v4();
                    cardCopy.draggable = false;
                    pile.innerHTML += `<div class="game__working-cloth__face-up-pile" id="${pileId}" draggable="true">
            ${cardCopy.html}
          </div>`;
                }
                else if (i === cards.length - 1) {
                    pile.innerHTML += card.html;
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
                foundationDeckParentFor(key).innerHTML = topCard.html;
            }
            else {
                foundationDeckParentFor(key).innerHTML = SuitPlaceholder[key].html;
            }
        }
        const cards = document.getElementsByClassName("card");
        const piles = document.getElementsByClassName("game__working-cloth__face-up-pile");
        for (let i = 0; i < cards.length; i++) {
            const card = cards.item(i);
            card.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("id", event.target.id);
                console.log("Setting dragEvent id property to (event.target as Element).id: " + event.target.id);
                console.log("(event.target as Element):\n", event.target);
            });
        }
        for (let i = 0; i < piles.length; i++) {
            const pile = piles.item(i);
            pile.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("id", event.target.id);
                event.dataTransfer.setData("element", event.target.toString());
                console.log("Setting dragEvent id property to (event.target as Element).id: " + event.target.id);
                console.log("(event.target as Element):\n", event.target);
            });
        }
        const dropTargets = document.getElementsByClassName("drop-target");
        for (let i = 0; i < dropTargets.length; i++) {
            const dropTarget = dropTargets.item(i);
            dropTarget.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
        }
        for (let i = 0; i < dropTargets.length; i++) {
            const dropTarget = dropTargets.item(i);
            dropTarget.addEventListener("drop", (event) => {
                const id = event.dataTransfer.getData("id");
                let dragElement = document.getElementById(id);
                let dragItem;
                if (dragElement === null) {
                    console.log("dragElement is null!");
                    console.log("dropTarget is", dropTarget);
                    console.log("id is", id);
                    console.log("dataTransfer.getData.('element') is", event.dataTransfer.getData("element"));
                    console.trace();
                }
                if (dragElement.classList.contains("game__working-cloth__face-up-pile")) {
                    console.log("dragged element is pile");
                    let cards = [];
                    for (let i = 0; i < dragElement.children.length; i++) {
                        cards.push(cardWithId(dragElement.children[i].id));
                    }
                    dragItem = {
                        id: id,
                        cards: cards
                    };
                }
                else {
                    dragItem = cardWithId(id);
                }
                if (checkMoveValidity(dragItem, gamePositionForElement(dropTarget))) {
                    event.preventDefault();
                    moveItem(dragItem, gamePositionForElement(dropTarget));
                    clickSoundEffect.play();
                    this.forceUpdateUI();
                }
            });
        }
        const setElementsState = (state) => {
            const cards = document.getElementsByClassName("card");
            const decks = document.getElementsByClassName("deck");
            if (state === true) {
                for (let i = 0; i < cards.length; i++) {
                    cards.item(i).style.pointerEvents = "none";
                }
                for (let i = 0; i < decks.length; i++) {
                    decks.item(i).style.pointerEvents = "none";
                }
            }
            else {
                for (let i = 0; i < cards.length; i++) {
                    cards.item(i).style.pointerEvents = "auto";
                }
                for (let i = 0; i < decks.length; i++) {
                    decks.item(i).style.pointerEvents = "auto";
                }
            }
        };
        if (this.gameEnded) {
            setElementsState(true);
            let id = uuid.v4();
            let buttonId = uuid.v4();
            deckSurface.innerHTML = `<div class="alert" id="${id}">
        <span>Congratulations! You won the game.</span>
        <button id="${buttonId}"><strong>X</strong></button>
      </div>
      ${deckSurface.innerHTML}`;
            function fadeOut(id) {
                document.getElementById(id).style.animationName = 'fadeOut';
                const removeElement = () => {
                    document.getElementById(id).remove();
                };
                window.setTimeout(removeElement, 1000);
            }
            document.getElementById(buttonId).addEventListener("click", () => {
                fadeOut(id);
            });
        }
        else {
            setElementsState(false);
        }
        this.forceUpdateUICount++;
    }
}
let _state = new State();
let state = new Proxy(_state, {
    set: (object, prop, value) => {
        object[prop] = value;
        return true;
    }
});
state.forceUpdateUI();
function styleAllPiles() {
    const piles = document.getElementsByClassName("pile");
    const forceFaceUpPiles = document.getElementsByClassName("game__working-cloth__face-up-pile");
    const offsetStart = 4.5;
    for (let i = 0; i < piles.length; i++) {
        let pile = piles.item(i);
        for (let i = 0; i < pile.children.length; i++) {
            if (i !== 0 && pile.children[i - 1].classList.contains("game__working-cloth__face-up")) {
                const offset = offsetStart * i + (pile.children[i - 1].children.length * 6.9) + 10;
                pile.children[i].setAttribute("style", `transform: translateY(-${offset}rem);`);
            }
            else {
                pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
            }
        }
        if (state.workingPiles[i].length > 9) {
            pile.style.overflowY = "scroll";
        }
    }
    for (let i = 0; i < forceFaceUpPiles.length; i++) {
        let pile = forceFaceUpPiles.item(i);
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
gameControlsNewGame.addEventListener("click", () => {
    state.history.push(new StateLog(state));
    state.resetState();
    state.forceUpdateUI();
});
function checkGameStatus() {
    let tally = 0;
    for (const key in state.foundationDecks) {
        if (state.foundationDecks[key].length === 13) {
            tally++;
        }
    }
    return tally === 4 ? true : false;
}
function cardWithId(id) {
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
function gamePositionForElement(gameElement) {
    const parentElement = gameElement.parentElement;
    if (parentElement.classList.contains("game__working-cloth__face-up-pile")) {
        if (Number(parentElement.parentElement.dataset.index)) {
            return Number(parentElement.parentElement.dataset.index) + 1;
        }
        else {
            switch (parentElement.parentElement.dataset.index) {
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
                    throw new Error("Unable to match game element's pile data index value to a working pile position: " + parentElement);
            }
        }
    }
    else if (gameElement.classList.contains("game__working-cloth__face-up-pile")) {
        if (Number(gameElement.parentElement.dataset.index)) {
            return Number(gameElement.parentElement.dataset.index) + 1;
        }
        else {
            switch (gameElement.parentElement.dataset.index) {
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
            }
        }
        throw new Error("Unable to match the element provided to a pile. " + gameElement);
    }
    if (gameElement.classList.contains("game__stock-cloth__revealed-cards") || parentElement.classList.contains("game__stock-cloth__revealed-cards")) {
        return GamePositions.stockRevealedCards;
    }
    if (parentElement.classList.contains("pile")) {
        if (Number(parentElement.dataset.index)) {
            return Number(parentElement.dataset.index) + 1;
        }
        else {
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
            }
        }
        throw new Error("Unable to match the element provided to a pile. " + gameElement);
    }
    else if (gameElement.classList.contains("pile")) {
        if (Number(gameElement.dataset.index)) {
            return Number(gameElement.dataset.index) + 1;
        }
        else {
            switch (gameElement.dataset.index) {
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
            }
        }
        throw new Error("Unable to match the element provided to a pile. " + gameElement);
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
                    throw new Error("Unable to find matching foundation cloth position for game element: " + parentElement);
            }
        }
    }
    for (let i = 0; i < gameElement.classList.length; i++) {
        if (gameElement.classList.item(i).includes("foundation-cloth")) {
            switch (gameElement.classList.item(i)) {
                case "game__foundation-cloth__spades":
                    return GamePositions.foundationDeckSpades;
                case "game__foundation-cloth__clubs":
                    return GamePositions.foundationDeckClubs;
                case "game__foundation-cloth__hearts":
                    return GamePositions.foundationDeckHearts;
                case "game__foundation-cloth__diamonds":
                    return GamePositions.foundationDeckDiamonds;
                default:
                    throw new Error("Unable to find matching foundation cloth position for game element: " + gameElement);
            }
        }
    }
    console.log(gameElement);
    throw new Error("Unable to find position of element specified: " + gameElement);
}
function moveItem(item, destination) {
    state.history.push(new StateLog(state));
    if (item instanceof Card) {
        const card = item;
        const cardElement = document.getElementById(card.id);
        const origin = gamePositionForElement(cardElement);
        if (destination > 0 && destination < 8) {
            card.dropTarget = false;
            state.workingPiles[destination - 1][state.workingPiles[destination - 1].length - 1].forceFaceUp = true;
            state.workingPiles[destination - 1].push(card);
            console.log("Working pile added to:", state.workingPiles[destination - 1]);
        }
        else if (destination > 7 && destination < 12) {
            card.dropTarget = true;
            console.log("destination is foundation deck... activating switch");
            switch (destination) {
                case GamePositions.foundationDeckClubs:
                    state.foundationDecks.clubs.push(card);
                    break;
                case GamePositions.foundationDeckDiamonds:
                    state.foundationDecks.diamonds.push(card);
                    break;
                case GamePositions.foundationDeckHearts:
                    state.foundationDecks.hearts.push(card);
                    break;
                case GamePositions.foundationDeckSpades:
                    state.foundationDecks.spades.push(card);
            }
        }
        if (origin === 0) {
            for (let i = 0; i < 3; i++) {
                if (gameStockClothRevealedCards.children.item(i) === cardElement) {
                    state.stockRevealedCards.splice(i, 1);
                    console.log("spliced");
                }
            }
        }
        else if (origin > 0 && origin < 8) {
            state.workingPiles[origin - 1].pop();
        }
        else if (origin > 7 && origin < 12) {
            switch (origin) {
                case GamePositions.foundationDeckClubs:
                    state.foundationDecks.clubs.pop();
                    break;
                case GamePositions.foundationDeckDiamonds:
                    state.foundationDecks.diamonds.pop();
                    break;
                case GamePositions.foundationDeckHearts:
                    state.foundationDecks.hearts.pop();
                    break;
                case GamePositions.foundationDeckSpades:
                    state.foundationDecks.spades.pop();
            }
        }
    }
    else {
        const pile = item;
        const dest = state.workingPiles[destination - 1];
        const origin = gamePositionForElement(document.getElementById(pile.id));
        dest[dest.length - 1].forceFaceUp = true;
        for (const card of pile.cards) {
            dest.push(card);
        }
        const wPile = state.workingPiles[origin - 1];
        wPile.splice(wPile.length - pile.cards.length, pile.cards.length);
    }
    if (checkGameStatus()) {
        state.gameEnded = true;
    }
}
function checkMoveValidity(item, destination) {
    if (destination === 12) {
        return false;
    }
    if (item instanceof Card) {
        console.log("item is card");
        const card = item;
        const cardElement = document.getElementById(card.id);
        if (gamePositionForElement(cardElement) == destination) {
            return false;
        }
        if (destination > 7) {
            const check = function (foundationSuit, foundationCloth) {
                if (card.suit !== foundationSuit) {
                    return false;
                }
                const topElement = foundationCloth.children.item(0);
                if (topElement.classList.contains("card--suit-placeholder") && card.value == Values.ace) {
                    return true;
                }
                else if (topElement.classList.contains("card--suit-placeholder") && card.value != Values.ace) {
                    return false;
                }
                else if (card > cardWithId(topElement.id)) {
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
            console.log("here");
            const pile = state.workingPiles[destination - 1];
            if (pile.length == 0) {
                return false;
            }
            const topCard = pile[pile.length - 1];
            if (card.color !== topCard.color && card.valueOf() === topCard.valueOf() - 1) {
                return true;
            }
        }
    }
    else {
        console.log("item is pile");
        if (destination > 0 && destination < 8) {
            const workingPile = state.workingPiles[destination - 1];
            if (workingPile.length == 0) {
                return false;
            }
            const pile = item;
            const bottomPileCard = pile.cards[0];
            const topWorkingPileCard = workingPile[workingPile.length - 1];
            if (bottomPileCard.color !== topWorkingPileCard.color && bottomPileCard.valueOf() === topWorkingPileCard.valueOf() - 1) {
                return true;
            }
        }
        else {
            return false;
        }
    }
    return false;
}
