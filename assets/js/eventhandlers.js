// selectors

let newGameButton = document.querySelector("#newGame");
let matrix = document.querySelector("#matrix");

// functions

function newGame(game) {
	matrix.innerHTML = "<table>" + game.displayMatrix() + "</table>";

	let tds = Array.from(matrix.querySelectorAll("td"));
	tds.forEach(td => {
		td.addEventListener("click", clickOnCell.bind(td, game));
	});
}

function clickOnCell(game) {
	let dom = this;
	// create cell obj
	let cell = {};
	cell.row = Number(dom.parentElement.id.substr(3));
	cell.col = Number(dom.id.substr(3));
	cell.value = Number(game.getValue(cell.row, cell.col));

	// if bomb then place icon
	if (cell.value >= 1000) {
		dom.innerHTML = `<i class="fas fa-bomb"></i>`;
	} else {
		dom.innerText = cell.value;
	}

	// if 0, then clear empty part of minefield
	if (cell.value === 0) {
		let emptyCells = game.findConnectedEmptyCells(cell);

		emptyCells.forEach(function(cell){
			let currentCell = matrix.querySelector("#row" + cell.row).querySelector("#col" + cell.col);
			currentCell.innerText = cell.value;
			currentCell.bgColor = "yellow";		// todo change this
		});
	}
}

// events

newGameButton.addEventListener("click", function(){
	newGame(new Game("hard"));
});

