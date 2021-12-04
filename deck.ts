enum SuitColors {
  black = "black",
  red = "red"
}

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
  cards: [Card];

  constructor(cards: [Card] = newDeck()) {
    this.cards = cards;
  }

  shuffle() {
    for (var i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

class Card {
  suit: String;
  value: String;

  constructor(suit: String, value: String) {
    this.suit = suit;
    this.value = value;
  }

  get cardHTML(): String {
    return `<div class="card ${this.cardColor}">
      <div class="card__top-left">
        <div class="card__corner-value">${this.value}</div>
        <img src="media/${this.suit}.svg" class="card__corner-suit">
      </div>
      <div class="card__bottom-right">
        <div class="card__corner-value">${this.value}</div>
        <img src="media/${this.suit}.svg" class="card__corner-suit">
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

function newDeck() {
  let cards = [];

  for (const suit in Suits) {
    for (const value in Values) {
      cards.push(new Card(Suits[suit], Values[value]));
    }
  }

  return cards as [Card];
}