let uuid = require('uuid');

/* Static Game Elements */

var gameStockClothRevealedCards = $('.game__stock-cloth__revealed-cards');
var gameWorkingClothPiles = $('.game__working-cloth__piles');
var gameFoundationCloth = $('.game__foundation-cloth');
var gameFoundationClothSpades = $('.game__foundation-cloth__spades');
var gameFoundationClothClubs = $('.game__foundation-cloth__clubs');
var gameFoundationClothHearts = $('.game__foundation-cloth__hearts');
var gameFoundationClothDiamonds = $('.game__foundation-cloth__diamonds');

/* Data Model */

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

type Pile = Array<Card>;

class State {

  stockDeck: Deck;
  stockRevealedCards: Array<Card>;
  workingPiles: Array<Pile>;
  foundationDecks: {
    spades: Array<Card>,
    clubs: Array<Card>,
    hearts: Array<Card>,
    diamonds: Array<Card>
  };

  watchChanges: false;

  constructor() {
    this.resetState();
  }

  resetState() {
    this.stockDeck = Deck.newDeck().shuffled();
    this.stockRevealedCards = [];

    let workingPiles: Array<Pile> = [];

    for (let iA = 1; iA < 8; iA++) {
      var pile = [];

      for (let iB = 0; iB < iA; iB++) {
        pile.push(this.stockDeck.cards.pop());
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
    gameStockClothRevealedCards.empty();

    this.stockRevealedCards.forEach((card) => {
      gameStockClothRevealedCards.html((_, oldHTML) => {
        return oldHTML += card.html as string;
      });
    })

    for (const key in this.foundationDecks) {
      if (this.foundationDecks[key].length != 0) {
        foundationDeckParentFor(key).html(this.foundationDecks[key][this.foundationDecks[key].length - 1].html as string);
      } else {
        foundationDeckParentFor(key).html(SuitPlaceholder[key]);
      }
    }
  }

  resetUI() {
    gameFoundationCloth.html();
  }
}

class Deck {
  cards: Array<Card>;

  constructor(cards: Array<Card>) {
    this.cards = cards;
  }

  shuffled(): Deck {
    for (var i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
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

class Card {
  suit: String;
  value: String;
  id: String;

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

  get cardColor(): String {
    switch (this.suit) {
      case Suits.spades || Suits.clubs:
        return SuitColors.black;
      case Suits.diamonds || Suits.hearts:
        return SuitColors.red;
    }
  }
}

class SuitPlaceholder {
  suit: String
  id: String

  static spades = new SuitPlaceholder(Suits.spades);
  static clubs = new SuitPlaceholder(Suits.clubs);
  static hearts = new SuitPlaceholder(Suits.hearts);
  static diamonds = new SuitPlaceholder(Suits.diamonds);

  constructor(suit: String) {
    this.suit = suit
    this.id = uuid.v4();
  }

  get html(): String {
    return `<div class="card--suit-placeholder"><img src="./media/${this.suit}.svg"></div>`;
  }
}

function foundationDeckParentFor(key: String): JQuery<HTMLElement> {
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

/*
  TODO: Function to move cards.
*/