import { stat } from "fs/promises";

let uuid = require('uuid');
//The TS compiler knows node's require function will return the any type with the help of the npm @types/node package.

/*** Static Elements ***/

var alerts = document.querySelector('.alerts');
var game = document.querySelector('.game');
var gameStockCloth = document.querySelector(".game__stock-cloth");
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

/*** Data Model ***/

enum SuitColors {
  black = "black",
  red = "red"
}

/*
* Deck and Card class naming structure inspired by Web Dev Simplified's video on recreating the card game war for the web.
* Web Dev Simplified. (2020, November 14). "How To Build A Simple Card Game With JavaScript." YouTube. Retrieved November 23, 2021, from https://youtu.be/NxRwIZWjLtE.
*/

enum Suits {
  spades = "spades",
  clubs = "clubs",
  hearts = "hearts",
  diamonds = "diamonds"
}

enum Values {
  ace = "A",
  two = "2",
  three = "3",
  four = "4",
  five = "5",
  six = "6",
  seven = "7",
  eight = "8",
  nine = "9",
  ten = "10",
  jack = "J",
  queen = "Q",
  king = "K"
}

enum GamePositions {
  stockRevealedCards,
  workingPile0,
  workingPile1,
  workingPile2,
  workingPile3,
  workingPile4,
  workingPile5,
  workingPile6,
  foundationDeckSpades,
  foundationDeckClubs,
  foundationDeckHearts,
  foundationDeckDiamonds,
  stockDeck
}

class Card {
  suit: string;
  value: string;
  id: string;
  draggable: boolean = true;
  dropTarget: boolean = false;
  forceFaceUp: boolean = false;

  constructor(suit: string, value: string, idOverride?: string) {
    this.suit = suit;
    this.value = value;

    if (idOverride) {
      this.id = idOverride;
    } else {
      this.id = uuid.v4();
    }
  }

  /*
  * HTML structuring for cards adapted from code examples shown in a Medium post by Juha Lindstedt.
  * Lindstedt, Juda. (2018, November 6). "JavaScript Playing Cards Part 2: Graphics." Medium. Retrieved November 26, 2021 from https://medium.com/@pakastin/javascript-playing-cards-part-2-graphics-cd65d331ad00.
  */
  get html(): string {
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

  get color(): string {
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

  static faceDownHTML = `<div class="card--face-down"></div>`

  clone(): Card {
    let newCard = new Card(this.suit, this.value, this.id);

    newCard.draggable = this.draggable;
    newCard.forceFaceUp = this.forceFaceUp;
    newCard.dropTarget = this.dropTarget;

    return newCard;
  }
}

Card.prototype.valueOf = function (): Number {
  if (Number(this.value)) {
    return Number(this.value);
  } else {
    if (this.value == 'A') return 1;
    if (this.value == 'J') return 11;
    if (this.value == 'Q') return 12;
    if (this.value == 'K') return 13;

    throw new Error("Unable to determine primitive value of card.");
  }
};

interface Pile {
  id: string;
  cards: Array<Card>;
}

class Deck {
  cards: Array<Card>;

  constructor(cards: Array<Card>) {
    this.cards = cards;
  }

  shuffled(): Deck {
    // Fisher-Yates Algorithm implementation.
    for (var a = this.cards.length - 1; a > 0; a--) {
      const b = Math.floor(Math.random() * (a + 1));
      [this.cards[a], this.cards[b]] = [this.cards[b], this.cards[a]];
    }

    return this
  }

  static newDeck(): Deck {
    let cards: Array<Card> = [];

    for (const suit of Object.values(Suits)) {
      for (const value of Object.values(Values)) {
        cards.push(new Card(suit, value));
      }
    }

    return new Deck(cards);
  }
}

class SuitPlaceholder {
  suit: string;
  dropTarget: boolean = true;

  static spades = new SuitPlaceholder(Suits.spades);
  static clubs = new SuitPlaceholder(Suits.clubs);
  static hearts = new SuitPlaceholder(Suits.hearts);
  static diamonds = new SuitPlaceholder(Suits.diamonds);

  constructor(suit: string) {
    this.suit = suit
  }

  get html(): string {
    return `<div class="card--suit-placeholder${this.dropTarget ? ' drop-target' : ''}"><img src="./media/${this.suit}.svg" draggable="false"></div>`;
  }
}

function foundationDeckParentFor(key: string): Element {
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
  id: string;
  state: State;
  timeDiscarded: Date;

  constructor(state: State, id?: string, timeDiscarded?: Date) {
    this.state = new State();

    let allCardsClone = [];

    for (const card of state.allCards) {
      allCardsClone.push(card.clone());
    }

    this.state.allCards = allCardsClone;

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
    }

    for (const key in foundationDecksClone) {
      for (const card of state.foundationDecks[key]) {
        foundationDecksClone[key].push(card.clone());
      }
    }

    this.state.foundationDecks = foundationDecksClone;

    this.state.history = state.history;
    this.state.gameEnded = state.gameEnded;

    if (id) {
      this.id = id;
    } else {
      this.id = uuid.v4();
    }

    if (timeDiscarded) {
      this.timeDiscarded = timeDiscarded;
    } else {
      this.timeDiscarded = new Date();
    }
  }
}

class Alert {
  id: string;
  buttonId: string;
  text: string;
  fadeOut: boolean = true;

  constructor(text: string, id?: string, buttonId?: string, fadeOut?: boolean) {
    this.text = text;

    if (id) {
      this.id = id;
    } else {
      this.id = uuid.v4();
    }

    if (buttonId) {
      this.buttonId = buttonId;
    } else {
      this.buttonId = uuid.v4();
    }

    if (fadeOut) {
      this.fadeOut = fadeOut;
    }
  }

  get html(): string {
    return `<div class="alert" id="${this.id}">
      <span>${this.text}</span>
      <button id="${this.buttonId}"><strong>X</strong></button>
    </div>`;
  }
}

class State {
  allCards: Array<Card>;
  history: Array<StateLog> = [];
  gameEnded: boolean = false;

  stockDeck: Deck;
  stockRevealedCards: Array<Card>;
  workingPiles: Array<Array<Card>>;
  foundationDecks: {
    spades: Array<Card>,
    clubs: Array<Card>,
    hearts: Array<Card>,
    diamonds: Array<Card>
  };

  alerts: Array<Alert> = [];

  constructor() {
    this.resetState();
  }

  loadState(state: State) {
    for (const key in state) {
      this[key] = state[key];
    }
  }

  static deepCopy<T>(source: T): T {
    return Array.isArray(source)
      ? source.map(item => this.deepCopy(item))
      : source instanceof Date
        ? new Date(source.getTime())
        : source && typeof source === 'object'
          ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
            Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!);
            o[prop] = this.deepCopy((source as { [key: string]: any })[prop]);
            return o;
          }, Object.create(Object.getPrototypeOf(source)))
          : source as T;
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

    let workingPiles: Array<Array<Card>> = [];

    for (let iA = 1; iA < 8; iA++) {
      var pile = [];

      for (let iB = 0; iB < iA; iB++) {
        let card = this.stockDeck.cards.pop()

        pile.push(card);
      }

      workingPiles.push(pile);
    }

    this.workingPiles = workingPiles;

    this.foundationDecks = {
      spades: new Array<Card>(),
      clubs: new Array<Card>(),
      hearts: new Array<Card>(),
      diamonds: new Array<Card>()
    };

    this.alerts = [];
  }

  forceUpdateUI() {
    const updateForAlerts = () => {
      alerts.innerHTML = "";

      for (const alert of this.alerts) {
        alerts.innerHTML += alert.html;

        if (alert.fadeOut) {
          document.getElementById(alert.buttonId).addEventListener("click", () => {
            fadeOut(alert.id);
          });
        }
      }
    }

    gameStockClothRevealedCards.replaceChildren();

    this.stockRevealedCards.forEach((card, index) => {
      if (index === 0) {
        gameStockClothRevealedCards.innerHTML += card.html + "\n";
      } else {
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
          } else {
            cardCopy.draggable = false;
            document.getElementById(pileId).innerHTML += cardCopy.html;
          }
        } else if (card.forceFaceUp === true && i !== cards.length - 1) {
          makeDragPile = true;
          pileId = uuid.v4();

          cardCopy.draggable = false;

          pile.innerHTML += `<div class="game__working-cloth__face-up-pile" id="${pileId}" draggable="true">
            ${cardCopy.html}
          </div>`;
        } else if (i === cards.length - 1) {
          pile.innerHTML += card.html;
        } else {
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
      } else {
        foundationDeckParentFor(key).innerHTML = SuitPlaceholder[key].html;
      }
    }

    const cards = document.getElementsByClassName("card");
    const piles = document.getElementsByClassName("game__working-cloth__face-up-pile");

    const dragStartActions = (event: DragEvent) => {
      event.dataTransfer.setData("id", (event.target as Element).id);
      event.dataTransfer.setData("element", (event.target as Element).toString());
    }

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

      dropTarget.addEventListener("dragover", (event: DragEvent) => {
        event.preventDefault();
      });
    }

    for (let i = 0; i < dropTargets.length; i++) {
      const dropTarget = dropTargets.item(i);

      dropTarget.addEventListener("drop", (event: DragEvent) => {
        const id = event.dataTransfer.getData("id");
        let dragElement = document.getElementById(id);
        let dragItem: Card | Pile;

        if (dragElement === null) {
          throw new Error(`dragElement was null: dataTransfer.getData.('element') is ${event.dataTransfer.getData("element")}`);
        }

        if (dragElement.classList.contains("game__working-cloth__face-up-pile")) {
          let cards: Array<Card> = [];

          for (let i = 0; i < dragElement.children.length; i++) {
            cards.push(cardWithId(dragElement.children[i].id));
          }

          dragItem = {
            id: id,
            cards: cards
          }
        } else {
          dragItem = cardWithId(id);
        }

        if (checkMoveValidity(dragItem, gamePositionForElement(dropTarget as HTMLElement))) {
          event.preventDefault();
          moveItem(dragItem, gamePositionForElement(dropTarget as HTMLElement));
          clickSoundEffect.play();
          this.forceUpdateUI();
        }
      });
    }

    const setElementStates = (state: boolean) => {
      const cards = document.getElementsByClassName("card");
      const decks = document.getElementsByClassName("deck");

      const setPointerEvents = (iterator: number, value: string) => {
        (cards.item(iterator) as HTMLElement).style.pointerEvents = value;
      }

      if (state === true) {
        for (let i = 0; i < cards.length; i++) {
          setPointerEvents(i, "none");
        }

        for (let i = 0; i < decks.length; i++) {
          setPointerEvents(i, "none");
        }
      } else {
        for (let i = 0; i < cards.length; i++) {
          setPointerEvents(i, "auto");
        }

        for (let i = 0; i < decks.length; i++) {
          setPointerEvents(i, "auto");
        }
      }
    }

    if (this.gameEnded) {
      setElementStates(true);

      const alertText = "Congratulations! You won the game."

      if (this.alerts.filter(element => { return element.text === alertText }).length === 0) {
        this.alerts.push(new Alert(alertText));
        updateForAlerts();
      }
    } else {
      setElementStates(false);
    }

    if (this.history.length === 0) {
      (gameControlsUndo as HTMLInputElement).disabled = true;
      (gameControlsUndo as HTMLElement).classList.add("disabled");
    } else {
      (gameControlsUndo as HTMLInputElement).disabled = false;
      (gameControlsUndo as HTMLElement).classList.remove("disabled");
    }
  }
}

let state = new State();
state.forceUpdateUI();

/*** Functional Runtime Code ***/

function fadeOut(id: string) {
  document.getElementById(id).style.animationName = 'fadeOut';

  const removeElement = () => {
    document.getElementById(id).remove()
  }

  window.setTimeout(removeElement, 1000);
}

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
      } else {
        pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
      }
    }

    if (state.workingPiles[i].length > 9) {
      (pile as HTMLElement).style.overflowY = "scroll";
    }
  }

  for (let i = 0; i < forceFaceUpPiles.length; i++) {
    let pile = forceFaceUpPiles.item(i);

    for (let i = 0; i < pile.children.length; i++) {
      pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
    }
  }
}

function clearFoundationDecksContent(): boolean {
  let successful = true;

  for (let i = 0; i < gameFoundationCloth.children.length; i++) {
    gameFoundationCloth.children[i].replaceChildren();
    if (gameFoundationCloth.children[i].children.length != 0) {
      successful = false;
    };
  }

  return successful;
}

//Deck click logic
gameStockClothDeck.addEventListener("click", (event) => {
  state.history.push(new StateLog(state));

  const sRC = state.stockRevealedCards;
  const sDC = state.stockDeck.cards;

  if (sRC.length < 3) {
    sRC.unshift(sDC.pop());
  } else {
    sDC.unshift(sRC.pop());
    sRC.unshift(sDC.pop());
  }

  state.forceUpdateUI();
});

//New game button functionality
gameControlsNewGame.addEventListener("click", () => {
  state.history = [];

  state.resetState();
  state.forceUpdateUI();
});

//Undo button functionality
gameControlsUndo.addEventListener("click", () => {
  state.loadState(state.history[state.history.length - 1].state);
  state.history.splice(state.history.length - 1, 1);
  state.forceUpdateUI();
});

/** Game Logic **/

//returns true if the game is over, and false otherwise.
function checkGameStatus(): boolean {
  let tally = 0;

  for (const key in state.foundationDecks) {
    if (state.foundationDecks[key].length === 13) {
      tally++;
    }
  }

  return tally === 4 ? true : false;
}

function cardWithId(id: string): Card {
  for (const card of state.stockDeck.cards) {
    if (card.id === id) return card;
  }

  for (const card of state.stockRevealedCards) {
    if (card.id === id) return card;
  }

  for (const pile of state.workingPiles) {
    for (const card of pile) {
      if (card.id === id) return card;
    }
  }

  for (const key in state.foundationDecks) {
    for (const card of state.foundationDecks[key]) {
      if (card.id === id) return card;
    }
  }

  throw new Error("Unable to find card specified by ID: " + id);
}

function gamePositionForElement(gameElement: HTMLElement): GamePositions {
  const parentElement = gameElement.parentElement;

  if (parentElement.classList.contains("game__working-cloth__face-up-pile")) {
    if (Number(parentElement.parentElement.dataset.index)) {
      return Number(parentElement.parentElement.dataset.index) + 1;
    } else {
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
  } else if (gameElement.classList.contains("game__working-cloth__face-up-pile")) {
    if (Number(gameElement.parentElement.dataset.index)) {
      return Number(gameElement.parentElement.dataset.index) + 1;
    } else {
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
    } else {
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
  } else if (gameElement.classList.contains("pile")) {
    if (Number(gameElement.dataset.index)) {
      return Number(gameElement.dataset.index) + 1;
    } else {
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

function moveItem(item: Card | Pile, destination: GamePositions) {
  state.history.push(new StateLog(state));

  if (item instanceof Card) {
    const card = item as Card;
    const cardElement = document.getElementById(card.id);
    const origin = gamePositionForElement(cardElement);

    //add card to destination
    if (destination > 0 && destination < 8) {
      card.dropTarget = false;

      state.workingPiles[destination - 1][state.workingPiles[destination - 1].length - 1].forceFaceUp = true;
      state.workingPiles[destination - 1].push(card);
    } else if (destination > 7 && destination < 12) {
      card.dropTarget = true;

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

    //remove card from origin
    if (origin === 0) {
      for (let i = 0; i < 3; i++) {
        if (gameStockClothRevealedCards.children.item(i) === cardElement) {
          state.stockRevealedCards.splice(i, 1);
        }
      }
    } else if (origin > 0 && origin < 8) {
      state.workingPiles[origin - 1].pop();
    } else if (origin > 7 && origin < 12) {
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
  } else {
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

function checkMoveValidity(item: Card | Pile, destination: GamePositions): boolean {
  if (destination === 12) {
    return false;
  }

  if (item instanceof Card) {
    const card = item as Card;

    const cardElement = document.getElementById(card.id);

    if (gamePositionForElement(cardElement) == destination) {
      return false;
    }

    if (destination > 7) {
      const check = function (foundationSuit: Suits, foundationCloth: Element): boolean {
        if (card.suit !== foundationSuit) {
          return false;
        }

        const topElement = foundationCloth.children.item(0);

        if (topElement.classList.contains("card--suit-placeholder") && card.value == Values.ace) {
          return true;
        } else if (topElement.classList.contains("card--suit-placeholder") && card.value != Values.ace) {
          return false;
        } else if (card > cardWithId(topElement.id)) {
          return true;
        }
      }

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
      const pile = state.workingPiles[destination - 1];

      if (pile.length == 0) {
        return false;
      }

      const topCard = pile[pile.length - 1];

      if (card.color !== topCard.color && card.valueOf() === topCard.valueOf() as any - 1) {
        return true;
      }
    }
  } else {
    if (destination > 0 && destination < 8) {
      const workingPile = state.workingPiles[destination - 1];

      if (workingPile.length == 0) {
        return false;
      }

      const pile = item;
      const bottomPileCard = pile.cards[0];
      const topWorkingPileCard = workingPile[workingPile.length - 1];

      if (bottomPileCard.color !== topWorkingPileCard.color && bottomPileCard.valueOf() === topWorkingPileCard.valueOf() as any - 1) {
        return true;
      }
    } else {
      return false;
    }
  }

  return false;
}