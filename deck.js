const Suits = {
    spades: "♠️",
    clubs: "♣️",
    hearts: "♥️",
    diamonds: "♦️"
};
const Symbols = {
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
};
export default class Deck {
    constructor(cards = newDeck()) {
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
    constructor(suit, symbol) {
        this.suit = suit;
        this.symbol = symbol;
    }
}
function newDeck() {
    let cards = [];
    for (const suit in Suits) {
        for (const symbol in Symbols) {
            cards.push(new Card(Suits[suit], Symbols[symbol]));
        }
    }
    return cards;
}
