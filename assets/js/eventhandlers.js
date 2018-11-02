// IIFE to keep global scope empty

(function(window, document){

	// selectors

	const newGameButton = document.querySelector("#newGame");
	const grid = document.querySelector("#grid");
	const displayScore = document.querySelector("#score");
	const settingsButton = document.querySelector("#settingsButton");
	const displayDifficulty = document.querySelector("#difficulty");
	const changeDifficultyButtons = document.querySelectorAll(".change-difficulty");
	const darkModeButton = document.querySelector("#darkmode");
	const settingsPanel = document.querySelector("#settingsPanel");

	let game;
	let gameModes = ["easy", "medium", "hard"];
	let difficulty = 1;		// default
	let startCounting;

	// functions

	function newGame() {
		let width, numBombs;
		let currentDifficulty = gameModes[difficulty];
		switch (currentDifficulty) {
			case "easy":
				width = 5;
				numBombs = 3;
				break;
			case "medium":
				width = 10;
				numBombs = 10;
				break;
			case "hard":
				width = 10;
				numBombs = 20;
				break;
		}
		game = new Game(width, numBombs);
		grid.innerHTML = `<table>${game.displayMineField(false)}</table>`;
		displayScore.innerText = game.getScore();
		replaceClass(grid, "hidden", "visible");	// fade in effect

		let tiles = Array.from(grid.querySelectorAll("td"));
		tiles.forEach((tile) => {
			tile.addEventListener("click", stepOnTile);
			tile.addEventListener("contextmenu", plantFlag);
		});

		// clear game over message
		removeMessage();

		// make settingspanel visible and slideUp
		if (settingsPanel.classList.contains("hidden")) {
			settingsPanel.classList.remove("hidden");
		}
		if (settingsPanel.classList.contains("slideDown")) {
			toggleSettingsPanel();
		} else {
			settingsPanel.classList.add("slideUp");
		}
		
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
		// if bomb, game over.
		if (tile.value >= 1000) {
			game.setScore(0);
			gameOver(false);
			return;
		} 

		if (tile.value > 0) {
			this.innerText = tile.value;
		}

		// if 0, then clear empty part of minefield
		if (tile.value === 0) {
			let emptyTiles = game.findConnectedEmptyTiles(tile);
			emptyTiles.forEach((tile, iterator) => {
				let currentTile = grid.querySelector("#row" + tile.row).querySelector("#col" + tile.col);
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
		grid.innerHTML = "<table>" + game.displayMineField(true) + "</table>";
		let tiles = Array.from(grid.querySelectorAll("td"));
		tiles.forEach((tile) => {
			let value = Number(tile.innerText);
			// place icons
			if (value >= 1000) {
				tile.innerHTML = `<i class="fas fa-bomb"></i>`;
			} else if (value === 0) {
				tile.innerText = "";
				tile.classList.add("emptyTile");
			}
		});

		// display game over
		showMessage(winOrLose);
		
		// end timer
		clearInterval(startCounting);
	}

	function plantFlag(event) {
		event.preventDefault();
		let icon = `<i class="fas fa-flag"></i>`;
		let tile = getTileObject(this);
		this.innerHTML = (this.innerHTML !== icon) ? icon : "";
	}

	function removeMessage() {
		let displayMessage = document.querySelector("#message");
		if (!displayMessage) return;
		replaceClass(displayMessage, "slideDown", "slideUp");
		// remove dom element after transition ends
		displayMessage.addEventListener("transitionend", () => displayMessage.remove());
	}

	function showMessage(winOrLose) {
		// create game window
		let msg = document.createElement("div");
		// set content
		let msgText = {};
		let score = (game instanceof Game) ? game.getScore() : 0;
		if (winOrLose) {
			msgText.title = "Victory!";
			msgText.body = "Good job. Your score is " + score;
		} else {
			msgText.title = "Game Over";
			msgText.body = "Better luck next time!"
			displayScore.innerText = 0;
		}
		// set attributes
		msg.id = "message";
		msg.classList.add("slideUp");
		msg.innerHTML = `<p class="large">${msgText.title}</p>\n<p>${msgText.body}</p>`;
		// insert element into dom
		document.querySelector("body").insertBefore(msg, grid);
		// slide down after 0.2s animation
		setTimeout(() => replaceClass(msg, "slideUp", "slideDown"), 200);
	}

	function toggleSettingsPanel() {
		// if game hasn't started, use fade animation
		let state1, state2;
		if (!game) {
			settingsPanel.classList.remove("slideUp");
		}
		if (!game) {
			state1 = "hidden";
			state2 = "visible";
		} else {
			state1 = "slideUp";
			state2 = "slideDown";
		}	
		if (settingsPanel.classList.contains(state1)) {
			replaceClass(settingsPanel, state1, state2);
		} else {
			replaceClass(settingsPanel, state2, state1);
		}
	}

	function changeDifficulty() {
		if (this.innerText === '<') {			// lower difficulty
			// get and change diff
			if (difficulty > 0) difficulty--;
		} else if (this.innerText === '>') {	// raise difficulty
			// get and change diff
			if (difficulty < gameModes.length - 1) difficulty++;
		}
		// set diff
		displayDifficulty.innerText = gameModes[difficulty];
	}

	function toggleDarkMode() {
		let stylesheet =  "assets/css/darkmode.css";
		if (this.checked) {
			// append stylesheet
			let link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.type = "text/css";
			link.href = stylesheet;
			document.head.appendChild(link);
		} else {
			// find darkmode stylesheet and remove
			let result = document.head.querySelectorAll(`link[href="${stylesheet}"]`);
			result[0].remove();
		}
	}

	/**
	 * Custom function to replace classList.replace(). Improves browser support for Edge//Safari
	 * @param {object} element
	 * @param {string} oldClass
	 * @param {string} newClass 
	 */
	function replaceClass(element, oldClass, newClass) {
		element.classList.remove(oldClass);
		element.classList.add(newClass);
	}

	// events

	document.addEventListener("contextmenu", (event) => event.preventDefault());
	newGameButton.addEventListener("click", newGame);
	settingsButton.addEventListener("click", toggleSettingsPanel);
	changeDifficultyButtons.forEach((button) => button.addEventListener("click", changeDifficulty));
	darkModeButton.addEventListener("click", toggleDarkMode);


})(window, document);

