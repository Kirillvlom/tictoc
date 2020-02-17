window.onload = function () {
	const setting = {
		field: 9,
		score: {
			user: 0,
			computer: 0
		},
		startGame: null,
		raund: 1,
		maxRaund: 10,
		selectGame: {
			user: "x",
			computer: "o"
		},
		walk: null,
		victoryOption: [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 4, 8],
			[2, 4, 6],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8]
		],
		select: [
			0, 0, 0,
			0, 0, 0,
			0, 0, 0
		],
		selects: 0,
		gameOver: [{
				left: "0",
				top: "110px",
				transform: ""
			},
			{
				left: "0",
				top: "245px",
				transform: ""
			},
			{
				left: "0",
				top: "377px",
				transform: ""
			},
			{
				left: "0",
				top: "245px",
				transform: "rotate(45deg)"
			},
			{
				left: "0",
				top: "245px",
				transform: "rotate(-45deg)"
			},
			{
				left: "-135",
				top: "245px",
				transform: "rotate(90deg)"
			},
			{
				left: "0",
				top: "245px",
				transform: "rotate(90deg)"
			},
			{
				left: "135px",
				top: "245px",
				transform: "rotate(90deg)"
			}
		]
	};
	document.getElementById("max-raund").innerHTML = setting.maxRaund;
	//Очистка результатов
	document.getElementById("result-clear").onclick = function () {
		localStorage.removeItem("result");
		document.getElementsByClassName("result-content")[0].innerHTML = " ";
		this.style.opacity = 0;
	}
	//Смена темы
	document.getElementById("switcher-2").onclick = function () {
		if (localStorage.getItem("mode") == "Light") {
			document.getElementsByTagName("body")[0].classList.remove("Light");
			document.getElementsByTagName('meta')["theme-color"].content = "#33304b";
			localStorage.setItem("mode", "Dark");
		} else if (localStorage.getItem("mode") == "Dark") {
			document.getElementsByTagName("body")[0].classList.add("Light");
			document.getElementsByTagName('meta')["theme-color"].content = "#edeef0";
			localStorage.setItem("mode", "Light");
		}
	}
	//Предупреждение перевернуть экран
	const mobileDevice = () => {
		return true;
	}
	//отображение клеток
	const renderСells = () => {
		let game_field = document.getElementById('game-field');
		game_field.innerHTML = " ";
		for (let e = 0; e < setting.field; e++) {
			game_field.innerHTML += '<div class="field-block" id="field-block-' + e + '" data-position="' + e + '" data-pick="-"> </div> ';
		}
	}

	//Перехвачиваем клики по клеткам
	const clickField = () => {
		for (let i = 0; i < setting.field; i++) {
			let fieldBlock = document.getElementsByClassName('field-block');
			fieldBlock[i].addEventListener("click", function () {
				if (setting.startGame) {
					check_game(this);
				} else {
					document.getElementsByClassName("alert-select")[0].style.opacity = "1";
				}
			})
		}
	}

	//Выбор за кого играть
	let userSelection = document.getElementsByClassName('select-user');
	for (let i = 0; i < userSelection.length; i++) {
		userSelection[i].addEventListener("click", function () {
			if (!setting.startGame) {
				let value = this.dataset.select;
				if (value != setting.selectGame) {
					document.getElementById("select-user-" + setting.selectGame.user).classList.remove("select");
					document.getElementById("select-user-" + value).classList.add("select");
					switch (value) {
						case "x":
							setting.selectGame.computer = "o";
							break;
						case "o":
							setting.selectGame.computer = "x";
							break;
						default:
							break;
					}
					document.getElementsByClassName("alert-select")[0].style.opacity = "0";
					setting.selectGame.user = value;
					setting.startGame = 1;
					if (setting.selectGame.user == "o") {
						randsComputer();
					}
				}
			}
		})
	}

	//Рандомное место для компа
	const randsComputer = () => {
		if (setting.selects != 9 && setting.raund != setting.maxRaund + 1) {
			setting.selects++;
			let computerIndex = [];
			let s = 0;
			for (let index = 0; index < setting.select.length; index++) {
				if (setting.select[index] == 0) {
					computerIndex[s] = index;
					s++;
				}
			}
			if (computerIndex.length != 0) {
				setting.walk = "computer";
				let randInt = computerIndex[Math.floor(Math.random() * computerIndex.length)];
				console.log(computerIndex);
				console.log(setting.victoryOption);
				for (let index = 0; index < setting.victoryOption.length; index++) {
					for (let e = 0; e < setting.victoryOption[index].length; e++) {
						if (setting.victoryOption[index] == randInt) {
							return randInt
						}
					}
				}
				document.getElementById("field-block-" + randInt).innerHTML = "<div class='" + setting.selectGame.computer + "'>";
				setting.select[randInt] = setting.selectGame.computer;
			}
		}
	}
	//Проверка на победу, 3 элемента подряд 
	const victoryOption = () => {
		for (let index = 0; index < setting.victoryOption.length; index++) {
			if (((setting.select[setting.victoryOption[index][0]] == "x") &&
					(setting.select[setting.victoryOption[index][1]] == "x") &&
					(setting.select[setting.victoryOption[index][2]] == "x")) ||
				((setting.select[setting.victoryOption[index][0]] == "o") &&
					(setting.select[setting.victoryOption[index][1]] == "o") &&
					(setting.select[setting.victoryOption[index][2]] == "o"))) {
				document.getElementsByClassName("block-game-over")[0].style.display = "block";
				setTimeout(function () {
					document.getElementById("game-over").style.opacity = "1";
				}, 10);
				document.getElementById("game-over").style.width = "100%";
				document.getElementById("game-over").style.left = setting.gameOver[index].left;
				document.getElementById("game-over").style.top = setting.gameOver[index].top;
				document.getElementById("game-over").style.transform = setting.gameOver[index].transform;
				setting.win = 1;
				return true;
			}
		}
	}
	//Проверка на выйгрыш
	const checkDraw = () => {
		if (setting.selects == 9 && setting.raund == setting.maxRaund) {
			document.getElementById("select-user-" + setting.selectGame.user).classList.remove("select");
			document.getElementsByClassName("block-game-over")[0].style.display = "block";
			document.getElementById("dead-heat").style.display = "flex";
			setTimeout(function () {
				document.getElementById("dead-heat").style.opacity = "1";
			}, 10);
			updateScore();
			setTimeout(function () {
				document.getElementById("dead-heat").style.display = "none";
				document.getElementById("dead-heat").style.opacity = "0";
			}, 1300);
		} else if (setting.selects == 9 && setting.raund < setting.maxRaund) {
			document.getElementsByClassName("block-game-over")[0].style.display = "block";
			document.getElementById("dead-heat").style.display = "flex";
			setTimeout(function () {
				document.getElementById("dead-heat").style.opacity = "1";
			}, 10);
			updateScore();
			setTimeout(function () {
				document.getElementById("dead-heat").style.display = "none";
				document.getElementById("dead-heat").style.opacity = "0";
			}, 1300);
		}
	}

	// Ставим отметки
	const check_game = (div) => {
		let postion = div.dataset.position;
		if (setting.selects != 9 && setting.raund != setting.maxRaund + 1) {
			if (setting.select[postion] == 0) {
				setting.select[postion] = setting.selectGame.user;
				div.innerHTML = "<div class='" + setting.selectGame.user + "'>";
				setting.selects++;
				setting.walk = "user";
				if (victoryOption()) {
					updateScore();
					return false;
				}
				if (setting.selects != 9 && setting.raund != setting.maxRaund + 1) {
					randsComputer();
					if (victoryOption()) {
						updateScore();
						return false;
					} else {
						checkDraw();
					}
				} else {
					checkDraw();
				}
			}
		}
	}
	//обновление счета
	const updateScore = () => {
		if (setting.raund < setting.maxRaund) {
			if (setting.win == 1) {
				setting.score[setting.walk] += 1;
				setting.win = 0;
			}
			setting.raund += 1;
			document.getElementById("score-" + setting.walk).innerHTML = setting.score[setting.walk];
			document.getElementById("raund").innerHTML = setting.raund;
			clearField();
		} else {
			if (setting.win == 1) {
				setting.score[setting.walk] += 1;
				setting.win = 0;
			}
			setting.raund = 1;
			setting.startGame = 0;
			document.getElementById("select-user-" + setting.selectGame.user).classList.remove("select");
			document.getElementById("score-user").innerHTML = "0";
			document.getElementById("score-computer").innerHTML = "0";
			document.getElementById("raund").innerHTML = setting.raund;
			saveResult();
			renderResult("add");
			clearField();
			setting.score.user = 0;
			setting.score.computer = 0;
		}
	}

	//Сохранение результата
	const saveResult = () => {
		if (!localStorage.getItem("result")) {
			localStorage.setItem("result", JSON.stringify([{
				serial: 1,
				user: setting.score.user,
				computer: setting.score.computer
			}]))
		} else {
			let array = JSON.parse(localStorage.getItem("result"));
			array.push({
				serial: array.length + 1,
				user: setting.score.user,
				computer: setting.score.computer
			});
			localStorage.setItem("result", JSON.stringify(array));
		}
		document.getElementById("result-clear").style.opacity = 1;
	}

	//Отображение результата
	const renderResult = (add) => {
		let result = document.getElementsByClassName("result-content")[0];
		let array = JSON.parse(localStorage.getItem("result"));
		if (array) {
			if (add) {
				result.innerHTML += "<div class='result-row'>\
				<div class='player-serial'>" + array[array.length - 1].serial + "</div>\
				<div class='player-user'>" + array[array.length - 1].user + "</div>\
				<div class='player-computer'>" + array[array.length - 1].computer + "</div>\
			</div>"
			} else {
				for (let e = 0; e < array.length; e++) {
					result.innerHTML += "<div class='result-row'>\
					<div class='player-serial'>" + array[e].serial + "</div>\
					<div class='player-user'>" + array[e].user + "</div>\
					<div class='player-computer'>" + array[e].computer + "</div>\
				</div>"
				}
			}
			document.getElementById("result-clear").style.opacity = 1;
		}
		document.getElementsByClassName('result-content')[0].scrollTop = document.getElementsByClassName('result-content')[0].scrollHeight;
	}
	//Очистка поля
	const clearField = () => {
		setTimeout(function () {
			for (let index = 0; index < setting.field; index++) {
				document.getElementById("field-block-" + index).innerHTML = " ";
			}
			document.getElementsByClassName("block-game-over")[0].style.display = "none";
			document.getElementById("game-over").style.opacity = "0";
			document.getElementById("game-over").style.width = "0";
			document.getElementById("game-over").style.left = "0";
			document.getElementById("game-over").style.top = "0";
			document.getElementById("game-over").style.transform = "0";
			setting.select = [
				0, 0, 0,
				0, 0, 0,
				0, 0, 0
			];
			setting.selects = 0;
		}, 1200);
		setTimeout(function () {
			if (setting.walk == "computer" && setting.startGame == 1) {
				randsComputer();
			}
		}, 1300)
	}

	//Очистка игры
	document.getElementById("reboot").onclick = () => {
		document.location.reload();
	}

	//Запуск игры
	const start = () => {
		if (!localStorage.getItem("mode")) {
			localStorage.setItem("mode", "Light");
		}
		if (localStorage.getItem("mode") == "Light") {
			document.getElementsByTagName("body")[0].classList.add("Light");
			document.getElementById("switcher-2").checked = true;
			document.getElementsByTagName('meta')["theme-color"].content = "#edeef0";
		}
		renderСells();
		clickField();
		renderResult();
	}
	start();
};