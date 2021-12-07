let uuid = require('uuid');

enum SuitColors {
  black = "black",
  red = "red"
}

/*
* Deck and Card class naming structure inspired by Web Dev Simplified's video on recreating the card game war for the web.
* Web Dev Simplified. (2020, November 14). "How To Build A Simple Card Game With JavaScript." YouTube. Retrieved November 23, 2021, from https://youtu.be/NxRwIZWjLtE.
*/

const Suits = {
  spades: "spades",
  clubs: "clubs",
  hearts: "hearts",
  diamonds: "diamonds"
}

const Values = {
  ace: "A",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  jack: "J",
  queen: "Q",
  king: "K"
}

export default class Deck {
  cards: Array<Card>;

  constructor(cards: Array<Card>) {
    this.cards = cards;
  }

  shuffle() {
    for (var i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  static newDeck() {
    let cards: Array<Card> = [];

    for (const suit in Suits) {
      for (const value in Values) {
        cards.push(new Card(Suits[suit], Values[value]));
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
  get cardHTML(): String {
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