// ES6 class with implemented encapsulation using closure
class Game {
	constructor(width, bombs) {
		if (bombs > (width * width)) {
			bombs = width * width;
		}

		/**
		 * Instance vars
		 */
		let _minefield = buildMinefield(width);
		let _score = 100;
		let _maxSteps = getMaxSteps(bombs);
		let _steps = 0;

		plantBomb(bombs);		// add bombs to minefield

		/**
		 * Private methods
		 */

		function buildMinefield(width) {
			let minefield = [];
			for (let i = 0; i < width; i++) {
				let column = [];
				for (let j= 0; j < width; j++) {
					column.push(0);
				}
				minefield.push(column);
			}
			return minefield;
		}

		function getMaxSteps(numBombs) {
			return (_minefield.length * _minefield.length) - numBombs;
		}

		function plantBomb(numBombs) {
			let max = _minefield.length - 1;
			let min = 0;
			for (let i = 0; i < numBombs; i++) {
				// pick random number between min and max (inclusive)
				let rngRow = Math.floor(Math.random() * (max - min + 1) + min);
				let rngColumn = Math.floor(Math.random() * (max - min + 1) + min);
	
				// place mine
				if (_minefield[rngRow][rngColumn] < 1000) {
					_minefield[rngRow][rngColumn] = 1000;
	
					// place markers
					if (rngRow > min) {
						_minefield[rngRow - 1][rngColumn]++;					// top
						if (rngColumn > min)
							_minefield[rngRow - 1][rngColumn - 1]++;			// top left
						if (rngColumn < max)
							_minefield[rngRow - 1][rngColumn + 1]++;			// top right	
					}
	
					if (rngColumn > min)
						_minefield[rngRow][rngColumn - 1]++;					// left
					
					if (rngColumn < max)
						_minefield[rngRow][rngColumn + 1]++;					// right
	
					if (rngRow < max) {
						_minefield[rngRow + 1][rngColumn]++;					// bottom
						if (rngColumn > 0)
							_minefield[rngRow + 1][rngColumn - 1]++;			// bottom left
						if (rngColumn < max)
							_minefield[rngRow + 1][rngColumn + 1]++;			// bottom right
					}
				} else {
					// plant another bomb
					plantBomb(1);
				}
			}
		}


		/**
		 * Get value of neighboring cell in grid including row and column index
		 * @param {object} currentTile current cell with row, column and value
		 * @param {string} direction top, bottom, left, or right
		 * @return object of neighboring cell with row, column, and value
		 */
		function getRelativeTileObject(currentTile, direction) {
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
			if (direction === "bottom" && row < _minefield.length - 1) {
				relativeRow++;
			}

			// get left cell
			if (direction === "left" && col > 0) {
				relativeCol--;
			}

			// get right cell
			if (direction === "right" && col < _minefield.length - 1) {
				relativeCol++;
			}

			// if top, bottom, left cell is same as currentTile then return false
			if (row === relativeRow && col === relativeCol) {
				return false;
			} 

			return {value: _minefield[relativeRow][relativeCol], row: relativeRow, col: relativeCol}
		}

		function findEmptyNeighbors(currentTile) {
			let emptyNeighbors = [];
			let neighborhood = [
				getRelativeTileObject(currentTile, "top"),
				getRelativeTileObject(currentTile, "bottom"),
				getRelativeTileObject(currentTile, "left"),
				getRelativeTileObject(currentTile, "right")
			]
		
			neighborhood.forEach((neighbor) => {
				if (neighbor && neighbor.value === 0) {
					emptyNeighbors.push(neighbor);
				}
			});
		
			return emptyNeighbors;
		}

		function searchDuplicates(object, arr){
			return arr.some((item) => {
				let isEqual = true;
				// compare every key value pair
				Object.keys(object).forEach(function(key){
					if (item[key] !== object[key]) {
						isEqual = false;
					}
				});
				return isEqual;
			});
		}

		/**
		 * Public methods
		 */

		this.displayMineField = (visible) => {
			let markup = "";
			for (let i = 0; i < _minefield.length; i++) {
				markup += `<tr id="row${i}">\n`;
				for (let j = 0; j < _minefield.length; j++) {
					markup += "<td id=col" + j + ">";
					if (visible) markup += _minefield[i][j];
					markup += "</td>";
				}
				markup += "\n</tr>\n";
			}
			return markup;
		}

		this.addToSteps = () => {
			_steps++;
			if (_steps >= _maxSteps) {
				return true;
			}
			return false;
		}

		this.getValue = (row, col) => _minefield[row][col];

		this.getMinefieldSize = () => _minefield.length;

		// Breadth first search
		this.findConnectedEmptyTiles = (currentTile) => {
			let queue = new Queue();
			let searched = [];
			
			// add current cell to queue
			queue.add(currentTile);
		
			while (queue.size() > 0) {
				// if last in queue is not already searched
				if (!searchDuplicates(queue.last(), searched)) {
					// add neighbors
					let neighbors = findEmptyNeighbors(queue.last());
					neighbors.forEach(function(neighbor){
						if (!searchDuplicates(neighbor, searched)) {
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
		}

		this.getScore = () => _score;

		this.setScore = (score) => _score = score;

		this.decrementScore = () => {
			if (_score > 0) {
				_score--;
			}
		}
	}
}