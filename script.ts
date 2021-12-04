import Deck from './deck.js';

function styleAllPiles() {
  const piles = document.getElementsByClassName("pile");
  const offsetStart = 4;

  for (let i = 0; i < piles.length; i++) {
    let element = piles.item(i);

    for (let i = 0; i < element.children.length; i++) {
      let child = element.children[i];

      console.log(child);

      if (i == 0) {
        continue;
      }

      child.setAttribute("style", `transform: translateY(-${offsetStart * i}rem);`);
    }
  }
}

styleAllPiles();