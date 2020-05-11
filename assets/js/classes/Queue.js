// ES6 class with implemented encapsulation using closure
class Queue {
  constructor() {
    let _data = [];

    this.add = (item) => {
      if (item) {
        _data.unshift(item);
      }
    }

    this.remove = () => {
      if (_data.length > 0) {
        _data.pop();
      }
    }

    this.first = () => _data[0];

    this.last = () => _data[_data.length - 1];

    this.size = () => _data.length;
  }
}