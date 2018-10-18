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
	tiles.forEach(function(tile){
		tile.addEventListener("click", stepOnTile);
		tile.addEventListener("contextmenu", plantFlag);
	});

	// clear previous timer and start new one
	clearInterval(startCounting);
	startCounting = setInterval(countDown, 1000);
	
}

function stepOnTile() {
	// create tile obj
	let tile = {};
	tile.row = Number(this.parentElement.id.substr(3));
	tile.col = Number(this.id.substr(3));
	tile.value = Number(game.getValue(tile.row, tile.col));

	// if bomb then place icon
	if (tile.value >= 1000) {
		this.innerHTML = `<i class="fas fa-bomb"></i>`;
		game.setScore(0);
		gameOver();
	} else {
		this.innerText = tile.value;
	}

	// if 0, then clear empty part of minefield
	if (tile.value === 0) {
		let emptyTiles = game.findConnectedEmptyTiles(tile);
		emptyTiles.forEach(function(tile){
			let currentTile = matrix.querySelector("#row" + tile.row).querySelector("#col" + tile.col);
			currentTile.innerText = tile.value;
			currentTile.bgColor = "yellow";		// todo change this
			currentTile.removeEventListener("click", stepOnTile);
		});
	}

	// remove eventlistener
	this.removeEventListener("click", stepOnTile);
}

function countDown() {
	// runs every second
	game.decrementScore();
	// update score
	displayScore.innerText = game.getScore();
	
	if (game.getScore() < 1) {
		gameOver();
	}
}

function gameOver() {
	// remove click events
	// let tiles = matrix.querySelectorAll("td");
	// tiles.forEach((tile) => tile.removeEventListener("click", stepOnTile, false));
	// show all and removes click events
	matrix.innerHTML = "<table>" + game.displayMineField(true) + "</table>";
	// display game over
	alert("Game Over! You're score is " + game.getScore());
	// end timer
	clearInterval(startCounting);
}

function plantFlag(event) {
	event.preventDefault();
	this.innerHTML = `<i class="fas fa-flag"></i>`;
}

// events

newGameButton.addEventListener("click", newGame);


