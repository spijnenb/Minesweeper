// vanilla js

let newGameButton = document.querySelector("#newGame");
let matrix = document.querySelector("#matrix");

// new game

newGameButton.addEventListener("click", function(){
	let game = new Game("hard");
	matrix.innerHTML = "<table>" + game.displayMatrix() + "</table>";

	let tds = Array.from(matrix.querySelectorAll("td"));
	tds.forEach(function(td){
		td.addEventListener("click", function(){		// todo make separate function
			// create cell obj
			let cell = {};
			cell.row = Number(td.parentElement.id.substr(3));
			cell.col = Number(td.id.substr(3));
			cell.value = Number(game.getValue(cell.row, cell.col));

			// if bomb then place icon
			if (cell.value >= 1000) {
				td.innerHTML = `<i class="fas fa-bomb"></i>`;
			} else {
				td.innerText = cell.value;
			}

			// if 0, then clear empty part of minefield
			if (cell.value === 0) {
				let emptyCells = findConnectedEmptyCells(cell, game);

				emptyCells.forEach(function(cell){
					let currentCell = matrix.querySelector("#row" + cell.row).querySelector("#col" + cell.col);
					currentCell.innerText = cell.value;
					currentCell.bgColor = "yellow";		// todo change this
				});
			}
			// remove click event
		});
	});
});

function findConnectedEmptyCells(currentCell, game) {
	let queue = new Queue();
	let searched = [];
	
	// add current cell to queue
	queue.add(currentCell);

	while (queue.size() > 0) {
		// if first in queue is not already searched
		if (!searchDuplicates(queue.last(), searched)) {
			// add neighbors
			let neighbors = game.findEmptyNeighbors(queue.last());
			neighbors.forEach(function(neighbor){
				if (!searchDuplicates(neighbor, searched)) {
					queue.add(neighbor);
				}
			});
			// add first in queue to searched
			searched.push(queue.last());
		}
		// remove from queue
		queue.remove();
	}

	return Array.from(searched);
}

function searchDuplicates(object, arr){
	return arr.some(function(item){
		let isEqual = true;
		// compare every key value pair
		Object.keys(object).forEach(function(key){
			if (item[key] !== object[key]) {
				isEqual = false;
			}
		})
		return isEqual;
	})
}