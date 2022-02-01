let uuid = require('uuid');
var alerts = document.querySelector('.alerts');
var gameStockClothDeck = document.querySelector(".deck");
var gameStockClothRevealedCards = document.querySelector('.game__stock-cloth__revealed-cards');
var gameWorkingClothPiles = document.querySelector('.game__working-cloth__piles');
var gameControlsNewGame = document.querySelector('.game__controls__new-game');
var gameControlsUndo = document.querySelector('.game__controls__undo');
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
    constructor(suit, value, id) {
        this.draggable = true;
        this.dropTarget = false;
        this.forceFaceUp = false;
        this.suit = suit;
        this.value = value;
        if (id) {
            this.id = id;
        }
        else {
            this.id = uuid.v4();
        }
    }
    get html() {
        return `<div class="card ${this.color}${this.dropTarget ? ' drop-target' : ''}" id="${this.id}" draggable="${this.draggable}">
      <div class="card__top-left">
        <div class="card__corner-value" draggable="false">${this.value}</div>
        <img src="./media/${this.suit}.svg" class="card__corner-suit" draggable="false">
      </div>
      <div class="card__bottom-right">
        <div class="card__corner-value" draggable="false">${this.value}</div>
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
        this.state = new State();
        let stockDeckCloneCards = [];
        for (const card of state.stockDeck.cards) {
            stockDeckCloneCards.push(card.clone());
        }
        this.state.stockDeck = new Deck(stockDeckCloneCards);
        let stockRevealedCardsClone = [];
        for (const card of state.stockRevealedCards) {
            stockRevealedCardsClone.push(card.clone());
        }
        this.state.stockRevealedCards = stockRevealedCardsClone;
        let workingPilesClone = [[], [], [], [], [], [], []];
        for (let i = 0; i < workingPilesClone.length; i++) {
            for (const card of state.workingPiles[i]) {
                workingPilesClone[i].push(card.clone());
            }
        }
        this.state.workingPiles = workingPilesClone;
        let foundationDecksClone = {
            spades: [],
            clubs: [],
            hearts: [],
            diamonds: []
        };
        for (const key in foundationDecksClone) {
            for (const card of state.foundationDecks[key]) {
                foundationDecksClone[key].push(card.clone());
            }
        }
        this.state.foundationDecks = foundationDecksClone;
        this.state.history = state.history;
        this.state.gameEnded = state.gameEnded;
    }
}
class Alert {
    constructor(text, id, buttonId, fadeOut) {
        this.fadeOut = true;
        this.text = text;
        if (id) {
            this.id = id;
        }
        else {
            this.id = uuid.v4();
        }
        if (buttonId) {
            this.buttonId = buttonId;
        }
        else {
            this.buttonId = uuid.v4();
        }
        if (fadeOut) {
            this.fadeOut = fadeOut;
        }
    }
    get html() {
        return `<div class="alert" id="${this.id}">
      <span>${this.text}</span>
      <button id="${this.buttonId}"><strong>X</strong></button>
    </div>`;
    }
}
class State {
    constructor() {
        this.history = [];
        this.gameEnded = false;
        this.alerts = [];
        this.resetState();
    }
    loadState(state) {
        for (const key in state) {
            this[key] = state[key];
        }
    }
    resetState() {
        this.gameEnded = false;
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
        this.alerts = [];
    }
    forceUpdateUI() {
        const updateUIForAlerts = () => {
            alerts.innerHTML = "";
            for (const alert of this.alerts) {
                alerts.innerHTML += alert.html;
                document.getElementById(alert.buttonId).addEventListener("click", () => {
                    if (alert.fadeOut) {
                        fadeOut(alert.id, () => {
                            this.alerts.splice(this.alerts.indexOf(alert), 1);
                        });
                    }
                    else {
                        this.alerts.splice(this.alerts.indexOf(alert), 1);
                    }
                });
            }
        };
        updateUIForAlerts();
        gameStockClothRevealedCards.replaceChildren();
        this.stockRevealedCards.forEach((card, index) => {
            if (index === 0) {
                gameStockClothRevealedCards.innerHTML += card.html;
            }
            else {
                const cardCopy = card.clone();
                cardCopy.draggable = false;
                gameStockClothRevealedCards.innerHTML += cardCopy.html;
                document.getElementById(cardCopy.id).style.filter = "brightness(0.7)";
            }
        });
        for (let i = 0; i < 7; i++) {
            const cards = this.workingPiles[i];
            const pile = gameWorkingClothPiles.children[i];
            pile.replaceChildren();
            if (cards.length === 0) {
                continue;
            }
            for (let i = 0, makeDragPile = false, pileId = ""; i < cards.length; i++) {
                const card = cards[i];
                let cardCopy = card.clone();
                if (makeDragPile === true) {
                    cardCopy.draggable = false;
                    document.getElementById(pileId).innerHTML += cardCopy.html;
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
        for (let i = 0; i < gameFoundationCloth.children.length; i++) {
            gameFoundationCloth.children[i].replaceChildren();
        }
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
        const dragStartActions = (event) => {
            event.dataTransfer.setData("id", event.currentTarget.id);
            event.dataTransfer.setData("element", event.currentTarget.toString());
            let image = new Image();
            image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
            event.dataTransfer.setDragImage(image, 0, 0);
        };
        for (let i = 0; i < cards.length; i++) {
            const card = cards.item(i);
            card.addEventListener("dragstart", dragStartActions);
        }
        for (let i = 0; i < piles.length; i++) {
            const pile = piles.item(i);
            pile.addEventListener("dragstart", dragStartActions);
        }
        const dropTargets = document.getElementsByClassName("drop-target");
        for (let i = 0; i < dropTargets.length; i++) {
            const dropTarget = dropTargets.item(i);
            dropTarget.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            dropTarget.addEventListener("drop", (event) => {
                const id = event.dataTransfer.getData("id");
                let dragElement = document.getElementById(id);
                let dragItem;
                if (dragElement === null) {
                    return;
                }
                if (dragElement.classList.contains("game__working-cloth__face-up-pile")) {
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
        const setElementStates = (toStatic) => {
            const cards = document.getElementsByClassName("card");
            const decks = document.getElementsByClassName("deck");
            const setPointerEvents = (value) => {
                for (let i = 0; i < cards.length; i++) {
                    cards.item(i).style.pointerEvents = value;
                }
                for (let i = 0; i < decks.length; i++) {
                    decks.item(i).style.pointerEvents = value;
                }
            };
            if (toStatic === true) {
                setPointerEvents("none");
            }
            else {
                setPointerEvents("auto");
            }
        };
        if (this.gameEnded) {
            setElementStates(true);
            const alertText = "Congratulations! You won the game.";
            if (this.alerts.filter(element => { return element.text === alertText; }).length === 0) {
                this.alerts.push(new Alert(alertText));
                updateUIForAlerts();
            }
        }
        else {
            setElementStates(false);
        }
        if (this.history.length === 0) {
            gameControlsUndo.disabled = true;
            gameControlsUndo.classList.add("disabled");
        }
        else {
            gameControlsUndo.disabled = false;
            gameControlsUndo.classList.remove("disabled");
        }
    }
}
let state = new State();
state.forceUpdateUI();
function fadeOut(id, callback) {
    document.getElementById(id).style.animationName = 'fadeOut';
    setTimeout(() => {
        document.getElementById(id).remove();
        if (callback) {
            callback();
        }
    }, 1000);
}
function styleAllPiles() {
    const piles = document.getElementsByClassName("pile");
    const forceFaceUpPiles = document.getElementsByClassName("game__working-cloth__face-up-pile");
    const offsetStart = 4.5;
    for (let i = 0; i < piles.length; i++) {
        let pile = piles.item(i);
        for (let i = 0; i < pile.children.length; i++) {
            pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
        }
    }
    for (let i = 0; i < forceFaceUpPiles.length; i++) {
        let pile = forceFaceUpPiles.item(i);
        for (let i = 0; i < pile.children.length; i++) {
            pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
        }
    }
}
gameStockClothDeck.addEventListener("click", (event) => {
    state.history.push(new StateLog(state));
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
gameControlsNewGame.addEventListener("click", () => {
    state.history.push(new StateLog(state));
    state.resetState();
    state.forceUpdateUI();
});
gameControlsUndo.addEventListener("click", () => {
    state.loadState(state.history[state.history.length - 1].state);
    state.history.splice(state.history.length - 1, 1);
    state.gameEnded = checkGameStatus();
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
            }
        }
        throw new Error("Unable to match game element's pile data index value to a working pile position: " + parentElement);
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
    throw new Error("Unable to find position of element specified: " + gameElement);
}
function moveItem(item, destination) {
    state.history.push(new StateLog(state));
    function foundationPush(card) {
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
    if (item instanceof Card) {
        const card = item;
        const cardElement = document.getElementById(card.id);
        const origin = gamePositionForElement(cardElement);
        if (destination > 0 && destination < 8) {
            card.dropTarget = false;
            state.workingPiles[destination - 1][state.workingPiles[destination - 1].length - 1].forceFaceUp = true;
            state.workingPiles[destination - 1].push(card);
        }
        else if (destination > 7 && destination < 12) {
            card.dropTarget = true;
            foundationPush(card);
        }
        if (origin === 0) {
            for (let i = 0; i < 3; i++) {
                if (gameStockClothRevealedCards.children.item(i) === cardElement) {
                    state.stockRevealedCards.splice(i, 1);
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
        const origin = gamePositionForElement(document.getElementById(pile.id));
        const originWorkingPile = state.workingPiles[origin - 1];
        if (destination > 0 && destination < 8) {
            const destWorkingPile = state.workingPiles[destination - 1];
            destWorkingPile[destWorkingPile.length - 1].forceFaceUp = true;
            for (const card of pile.cards) {
                destWorkingPile.push(card);
            }
            originWorkingPile.splice(originWorkingPile.length - pile.cards.length, pile.cards.length);
        }
        else if (destination > 7 && destination < 12) {
            const card = pile.cards[pile.cards.length - 1];
            card.dropTarget = true;
            foundationPush(card);
            originWorkingPile.pop();
        }
    }
    if (checkGameStatus()) {
        state.gameEnded = true;
    }
}
function checkMoveValidity(item, destination) {
    if (destination === 12) {
        return false;
    }
    const foundationCheck = function (card) {
        const check = function (foundationSuit, foundationCloth) {
            if (card.suit !== foundationSuit) {
                return false;
            }
            const topElement = foundationCloth.children.item(0);
            if (topElement.classList.contains("card--suit-placeholder") && card.value === Values.ace) {
                return true;
            }
            else if (topElement.classList.contains("card--suit-placeholder") && card.value !== Values.ace) {
                return false;
            }
            else if (card.valueOf() === cardWithId(topElement.id).valueOf() + 1) {
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
    };
    if (item instanceof Card) {
        const card = item;
        const cardElement = document.getElementById(card.id);
        if (gamePositionForElement(cardElement) === destination) {
            return false;
        }
        else if (destination > 7 && destination < 12) {
            return foundationCheck(card);
        }
        else if (destination > 0 && destination < 8) {
            const pile = state.workingPiles[destination - 1];
            if (pile.length === 0) {
                return false;
            }
            const topCard = pile[pile.length - 1];
            if (card.color !== topCard.color && card.valueOf() === topCard.valueOf() - 1) {
                return true;
            }
        }
    }
    else {
        const pile = item;
        if (destination > 0 && destination < 8) {
            const destinationWorkingPile = state.workingPiles[destination - 1];
            if (destinationWorkingPile.length === 0) {
                return false;
            }
            const bottomPileCard = pile.cards[0];
            const topWorkingPileCard = destinationWorkingPile[destinationWorkingPile.length - 1];
            if (bottomPileCard.color !== topWorkingPileCard.color && bottomPileCard.valueOf() === topWorkingPileCard.valueOf() - 1) {
                return true;
            }
        }
        if (destination > 7 && destination < 12) {
            const topPileCard = pile.cards[pile.cards.length - 1];
            return foundationCheck(topPileCard);
        }
    }
    return false;
}
