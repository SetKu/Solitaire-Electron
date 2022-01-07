let uuid = require('uuid');
//The TS compiler knows node's require function will return the any type with the help of the npm @types/node package.

/*** Static Page Elements ***/

// var cardHeight = Number(getComputedStyle(document.querySelector(".card")).getPropertyValue("height"));

var gameStockCloth = document.querySelector(".game__stock-cloth");
var gameStockClothDeck = document.querySelector(".deck");
var gameStockClothRevealedCards = document.querySelector('.game__stock-cloth__revealed-cards');
var gameWorkingClothPiles = document.querySelector('.game__working-cloth__piles');
var gameFoundationCloth = document.querySelector('.game__foundation-cloth');
var gameFoundationClothSpades = document.querySelector('.game__foundation-cloth__spades');
var gameFoundationClothClubs = document.querySelector('.game__foundation-cloth__clubs');
var gameFoundationClothHearts = document.querySelector('.game__foundation-cloth__hearts');
var gameFoundationClothDiamonds = document.querySelector('.game__foundation-cloth__diamonds');

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
  foundationDeckDiamonds
}

class Card {
  suit: string;
  value: string;
  id: string;
  draggable: boolean = true;
  dropTarget: boolean = false;

  constructor(suit: string, value: string) {
    this.suit = suit;
    this.value = value;
    this.id = uuid.v4();
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
  static invisibleDropTargetHTML = `<div class="card--invisible drop-target">`
}

Card.prototype.valueOf = function (): Number {
  if (Number(this.value)) {
    return Number(this.value);
  } else {
    if (this.value == 'J') return 11;
    if (this.value == 'Q') return 12;
    if (this.value == 'K') return 13;

    throw new Error("Unable to determine primitive value of card.");
  }
};

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

class State {
  allCards: Array<Card>;

  stockDeck: Deck;
  stockRevealedCards: Array<Card>;
  workingPiles: Array<Array<Card>>;
  foundationDecks: {
    spades: Array<Card>,
    clubs: Array<Card>,
    hearts: Array<Card>,
    diamonds: Array<Card>
  };

  constructor(silent: boolean = false) {
    this.resetState();

    if (silent) return;
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
  }

  forceUpdateUI() {
    gameStockClothRevealedCards.replaceChildren();

    this.stockRevealedCards.forEach((card) => {
      gameStockClothRevealedCards.innerHTML += card.html + "\n";
    })

    for (let i = 0; i < 7; i++) {
      const pile = gameWorkingClothPiles.children[i];
      pile.innerHTML = "";

      const cards = this.workingPiles[i];
      for (let i = 0; i < cards.length; i++) {
        if (i == cards.length - 1) {
          pile.innerHTML += cards[i].html;
        } else {
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
      } else {
        foundationDeckParentFor(key).innerHTML = SuitPlaceholder[key].html;
      }
    }

    const cards = document.getElementsByClassName("card");
    const invisibleCards = document.getElementsByClassName("card--invisible") as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < cards.length; i++) {
      const card = cards.item(i);

      card.addEventListener("dragstart", (event: DragEvent) => {
        event.dataTransfer.setData("id", (event.target as Element).id);

        for (let i = 0; i < invisibleCards.length; i++) {
          invisibleCards.item(i).style.pointerEvents = 'auto';
        }
      });

      card.addEventListener("dragend", (event: DragEvent) => {
        for (let i = 0; i < invisibleCards.length; i++) {
          invisibleCards.item(i).style.pointerEvents = 'none';
        }
      });
    }

    const dropTargets = document.getElementsByClassName("drop-target");

    for (let i = 0; i < dropTargets.length; i++) {
      const dropTarget = dropTargets.item(i);

      dropTarget.addEventListener("dragover", (event: DragEvent) => {
        const id = event.dataTransfer.getData("id");
        var dragElement = document.getElementById(id), dragCard = cardWith(id);

        if (checkMove(dragCard, gamePositionFor(dropTarget as HTMLElement))) {
          event.preventDefault();
          (<any>event.target).append(dragElement);
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

/*** Functional Runtime Code ***/

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

/** Game Logic **/

function cardWith(id: string): Card {
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

//Deck click logic
gameStockClothDeck.addEventListener("click", (event) => {
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

function gamePositionFor(gameElement: HTMLElement): GamePositions {
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

    //Shorter but riskier method of performing same operation above:
    // eval(`return GamePositions.workingPile${parentElement.dataset.index}`);
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

interface MoveResponse {
  isValid: boolean,
  executionAction?: () => void;
}

function checkMove(card: Card, destination: GamePositions): MoveResponse {
  const cardElement = document.getElementById(card.id);

  if (gamePositionFor(cardElement) == destination) {
    return { isValid: false };
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
      } else if (card > cardWith(topElement.id)) {
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
    const topCard = pile[pile.length - 1];

    if (card.color !== topCard.color && card.valueOf() === topCard.valueOf() as any - 1) {
      return true;
    }
  }

  return false;
}