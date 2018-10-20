// selectors

const newGameButton = document.querySelector("#newGame");
const matrix = document.querySelector("#matrix");
const displayScore = document.querySelector("#score");

let game;
let startCounting;

// functions

function newGame() {
	game = new Game("hard");
	matrix.innerHTML = "<table>" + game.displayMineField(false) + "</table>";
	displayScore.innerText = game.getScore();

	let tiles = Array.from(matrix.querySelectorAll("td"));
	tiles.forEach((tile) => {
		tile.addEventListener("click", stepOnTile);
		tile.addEventListener("contextmenu", plantFlag);
	});

	// clear previous timer and start new one
	clearInterval(startCounting);
	startCounting = setInterval(countDown, 1000);
}

/**
 * finds row and column in dom and value in minefield
 * @param {object} currentTile element of current tile in minefield
 * @return {object} object with row, column, and value
 */
function getTileObject(currentTile) {
	let row = Number(currentTile.parentElement.id.substr(3));
	let col = Number(currentTile.id.substr(3));
	return {
		row: row,
		col: col,
		value: Number(game.getValue(row, col)),
	}
}

function stepOnTile() {
	let tile = getTileObject(this);
	// if bomb then place icon
	if (tile.value >= 1000) {
		this.innerHTML = `<i class="fas fa-bomb"></i>`;
		game.setScore(0);
		gameOver();
	} else if (tile.value > 0) {
		this.innerText = tile.value;
	}

	// if 0, then clear empty part of minefield
	if (tile.value === 0) {
		let emptyTiles = game.findConnectedEmptyTiles(tile);
		emptyTiles.forEach((tile, iterator) => {
			let currentTile = matrix.querySelector("#row" + tile.row).querySelector("#col" + tile.col);
			currentTile.classList.add("emptyTile");
			currentTile.removeEventListener("click", stepOnTile);
			currentTile.removeEventListener("contextmenu", plantFlag);
			// skip first iteration
			if (iterator > 0) {
				game.addToSteps()
			}
		});
	}

	// if won, game over
	if (game.addToSteps()) {
		gameOver(true);
	}

	// remove eventlisteners
	this.removeEventListener("click", stepOnTile);
	this.removeEventListener("contextmenu", plantFlag);
}

function countDown() {
	game.decrementScore();
	displayScore.innerText = game.getScore();
	if (game.getScore() < 1) {
		gameOver();
	}
}

/**
 * ends game and shows score
 * @param {boolean} winOrLose 
 */

function gameOver(winOrLose) {
	// display table again, without click events
	matrix.innerHTML = "<table>" + game.displayMineField(true) + "</table>";
	let tiles = Array.from(matrix.querySelectorAll("td"));
	tiles.forEach((tile) => {
		let value = Number(tile.innerText);
		// place icons
		if (value >= 1000) {
			tile.innerHTML = `<i class="fas fa-bomb"></i>`;
		} else if (value > 0) {
			tile.classList.add("emptyTile");
		}
	});

	// display game over
	if (winOrLose) {
		console.log("Congratulations, you won with a score of " + game.getScore());
	} else {
		console.log("%c Game Over", "color: red; font-weight: bolder; font-size: x-large");
	}
	
	// end timer
	clearInterval(startCounting);
}

function plantFlag(event) {
	event.preventDefault();
	let icon = `<i class="fas fa-flag"></i>`;
	let tile = getTileObject(this);
	this.innerHTML = (this.innerHTML !== icon) ? icon : "";
}

// events

newGameButton.addEventListener("click", newGame);
document.addEventListener("contextmenu", (event) => event.preventDefault());
