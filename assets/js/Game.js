class Game {
	constructor(difficulty) {
		if (difficulty === "easy") {
			this.minefield = this.buildMinefield(5);
			this.plantBomb(3);			
		} else if (difficulty === "hard") {
			this.minefield = this.buildMinefield(10);
			this.plantBomb(10);
		}
		this.score = 100;
	}

	buildMinefield(width) {
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

	plantBomb(numBombs) {
		let max = this.minefield.length - 1;
		let min = 0;
		for (let i = 0; i < numBombs; i++) {
			// pick random number between min and max (inclusive)
			let rngRow = Math.floor(Math.random() * (max - min + 1) + min);
			let rngColumn = Math.floor(Math.random() * (max - min + 1) + min);

			// place mine
			if (this.minefield[rngRow][rngColumn] < 1000) {
				this.minefield[rngRow][rngColumn] = 1000;

				// place markers
				if (rngRow > 0) {
					this.minefield[rngRow - 1][rngColumn]++;				// top
					if (rngColumn > 0) {
						this.minefield[rngRow - 1][rngColumn - 1]++;		// top left
					}
					if (rngColumn < max) {
						this.minefield[rngRow - 1][rngColumn + 1]++;		// top right	
					}
				}

				if (rngColumn > 0) {
					this.minefield[rngRow][rngColumn - 1]++;				// left
				}
				
				if (rngColumn < max) {
					this.minefield[rngRow][rngColumn + 1]++;				// right
				}

				if (rngRow < max) {
					this.minefield[rngRow + 1][rngColumn]++;				// bottom
					if (rngColumn > 0) {
						this.minefield[rngRow + 1][rngColumn - 1]++;		// bottom left
					}
					if (rngColumn < max) {
						this.minefield[rngRow + 1][rngColumn + 1]++;		// bottom right
					}
				}
			}
		}
	}

	displayMineField(visible) {
		let markup = "";
		for (let i = 0; i < this.minefield.length; i++) {
			markup += `<tr id="row${i}">\n`;
			for (let j = 0; j < this.minefield.length; j++) {
				markup += "<td id=col" + j + ">";
				if (visible) {
					markup += this.minefield[i][j];
				}
				markup += "</td>";
			}
			markup += "\n</tr>\n";
		}
		return markup;
	}

	getValue(row, col) {
		return this.minefield[row][col];
	}

	getMinefieldSize() {
		return this.minefield.length;
	}

	/**
	 * Get relative value in matrix including row and column index
	 * @param object value, row, column
	 * @param direction String top, bottom, left, right
	 * @return object with value, row, column
	 */

	getRelativeTileObject(currentTile, direction) {
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
		if (direction === "bottom" && row < this.minefield.length - 1) {
			relativeRow++;
		}

		// get left cell
		if (direction === "left" && col > 0) {
			relativeCol--;
		}

		// get right cell
		if (direction === "right" && col < this.minefield.length - 1) {
			relativeCol++;
		}

		// if top, bottom, left cell is same as currentTile then return false
		if (row === relativeRow && col === relativeCol) {
			return false;
		} 

		return {value: this.minefield[relativeRow][relativeCol], row: relativeRow, col: relativeCol}
	}

	findEmptyNeighbors(currentTile) {
		let emptyNeighbors = [];
		let neighborhood = [
			this.getRelativeTileObject(currentTile, "top"),
			this.getRelativeTileObject(currentTile, "bottom"),
			this.getRelativeTileObject(currentTile, "left"),
			this.getRelativeTileObject(currentTile, "right")
		]
	
		neighborhood.forEach(function(neighbor){
			if (neighbor && neighbor.value === 0) {
				emptyNeighbors.push(neighbor);
			}
		});
	
		return emptyNeighbors;
	}

	findConnectedEmptyTiles(currentTile) {
		let queue = new Queue();
		let searched = [];
		
		// add current cell to queue
		queue.add(currentTile);
	
		while (queue.size() > 0) {
			let self = this;
			// if last in queue is not already searched
			if (!self.searchDuplicates(queue.last(), searched)) {
				// add neighbors
				let neighbors = this.findEmptyNeighbors(queue.last());
				neighbors.forEach(function(neighbor){
					if (!self.searchDuplicates(neighbor, searched)) {
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

	searchDuplicates(object, arr){
		return arr.some(function(item){
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

	getScore() {
		return this.score;
	}

	setScore(score) {
		this.score = score;
	}

	decrementScore() {
		if (this.score > 0) {
			this.score--;
		}
	}
}