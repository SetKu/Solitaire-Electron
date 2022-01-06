let uuid = require('uuid');
//The TS compiler knows node's require function will return the any type with the help of the npm @types/node package.

/*** Static Page Elements ***/

var cardHeight = Number(getComputedStyle(document.querySelector(".card")).getPropertyValue("height"));

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

class Card {
  suit: String;
  value: String;
  id: String;
  draggable: boolean = true;
  dropTarget: boolean = false;

  constructor(suit: String, value: String) {
    this.suit = suit;
    this.value = value;
    this.id = uuid.v4();
  }

  /*
  * HTML structuring for cards adapted from code examples shown in a Medium post by Juha Lindstedt.
  * Lindstedt, Juda. (2018, November 6). "JavaScript Playing Cards Part 2: Graphics." Medium. Retrieved November 26, 2021 from https://medium.com/@pakastin/javascript-playing-cards-part-2-graphics-cd65d331ad00.
  */
  get html(): String {
    return `<div class="card ${this.cardColor}${this.dropTarget ? ' drop-target' : ''}" id="${this.id}" draggable="${this.draggable}">
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

  get cardColor(): String {
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
  static invisibleDropTargetHTML = `<div class="card--invisible">`
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
  suit: String;

  static spades = new SuitPlaceholder(Suits.spades);
  static clubs = new SuitPlaceholder(Suits.clubs);
  static hearts = new SuitPlaceholder(Suits.hearts);
  static diamonds = new SuitPlaceholder(Suits.diamonds);

  constructor(suit: String) {
    this.suit = suit
  }

  get html(): String {
    return `<div class="card--suit-placeholder"><img src="./media/${this.suit}.svg"></div>`;
  }
}

function foundationDeckParentFor(key: String): Element {
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

function cardWith(id: String): Card {
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

  throw new Error("Unable to find card specified by id: " + id);
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

/** Drag and Drop Implementation **/

