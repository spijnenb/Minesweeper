// ES6 class with implemented encapsulation using closure
class Queue {

  #data = [];

  add = (pItem) => {
    if (pItem) {
      this.#data.unshift(pItem);
    }
  }

  remove = () => {
    if (this.#data.length > 0) {
      this.#data.pop();
    }
  }

  first = () => this.#data[0];

  last = () => this.#data[this.#data.length - 1];

  size = () => this.#data.length;
}