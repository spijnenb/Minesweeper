// selectors

const newGameButton = document.querySelector("#newGame");
const matrix = document.querySelector("#matrix");
const displayScore = document.querySelector("#score");

let game;

// functions

function newGame() {
	game = new Game("hard");
	matrix.innerHTML = "<table>" + game.displayMineField(false) + "</table>";

	let tiles = Array.from(matrix.querySelectorAll("td"));
	tiles.forEach(function(tile){
		tile.addEventListener("click", stepOnTile);
	});
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
		game.gameOver = true;
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
		});
	}
}

function countDown() {
	// let score = game.getScore();
	
	if (score <= 0) {
		gameOver();
	}
}

function gameOver() {
	alert("you lose!");
}

// events

newGameButton.addEventListener("click", newGame);
score.setInterval(countDown, 1000);

