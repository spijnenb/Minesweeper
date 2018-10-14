// vanilla js

let newGameButton = document.querySelector("#newGame");
let matrix = document.querySelector("#matrix");

// new game

newGameButton.addEventListener("click", function(){
	let game = new Game("hard");
	matrix.innerHTML = "<table>" + game.displayMatrix() + "</table>";

	let tds = Array.from(matrix.querySelectorAll("td"));
	tds.forEach(function(td){
		td.addEventListener("click", function(){
			// get row and column
			let rowID = td.parentElement.id.substr(3);
			let columnID = td.id.substr(3);
			// get value from array
			let value = game.getValue(rowID, columnID);
			if (value >= 1000) {
				td.innerHTML = `<i class="fas fa-bomb"></i>`;
			} else {
				td.innerText = value;
			}
			// if 0, then clear empty part of minefield
			if (value == 0) {
				clearMinefield(rowID, columnID, game);
			}
			// remove click event
		});
	});
});


function clearMinefield(rowID, columnID, game) {
	let queue = new Queue();
	// get current cell
	let currentValue = game.getValue(rowID, columnID);

	// add neighbors to queue
	queue.add(game.getRelativeCellObject(rowID, columnID, "top"));
	queue.add(game.getRelativeCellObject(rowID, columnID, "bottom"));
	queue.add(game.getRelativeCellObject(rowID, columnID, "left"));
	queue.add(game.getRelativeCellObject(rowID, columnID, "right"));

	// if 0 then add to array dom elements and use recursive call
	
	
	// display dom elements


	
}