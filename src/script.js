const infoPlace = document.getElementById("info-place");
const errorPlace = document.getElementById("error-place");
const arrNumBtn = document.querySelectorAll(".num-btn");

const clearBtn = document.getElementById("clear-btn");
const delBtn = document.getElementById("del-btn");
const percentBtn = document.getElementById("percent-btn");
const divisionBtn = document.getElementById("division-btn");
const multBtn = document.getElementById("mult-btn");
const minusBtn = document.getElementById("minus-btn");
const plusBtn = document.getElementById("plus-btn");
const equalBtn = document.getElementById("equal-btn");

const allCom = ["÷", "×", "-", "+"];

const signComs = [
	{ "el": divisionBtn, "sign": allCom[0] },
	{ "el": multBtn, "sign": allCom[1] },
	{ "el": minusBtn, "sign": allCom[2] },
	{ "el": plusBtn, "sign": allCom[3] },
]

function updateInfo(text) { infoPlace.value = text; }
function addChar(ch) { infoPlace.value += ch; }
function getInfo() { return infoPlace.value; }
function errorClear() { errorPlace.textContent = ""; }
function sendError(text, out) {
	errorPlace.textContent = text;
	return out;
}
function delLastChar() {
	errorClear();
	if (getInfo().length !== 1) {
		updateInfo(getInfo().slice(0, -1));
	} else {
		updateInfo("0");
	}
}
function isLastCom() {
	return allCom.includes(getInfo().slice(-1));
}
function hasSymbCom() {
	for(i = 0; i < getInfo().length; i++) {
		if (allCom.includes(getInfo()[i])) return true;
	}
	return false;
}
function hasSymb(isArr = false, ch) {
	if (isArr) {
		const arrInfo = getArrInfo();
		if (arrInfo[0].includes(ch)) return true;
		if (arrInfo[1].includes(ch)) return true;
	} else {
		for(const el of getInfo()) {
			if (ch === el) {
				return true;
			}
		}
	}
}
function isFirstMinus() {
	return getInfo()[0] === "-";
}
function getArrInfo() {
	const info = getInfo();

	for (i = 0; i < info.length; i++) {
		if (allCom.includes(info[i])) {
			return info.split(info[i]);
		}
	}
}
function getResult() {
	const info = getInfo();

	for (i = 0; i < info.length; i++) {
		if (allCom.includes(info[i]))
		{
			const arrInfo = getArrInfo();
			const num1 = Number(arrInfo[0]), num2 = Number(arrInfo[1]);

			if (info[i] === "÷") {
				if (num2 !== 0) {
					return Number((num1 / num2).toFixed(10));
				} else {
					return sendError("Відбулось ділення на нуль", 0);
				}
			} else if (info[i] === "×") {
				return Number((num1 * num2).toFixed(10));
			} else if (info[i] === "-") {
				return num1 - num2;
			} else if (info[i] === "+") {
				return num1 + num2;
			}
		}
	};
	return sendError("Застосуйте математичні дії", info);
}

infoPlace.addEventListener("keydown", (event) => {
	const allNums = "1234567890"

	if (!allNums.includes(event.key)) {
		event.preventDefault();
	} else {
		if (getInfo() === "0") updateInfo("");
		addChar(event.key);
		event.preventDefault();
	}

	if (event.key === "Backspace") {
		delLastChar();
	} else if (event.key === "/" && !hasSymbCom()) {
		addChar("÷");
	} else if (event.key === "*" && !hasSymbCom()) {
		addChar("×");
	} else if (event.key === "-" && !hasSymbCom()) {
		if (getInfo() !== "0") addChar("-");
	} else if (event.key === "+" && !hasSymbCom()) {
		addChar("+");
	} else if (event.key === "." && hasSymb(".")) {
		if (hasSymbCom()) delLastChar();
		addChar(".");
	} else if (event.key === "Enter" || event.key === "=") {
		updateInfo(getResult());
	}
});

clearBtn.addEventListener("click", () => {
	errorClear();
	updateInfo("0");
});
delBtn.addEventListener("click", () => delLastChar());

percentBtn.addEventListener("click", () => {
	if (!hasSymbCom()) {
		updateInfo(getInfo() / 100);
	}
});

signComs.forEach((com) => {
	com.el.addEventListener("click", () => {
		if (com.sign === "-" && !isFirstMinus()) {
			updateInfo("-");
		}
		if (!hasSymbCom() || isFirstMinus()) {
			if (isLastCom()) delLastChar();
			addChar(com.sign);
		}
	});
});

arrNumBtn.forEach((num) => {
	num.addEventListener("click", () => {
		if (num.textContent === ".") {
			if (!getArrInfo()) {
				const info = getInfo();

				if (!info.includes(".")) {
					addChar(".");
				} else {
					sendError("Число вже є десятковим", info);
				}
			} else {
				const info = getArrInfo()[1];

				if (!info.includes(".") && !isLastCom()) {
					addChar(".");
				} else {
					sendError("Число вже є десятковим", info);
				}
			}

		} else if (getInfo() === "0") {
			updateInfo(num.textContent);
		} else {
			addChar(num.textContent);
		}
	});
});

equalBtn.addEventListener("click", () => {
	updateInfo(getResult());
});
