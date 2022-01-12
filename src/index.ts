//This file is the index.ts file. It is written in TypeScript and compiled into regular ES6 JavaScript as index.js. This index.js file is then compressed and has its dependecies handled using webpack to creates the ../dist/main.js file which is minified and what the browser actually uses when rendering the index.html file.

//This code imports the uuid node package manager module 'uuid' which can generate random unqiue identifier strings.
let uuid = require('uuid');

/*** Static Elements ***/

//This section sets up a series of variables each corresponding to a static html element gotten by a class name. The querySelector will get the first html element it finds with the corresponding class.

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

//This variable sets up a reference to the click sound effect to be played later.
var clickSoundEffect = new Audio('./media/nirmatara_click-sound-effect.wav');

/*** Data Model ***/

//This section hosts a series of functions, enums, and classes all of which makeup the backend of my data model.

//The SuitColors enum stores the two possible colors a card could be in the game.

enum SuitColors {
  black = "black",
  red = "red"
}

/*
 * Deck and Card class naming structure inspired by Web Dev Simplified's video on recreating the card game "war" for the web.
 * Web Dev Simplified. (2020, November 14). "How To Build A Simple Card Game With JavaScript." YouTube. Retrieved November 23, 2021, from https://youtu.be/NxRwIZWjLtE.
*/

//The Suits and Values enums each store the possible suits and values a card could have, respectively.

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

//The GamePositions enum stores all the possible positions a card could be placed in in the game. From the stock to foundation decks.

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

//The Card class sets up the data model for the cards within the game. It stores several properties a card would have, such as its suit and value, and has computed properties and methods to perform calculated actions on the card.

class Card {
  //The following are properties of which store information about the card.
  suit: string;
  value: string;

  //The id property stores the card's unqiue identifier which can be used to locate it in the data model and in the user interface.
  id: string;

  //The following are properties which affect how the card is implemented and rendered in the user interface.
  draggable: boolean = true;
  dropTarget: boolean = false;
  forceFaceUp: boolean = false;

  //The constructor actually creates Card instance. For each card it is required to provide a suit and a value. An id can also be provided to override the automatic generation of one. 
  constructor(suit: string, value: string, id?: string) {
    this.suit = suit;
    this.value = value;

    if (id) {
      this.id = id;
    } else {
      this.id = uuid.v4();
    }
  }

  //This is a computed property which returns the html needed to display the car in the UI.
  get html(): string {
    /*
    * HTML structuring for cards adapted from code examples shown in a Medium post by Juha Lindstedt.
    * Lindstedt, Juda. (2018, November 6). "JavaScript Playing Cards Part 2: Graphics." Medium. Retrieved November 26, 2021 from https://medium.com/@pakastin/javascript-playing-cards-part-2-graphics-cd65d331ad00.
    */

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

  //This computed property returns the color of the card based on its suit.
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

  //This property is static (meaning its owned by the class) and returns the html required to display a face-down card.
  static faceDownHTML = `<div class="card--face-down"></div>`

  //The clone method creates a new unlinked card instance with all the same values as the card its called on, copying it.
  clone(): Card {
    let newCard = new Card(this.suit, this.value, this.id);

    newCard.draggable = this.draggable;
    newCard.forceFaceUp = this.forceFaceUp;
    newCard.dropTarget = this.dropTarget;

    return newCard;
  }
}

//This prototype assignment alters the way the primitive value of a card is computed. It is computed by returning a number value corresponding to a cards value (aces are low). The change allows for two cards to be compared using the native greater than and less than operations within JavaScript/TypeScript.
Card.prototype.valueOf = function (): Number {
  //The first if case here handles all card values from 1 through 10. The else case handles all other values which aren't able to be coerced to a number, such as 'A' for ace.
  if (Number(this.value)) {
    return Number(this.value);
  } else {
    if (this.value == 'A') return 1;
    if (this.value == 'J') return 11;
    if (this.value == 'Q') return 12;
    if (this.value == 'K') return 13;

    //An error is thrown if a primitive value cannot be calculated for the Card. In practice, this should never occur.
    throw new Error("Unable to determine primitive value of card.");
  }
};

//This interface (which can be though of as a protocol or template) defines an object that represents a pile in the data model. It has two corresponding properties which are required to locate and use the object in the data model.
interface Pile {
  id: string;
  cards: Array<Card>;
}

//The Deck class represents a deck in the data model and has a cards property, which contains the deck's cards, a shuffle method, and newDeck static method.
class Deck {
  cards: Array<Card>;

  constructor(cards: Array<Card>) {
    this.cards = cards;
  }

  //This method shuffles the cards of the deck is belongs to using a random proven algorithm.
  shuffled(): Deck {
    //Fisher-Yates Algorithm implementation. https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    //This algorithm iterates through each cards in the deck except for the last one it finds and switches its place with a random card in the deck.
    for (var a = this.cards.length - 1; a > 0; a--) {
      const b = Math.floor(Math.random() * (a + 1));
      [this.cards[a], this.cards[b]] = [this.cards[b], this.cards[a]];
    }

    return this;
  }

  //This newDeck static method returns a new suit-sorted deck.
  static newDeck(): Deck {
    let cards: Array<Card> = [];

    //This iteration adds a card for each value corresponding to a each suit. With 4 suits and 13 values, the resulting number of cards in the deck will be 52 cards.
    for (const suit of Object.values(Suits)) {
      for (const value of Object.values(Values)) {
        cards.push(new Card(suit, value));
      }
    }

    return new Deck(cards);
  }
}

//The SuitPlaceholder class defines the data model for a placeholder suit object to be used to represent an empty foundation deck.
class SuitPlaceholder {
  //These two properties define the only two configurable options for the SuitPlaceholder.
  suit: string;
  dropTarget: boolean = true;

  //These four static properties are primarily used when interacting with the SuitPlaceholder class. It returns the default corresponding SuitPlaceholder for each of the suits in the game.
  static spades = new SuitPlaceholder(Suits.spades);
  static clubs = new SuitPlaceholder(Suits.clubs);
  static hearts = new SuitPlaceholder(Suits.hearts);
  static diamonds = new SuitPlaceholder(Suits.diamonds);

  constructor(suit: string) {
    this.suit = suit
  }

  //This property returns the html for the suit placeholder which is just a simple div holding an image corresponding to the suit configured.
  get html(): string {
    return `<div class="card--suit-placeholder${this.dropTarget ? ' drop-target' : ''}"><img src="./media/${this.suit}.svg" draggable="false"></div>`;
  }
}

//This function returns the foundation deck for key provided to it which corresponds to the foundationDeck keys in the State class.
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

//This StateLog class is used to storage a logged version of a State instance which is associated with a unique identifier and a time. This is used in my code so far to log the State whenever a move is made, so that the undo button can undo it by loading a previous version of the state.
class StateLog {
  id: string;
  state: State;
  timeDiscarded: Date;

  //This constructor handles creating a new StateLog object which is complicated due to the nature of pointer references.
  constructor(state: State, id?: string, timeDiscarded?: Date) {
    //If the user provided a value for the optional id or timeDiscarded parameters, they are supplied instead of an automatically generated value for the instance.
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

    /* This next section creates a copy of a state object by cloning each of its properties, of which some require specific cloning actions to be taken. */

    //First a new State object is initialized.
    this.state = new State();

    //Second, a variable is created for the property about to be cloned.
    let stockDeckCloneCards = [];

    //Third, for each item in the property (which in this case means drilling down into the 'cards' property of that Deck typed property) it is cloned using its clone method and added to the designated variable for the clones, which delegate some of this constructors work.
    for (const card of state.stockDeck.cards) {
      stockDeckCloneCards.push(card.clone());
    }

    //Fourth, the clone variable is assigned to the current StateLog's state instance.
    this.state.stockDeck = new Deck(stockDeckCloneCards);

    //This processes is repeated again and again. If more explanation is required another comment will be present.
    let stockRevealedCardsClone = [];

    for (const card of state.stockRevealedCards) {
      stockRevealedCardsClone.push(card.clone());
    }

    this.state.stockRevealedCards = stockRevealedCardsClone;

    //The workingPiles state property is an array of 7 more arrays. To properly clone it, each of the arrays arrays' cards are cloned into their corresponding working pile in the clone variable.
    let workingPilesClone = [[], [], [], [], [], [], []];

    for (let i = 0; i < workingPilesClone.length; i++) {
      for (const card of state.workingPiles[i]) {
        workingPilesClone[i].push(card.clone());
      }
    }

    this.state.workingPiles = workingPilesClone;

    //The foundationDecks property is an object with for keys corresponding to each of the four suits. Each key corresponds to an array which holds the cards in the foundation deck.
    let foundationDecksClone = {
      spades: [],
      clubs: [],
      hearts: [],
      diamonds: []
    }

    //To clone the foundation deck, for each key in the foundationDeck property each of the cards within that key's corresponding array are cloned into that same corresponding key's properties in the clone variable.
    for (const key in foundationDecksClone) {
      for (const card of state.foundationDecks[key]) {
        foundationDecksClone[key].push(card.clone());
      }
    }

    this.state.foundationDecks = foundationDecksClone;

    //These final two properties can be normally copied, and not cloned, because they are value types, not reference types.
    this.state.history = state.history;
    this.state.gameEnded = state.gameEnded;
  }
}

//The Alert class will store the data for an alert banner which is presented to the user. The alert is configurable to fade out when the dismisses it, and accepts custom parameter values if desired by the user.
class Alert {
  id: string;
  buttonId: string;
  text: string;
  fadeOut: boolean = true;

  constructor(text: string, id?: string, buttonId?: string, fadeOut?: boolean) {
    //The text parameter is required.
    this.text = text;

    //Values are automatically supplied if none are provided.

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

  //The HTML method returns the HTML for the alert which is a div container that holds a span, for the text, and a button, for dismissal (or another action).
  get html(): string {
    return `<div class="alert" id="${this.id}">
      <span>${this.text}</span>
      <button id="${this.buttonId}"><strong>X</strong></button>
    </div>`;
  }
}

//The State class is likely the most important class in this entire project. Its instances are responsible for storing the game's state as data which can be rendered onto the screen using one of its methods.
class State {
  //The history property stores an array of StateLogs which are used so far to undo moves made in the game.
  history: Array<StateLog> = [];
  gameEnded: boolean = false;

  //These following properties actually organize where cards are in the game. The position of cards in these properties dictates how they are rendered in the UI.
  stockDeck: Deck;
  stockRevealedCards: Array<Card>;
  workingPiles: Array<Array<Card>>;
  foundationDecks: {
    spades: Array<Card>,
    clubs: Array<Card>,
    hearts: Array<Card>,
    diamonds: Array<Card>
  };

  //The alerts properties stores an array of alerts which should be presented to the user.
  alerts: Array<Alert> = [];

  //The only function of the constructor object in the State class is to call the object's resetState function which delegates the work of setting up the State.
  constructor() {
    this.resetState();
  }

  //The loadState function loads another State object by copying each of its properties to those that correspond in the current State object.
  loadState(state: State) {
    for (const key in state) {
      this[key] = state[key];
    }
  }

  //The resetState function resets the state to its starting state, creating a new randomized setup for the game.
  resetState() {
    //The gameEnded property is reset as a new game can't have ended off the bat.
    this.gameEnded = false;

    //The stockDeck property is used as a drawing pool to fill all the other card storing properties.
    this.stockDeck = Deck.newDeck().shuffled();

    //The stock revealed cards are reset as none should be present when the game starts.
    this.stockRevealedCards = [];

    let workingPiles: Array<Array<Card>> = [];

    //For each working pile in the game, of which there are 7, one card is added to the pile from the stock deck for each integer value from 0 up to, but not including, the working pile's index value. What that means is that the first pile will only receive one card, and the seventh pile will receive seven cards.
    for (let iA = 1; iA < 8; iA++) {
      var pile = [];

      for (let iB = 0; iB < iA; iB++) {
        pile.push(this.stockDeck.cards.pop());
      }

      workingPiles.push(pile);
    }

    this.workingPiles = workingPiles;

    //The foundationDecks object is initialized with each of its key's arrays empty as Solitaire starts with no cards in the foundation piles at the start.
    this.foundationDecks = {
      spades: new Array<Card>(),
      clubs: new Array<Card>(),
      hearts: new Array<Card>(),
      diamonds: new Array<Card>()
    };

    this.alerts = [];
  }

  //The forceUpdateUI method is the heavy hitter of the State object. It is responsible for rendering the current state's configuration in the UI. If a card is removed from one pile and added to another and the method is called, the method will update the UI to reflect that change.
  forceUpdateUI() {
    //This anonymous function updates the UI to show alerts above the game on in the user interface. It is capable of showing multiple alerts at once.
    const updateForAlerts = () => {
      alerts.innerHTML = "";

      //For each alert, the alerts html representation will be added to the alerts container element's content to display it on screen.
      for (const alert of this.alerts) {
        alerts.innerHTML += alert.html;

        //If the alert that was just added was set to fadeOut when dismissed instead of just disappearing, an event listener is added to the alert's dismiss button which will cause it to fade out when dismissed.
        if (alert.fadeOut) {
          document.getElementById(alert.buttonId).addEventListener("click", () => {
            //The fadeOut method is declared elsewhere.
            fadeOut(alert.id);
          });
        }
      }
    }

    //The ParentNode.replaceChildren() is used further in this project's code. It is an alternative and convenient way of emptying a html elements innerHTML content.
    gameStockClothRevealedCards.replaceChildren();

    //This iterative loop iterates over each cards in the stockRevealedCards property. If the card is the first/newest in the set, having an index of 0, it is displayed normally. Otherwise, the card is displayed with a lowered brightness and is not draggable/playable as per Solitaire's rules.
    this.stockRevealedCards.forEach((card, index) => {
      if (index === 0) {
        gameStockClothRevealedCards.innerHTML += card.html;
      } else {
        const cardCopy = card.clone();
        cardCopy.draggable = false;

        gameStockClothRevealedCards.innerHTML += cardCopy.html;

        document.getElementById(cardCopy.id).style.filter = "brightness(0.7)";
      }
    });

    //This loop iterates through each of the working cloths piles' cards and displays their children accordingly.
    for (let i = 0; i < 7; i++) {
      //The cards variable is set to the cards corresponding to the current iteration's pile.
      const cards = this.workingPiles[i];

      //If there are no cards in the pile, this function has no reason to continue executing its logic, and thus continues on to its next iteration.
      if (cards.length === 0) {
        continue;
      }

      //The pile variable is set to the element corresponding to the current iteration.
      const pile = gameWorkingClothPiles.children[i];
      pile.replaceChildren();

      //This loop cycles through each card in the current working pile. It will create a pile if the card is forced face up, and just a regular face-down card otherwise. The final card is always presented face-up.
      for (let i = 0, makeDragPile = false, pileId = ""; i < cards.length; i++) {
        const card = cards[i];
        let cardCopy = card.clone();

        //This logic checks if a the loop is set to create a drag pile or not. If it is, it executes code to do so.
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
  state.gameEnded = checkGameStatus();
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