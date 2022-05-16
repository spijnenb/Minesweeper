// ES6 class with implemented encapsulation using closure
class Game {
  #minefield = {};
  #score = 0;
  #maxSteps = 0;
  #steps = 0;

  constructor(width, bombs) {
    if (bombs > width * width) {
      bombs = width * width;
    }
    this.#minefield = this.#buildMinefield(width);
    this.#maxSteps = this.#minefield.length * this.#minefield.length - bombs;
    this.#plantBomb(bombs); // add bombs to minefield
  }

  // Private methods

  #buildMinefield = (width) => {
    let minefield = [];
    for (let i = 0; i < width; i++) {
      let column = [];
      for (let j = 0; j < width; j++) {
        column.push(0);
      }
      minefield.push(column);
    }
    return minefield;
  };

  #plantBomb = (numBombs) => {
    let max = this.#minefield.length - 1;
    let min = 0;
    for (let i = 0; i < numBombs; i++) {
      // pick random number between min and max (inclusive)
      let rngRow = Math.floor(Math.random() * (max - min + 1) + min);
      let rngColumn = Math.floor(Math.random() * (max - min + 1) + min);

      // place mine
      if (this.#minefield[rngRow][rngColumn] < 1000) {
        this.#minefield[rngRow][rngColumn] = 1000;

        // place markers
        if (rngRow > min) {
          this.#minefield[rngRow - 1][rngColumn]++; // top
          if (rngColumn > min) this.#minefield[rngRow - 1][rngColumn - 1]++; // top left
          if (rngColumn < max) this.#minefield[rngRow - 1][rngColumn + 1]++; // top right
        }

        if (rngColumn > min) this.#minefield[rngRow][rngColumn - 1]++; // left

        if (rngColumn < max) this.#minefield[rngRow][rngColumn + 1]++; // right

        if (rngRow < max) {
          this.#minefield[rngRow + 1][rngColumn]++; // bottom
          if (rngColumn > 0) this.#minefield[rngRow + 1][rngColumn - 1]++; // bottom left
          if (rngColumn < max) this.#minefield[rngRow + 1][rngColumn + 1]++; // bottom right
        }
      } else {
        // plant another bomb
        this.#plantBomb(1);
      }
    }
  };

  /**
   * Get value of neighboring cell in grid including row and column index
   * @param {object} currentTile current cell with row, column and value
   * @param {string} direction top, bottom, left, or right
   * @return object of neighboring cell with row, column, and value
   */
  #getRelativeTileObject = (currentTile, direction) => {
    direction = direction.toLowerCase();
    let row = currentTile.row;
    let col = currentTile.col;
    let relativeRow = row;
    let relativeCol = col;

    // get top cell
    if (direction === "top" && row > 0) {
      relativeRow--;
    }

    // get bottom cell
    if (direction === "bottom" && row < this.#minefield.length - 1) {
      relativeRow++;
    }

    // get left cell
    if (direction === "left" && col > 0) {
      relativeCol--;
    }

    // get right cell
    if (direction === "right" && col < this.#minefield.length - 1) {
      relativeCol++;
    }

    // if top, bottom, left cell is same as currentTile then return false
    if (row === relativeRow && col === relativeCol) {
      return false;
    }

    return { value: this.#minefield[relativeRow][relativeCol], row: relativeRow, col: relativeCol };
  };

  #findEmptyNeighbors = (currentTile) => {
    let emptyNeighbors = [];
    let neighborhood = [
      this.#getRelativeTileObject(currentTile, "top"),
      this.#getRelativeTileObject(currentTile, "bottom"),
      this.#getRelativeTileObject(currentTile, "left"),
      this.#getRelativeTileObject(currentTile, "right"),
    ];

    neighborhood.forEach((neighbor) => {
      if (neighbor && neighbor.value === 0) {
        emptyNeighbors.push(neighbor);
      }
    });

    return emptyNeighbors;
  };

  #searchDuplicates = (object, arr) => {
    return arr.some((item) => {
      let isEqual = true;
      // compare every key value pair
      Object.keys(object).forEach(function (key) {
        if (item[key] !== object[key]) {
          isEqual = false;
        }
      });
      return isEqual;
    });
  };

   // Public methods

  displayMineField = (visible) => {
    let markup = "";
    for (let i = 0; i < this.#minefield.length; i++) {
      markup += `<tr id="row${i}">\n`;
      for (let j = 0; j < this.#minefield.length; j++) {
        markup += "<td id=col" + j + ">";
        if (visible) markup += this.#minefield[i][j];
        markup += "</td>";
      }
      markup += "\n</tr>\n";
    }
    return markup;
  };

  addToSteps = () => {
    this.#steps++;
    if (this.#steps >= this.#maxSteps) {
      return true;
    }
    return false;
  };

  getValue = (row, col) => this.#minefield[row][col];

  getMinefieldSize = () => this.#minefield.length;

  // Breadth first search
  findConnectedEmptyTiles = (currentTile) => {
    let queue = new Queue();
    let searched = [];

    // add current cell to queue
    queue.add(currentTile);

    while (queue.size() > 0) {
      // if last in queue is not already searched
      if (!this.#searchDuplicates(queue.last(), searched)) {
        // add neighbors
        let neighbors = this.#findEmptyNeighbors(queue.last());
        neighbors.forEach((neighbor) => {
          if (!this.#searchDuplicates(neighbor, searched)) {
            queue.add(neighbor);
          }
        });
        // add last in queue to searched
        searched.push(queue.last());
      }
      // remove from queue
      queue.remove();
    }
    return searched;
  };

  getScore = () => this.#score;

  setScore = (score) => (this.#score = score);

  decrementScore = () => {
    if (this.#score > 0) {
      this.#score--;
    }
  };
  incrementScore = () => this.#score++;
}
