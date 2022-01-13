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
    const updateUIForAlerts = () => {
      alerts.innerHTML = "";

      //For each alert, the alerts html representation will be added to the alerts container element's content to display it on screen.
      for (const alert of this.alerts) {
        alerts.innerHTML += alert.html;

        //If the alert that was just added was set to fadeOut when dismissed instead of just disappearing, an event listener is added to the alert's dismiss button which will cause it to fade out when dismissed. Otherwise, when the alert is dismissed it will disappear instantly. The alert is removed from the state when dismissed, regardless.
        document.getElementById(alert.buttonId).addEventListener("click", () => {
          if (alert.fadeOut) {
            //The fadeOut method is declared elsewhere and a callback function is provided to it which removes the alert after it finishes.
            fadeOut(alert.id, () => {
              this.alerts.splice(this.alerts.indexOf(alert), 1);
            });
          } else {
            //The alert is instantly removed from the state.
            this.alerts.splice(this.alerts.indexOf(alert), 1);
          }
        });
      }
    }

    //The game's alerts are presented onto the screen to reflect the current state of the UI. Alerts can be added later in the function, however, they will have to be presented by calling the function again.
    updateUIForAlerts();

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

      //The pile variable is set to the element corresponding to the current iteration.
      const pile = gameWorkingClothPiles.children[i];
      pile.replaceChildren();

      //If there are no cards in the pile, this function has no reason to continue executing its logic, and thus continues on to its next iteration.
      if (cards.length === 0) {
        continue;
      }

      //This loop cycles through each card in the current working pile. It will create a pile if the card is forced face up, and just a regular face-down card otherwise. The final card is always presented face-up.
      for (let i = 0, makeDragPile = false, pileId = ""; i < cards.length; i++) {
        const card = cards[i];
        let cardCopy = card.clone();

        //This logic checks if the for loop is set to create a drag pile or not based on its makeDragPile boolean variable. If it is set to true, it executes the code to make the pile. Otherwise, it checks if the current card is set to be forced face-up and is not the last card. If so, the card is added into a new pile div container which is assigned an Id. The card is set not to be draggable (but the pile is so it can be dragged) and makeDragPile is set to true so the rest of the cards created will be placed in the pile container.
        //The final two else-if/else statements run when the iterator is set not to make a new pile and simply add a face-down card to the working pile until it reaches the last card, in which case it adds the card face-up.
        if (makeDragPile === true) {
          //This if statement checks whether the card currently being iterated on is the last in the series. If it is, the card is added normally. Otherwise, the card is added and its draggable property is set to false so it cannot be dragged (as per the rules of Solitaire).
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

          //This is the pile HTML. The pile is a div container which holds add the card that follow after its creation. The pile is draggable so that the entire pile can be dragged from one working pile to another.
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

    //This pile styling call is made to style all the newly added piles above.
    styleAllPiles();

    //The foundation decks are cleared in this for loop in preparation for the addition of cards to the decks. It works by iterating over foundation deck and removing its children.
    for (let i = 0; i < gameFoundationCloth.children.length; i++) {
      gameFoundationCloth.children[i].replaceChildren();
    }

    //For each foundation deck a SuitPlaceholder is added corresponding to that pile. However, if the pile holds cards the top card is found and presented for the pile.
    for (const key in this.foundationDecks) {
      if (this.foundationDecks[key].length != 0) {
        let topCard = this.foundationDecks[key][this.foundationDecks[key].length - 1];
        foundationDeckParentFor(key).innerHTML = topCard.html;
      } else {
        foundationDeckParentFor(key).innerHTML = SuitPlaceholder[key].html;
      }
    }

    /* Drag and Drop Code */

    //These two constants are set to contain all the cards and piles, in the UI, respectively,
    const cards = document.getElementsByClassName("card");
    const piles = document.getElementsByClassName("game__working-cloth__face-up-pile");

    //These dragStartActions take the elemental target they are called on and stores its id and basic html structure in the event provided's dataTransfer property to be stored over the course of a drag.
    const dragStartActions = (event: DragEvent) => {
      event.dataTransfer.setData("id", (event.target as Element).id);
      event.dataTransfer.setData("element", (event.target as Element).toString());
    }

    //For each card the dragStartActions are attached using an event listener for when the user starts dragging a card.
    for (let i = 0; i < cards.length; i++) {
      const card = cards.item(i);

      card.addEventListener("dragstart", dragStartActions);
    }

    //For each pile the dragStartActions are attached using an event listener for when the user starts dragging a pile.
    for (let i = 0; i < piles.length; i++) {
      const pile = piles.item(i);

      pile.addEventListener("dragstart", dragStartActions);
    }

    //The dropTargets constant stores all elements that are designated to be drop targets.
    const dropTargets = document.getElementsByClassName("drop-target");

    //This loop iterates over every dropTarget element and attaches event listeners to it to allow the user to attempt to drop an item on it.
    for (let i = 0; i < dropTargets.length; i++) {
      const dropTarget = dropTargets.item(i); //This line gets the current item

      //This dragover event listener prevents the event's default behaviour which is to use the cursor to indicate that the user cannot drop over the location they are hovering over. Although the user may not be able to drop the card in the spot they are attempting to logically, this event listener allows them to try.
      dropTarget.addEventListener("dragover", (event: DragEvent) => {
        event.preventDefault();
      });

      //This event listener adds a response for when the user drops an element on a dropTarget. The callback function will attempt to decipher whether the user is dragging a pile or card. If they are dragging neither, an error will be thrown (which can happen, for instance if a user tries to drag an image onto a dropTarget, but is not an issue). After figuring out what is being dragged, the callback function will check whether the move is valid, and if so move the card and update the UI.
      dropTarget.addEventListener("drop", (event: DragEvent) => {
        const id = event.dataTransfer.getData("id");
        let dragElement = document.getElementById(id);
        let dragItem: Card | Pile; //dragItem is either of type Card or conforms to interface Pile. The purpose of the variable is to store the drag items' data model representation and validate the move attempting to be made.

        //This runs if the element being dragged didn't have an Id or couldn't be found in the DOM. If so, an error is thrown to log the issue. This may happen if the user attempts to drag an image onto the dropTarget. However, this is expected behaviour. The console.log and error statements are there to report the incident to client-side developers.
        if (dragElement === null) {
          console.log(dragElement);
          throw new Error(`dragElement was null.`);
        }

        //This if statement checks if the element being dragged is a working pile pile using its classlist.
        if (dragElement.classList.contains("game__working-cloth__face-up-pile")) {
          let cards: Array<Card> = [];

          //For each child card of the dragElement, the card's representation in the state is copied pushed to the cards array.
          for (let i = 0; i < dragElement.children.length; i++) {
            cards.push(cardWithId(dragElement.children[i].id));
          }

          //dragItem is set to an object which conforms to the Pile interface.
          dragItem = {
            id: id,
            cards: cards
          }
        } else {
          //This else block runs if the element has been identified as a card. If so, it's representation in the data model is assigned to dragItem.
          dragItem = cardWithId(id);
        }

        //This if statement checks if the move being made is valid by passing in the dragItem and the destination using another function. If the move is valid, the card will be moved in the state and the UI will be updated to reflect the change.
        if (checkMoveValidity(dragItem, gamePositionForElement(dropTarget as HTMLElement))) {
          event.preventDefault(); //Preventing the default here prevents the card from flying back to its origin for the user.

          //moveItem moves the item from its current position to its destination.
          moveItem(dragItem, gamePositionForElement(dropTarget as HTMLElement));

          //The click sound effect is played to indicate success to the user.
          clickSoundEffect.play();

          //The UI is updated to reflect the changes.
          this.forceUpdateUI();
        }
      });
    }

    //This anonymous function serves to change the UI's state to be interactive or static based on its input.
    const setElementStates = (toStatic: boolean) => {
      const cards = document.getElementsByClassName("card");
      const decks = document.getElementsByClassName("deck");

      //The pointer events css property determines whether a user can actually move a card or not with their cursor. This anonymous function serves to automate changing the pointer events value based on its input parameter.
      const setPointerEvents = (value: string) => {
        for (let i = 0; i < cards.length; i++) {
          (cards.item(i) as HTMLElement).style.pointerEvents = value;
        }

        for (let i = 0; i < decks.length; i++) {
          (decks.item(i) as HTMLElement).style.pointerEvents = value;
        }
      }

      //If the toStatic parameter is true, the game's elements should be set to be static. Otherwise, it is set to be interactive with the "auto" pointer events value.
      if (toStatic === true) {
        setPointerEvents("none");
      } else {
        setPointerEvents("auto");
      }
    }

    //This conditional statement checks whether the game has ended. If it has, all the game's elements are set to be static. Otherwise, the game will be made interactive.
    if (this.gameEnded) {
      setElementStates(true);

      //A message for the upcoming alert.
      const alertText = "Congratulations! You won the game."

      //This conditional statement checks whether an alert exists in the state's alerts property that already matches the message of the alertText. If an alert doesn't it adds the alert to the alerts section.
      if (this.alerts.filter(element => { return element.text === alertText }).length === 0) {
        //A new alert is created and added to the alerts property.
        this.alerts.push(new Alert(alertText));
        //The UI is updated to reflect the change.
        updateUIForAlerts();
      }
    } else {
      setElementStates(false);
    }

    //If no StateLogs have been recorded in the history proper,ty the undo button will be disabled as there is no move to undo. Otherwise, the undo button will be enabled.
    if (this.history.length === 0) {
      (gameControlsUndo as HTMLInputElement).disabled = true;
      (gameControlsUndo as HTMLElement).classList.add("disabled");
    } else {
      (gameControlsUndo as HTMLInputElement).disabled = false;
      (gameControlsUndo as HTMLElement).classList.remove("disabled");
    }
  }
}

//This is the declaration point of the state which is used all over in this project.
let state = new State();
state.forceUpdateUI(); //The UI is immediately updated to reflect the state.

/*** Functional Runtime Code ***/

//The fadeOut function finds the element provided to it's identifier and gives it the the styling to slowly fade out over the period of one second. After that period has elapsed, the element is removed from the DOM. Additionally, a callback function is executed if one is provided.
function fadeOut(id: string, callback: () => void) {
  document.getElementById(id).style.animationName = 'fadeOut';

  //The rest of this functions actions are in an embedded callback function because otherwise they would run immediately instead of at the correct time.
  setTimeout(() => {
    document.getElementById(id).remove()

    //The callback function is called if one was provided.
    if (callback) {
      callback();
    }
  }, 1000);
}

//This function styles all piles in the DOM by offsetting cards on top of each other as they normally would when physically playing Solitaire. The function is called after every state change as the pile styling will need to be redone.
function styleAllPiles() {
  //Both working piles and embedded face-up piles receive the styling in this function.
  const piles = document.getElementsByClassName("pile");
  const forceFaceUpPiles = document.getElementsByClassName("game__working-cloth__face-up-pile");

  const offsetStart = 4.5; //This is a tweaked value which sets how offset the cards are.

  //For each pile identified, each of the pile's child cards have a transform applied which is proportional to their position in the pile. The greater their position, the more offset that is applied.
  for (let i = 0; i < piles.length; i++) {
    let pile = piles.item(i);

    for (let i = 0; i < pile.children.length; i++) {
      pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
    }

    //If the pile currently being iterated on has more than 9 cards, it will be shown with a scroll bar as the cards will end up flowing off the working cloth and be hidden.
    if (state.workingPiles[i].length > 9) {
      (pile as HTMLElement).style.overflowY = "scroll";
    }
  }

  //For each force up pile, the same treatment is applied as the regular working piles. Each child card is applied a proportional offset to its position in the pile.
  for (let i = 0; i < forceFaceUpPiles.length; i++) {
    let pile = forceFaceUpPiles.item(i);

    for (let i = 0; i < pile.children.length; i++) {
      pile.children[i].setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
    }
  }
}

//An event listener is added here to the stockDeck's HTML element. The event listener sets it such that every time the deck is clicked the deck will dispense a new card to the stockRevealedCards.
gameStockClothDeck.addEventListener("click", (event) => {
  //Since revealing a card is a move, the state is logged in preparation for the change, allowing the move to be undone.
  state.history.push(new StateLog(state));

  const sRC = state.stockRevealedCards;
  const sDC = state.stockDeck.cards;

  //This conditional checks whether three cards exist in the stockRevealedCards. If there are less than three, a new card is added normally from the stockDeck. Otherwise, the oldest card is put back into the stockDeck and a new card is added from it as well.
  if (sRC.length < 3) {
    sRC.unshift(sDC.pop());
  } else {
    sDC.unshift(sRC.pop());
    sRC.unshift(sDC.pop());
  }

  //The state is updated to reflect the change made.
  state.forceUpdateUI();
});

//This event listener makes the new game button functional.
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

state.gameEnded = true;
state.forceUpdateUI();