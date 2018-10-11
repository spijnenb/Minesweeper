class Game {
	constructor(difficulty) {
		this.mineField = buildMineField(5);
	}

	buildMineField(width) {
		let mineField = [];
		for (i = 0; i < width; i++) {
			let column = [];
			for (j= 0; j < width; j++) {
				column.push(0);
			}
			mineField.push(column);
		}
		return mineField;
	}

	plantBomb() {
		let max = this.mineField.length - 1;
		let min = 0;

		// pick random number between min and max (inclusive)
		let rngRow = Math.floor(Math.random() * (max - min + 1) + min);
		let rngColumn = Math.floor(Math.random() * (max - min + 1) + min);

		console.log(this.mineField, rngRow, rngColumn);
		// place mine
		if (this.mineField[rngRow][rngColumn] < 1000) {
			this.mineField[rngRow][rngColumn] = 1000;

			// place markers
			if (rngRow > 0) {
				this.mineField[rngRow - 1][rngColumn]++;				// top
				if (rngColumn > 0) {
					this.mineField[rngRow - 1][rngColumn - 1]++;		// top left
				}
				if (rngColumn < max) {
					this.mineField[rngRow - 1][rngColumn + 1]++;		// top right	
				}
			}

			if (rngColumn > 0) {
				this.mineField[rngRow][rngColumn - 1]++;				// left
			}
			
			if (rngColumn < max) {
				this.mineField[rngRow][rngColumn + 1]++;				// right
			}

			if (rngRow < max) {
				this.mineField[rngRow + 1][rngColumn]++;				// bottom
				if (rngColumn > 0) {
					this.mineField[rngRow + 1][rngColumn - 1]++;		// bottom left
				}
				if (rngColumn < max) {
					this.mineField[rngRow + 1][rngColumn + 1]++;		// bottom right
				}
				
				
			}
		}
	}
}
var g = new Game();
g.plantBomb();
g.plantBomb();
console.log(g.mineField);
