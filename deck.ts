enum Suits {
  spades = "♠️",
  clubs = "♣️",
  hearts = "♥️",
  diamonds = "♦️"
}

enum Symbols {
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

export default class Deck {
  cards: [Card];

  constructor(cards: [Card]) {
    this.cards = cards;
  }
}

class Card {
  suit: Suits;
  symbol: Symbols;

  constructor(suit: Suits, symbol: Symbols) {
    this.suit = suit;
    this.symbol = symbol;
  }
}

// export function newDeck() {
//   let cards = [];

//   for (const suit in Suits) {
//     for (const symbol in Symbols) {
//       cards.push(new Card(suit, symbol))
//     }
//   }

//   return new Deck()
// }

let myCard = new Card(Suits.spades, Symbols.ace);