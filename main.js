const allBtns = document.querySelectorAll("button");
const result = document.querySelector(".result");
const prevCalc = document.querySelector(".topResult");
let operationSelected = false;

let digits = {
    firstDigit: "",
    secondDigit: "",
    operation: "",
};

allBtns.forEach((btn) => {
    buttonClicked(btn);
});

function buttonClicked(btn) {
    btn.addEventListener("click", () => {
        const value = btn.textContent;
        if (".0123456789".includes(value)) {
            numberClicked(value);
        } else if ("/*+-".includes(value)) {
            operationClicked(value);
        } else if (value === "CE") {
            clearClicked();
        } else if (value === "DEL") {
            delClicked();
        } else if (value === "=") {
            calc();
        }
    });
}

function updateScreen({ firstDigit, secondDigit, operation } = digits) {
    result.textContent = `
    ${firstDigit} 
    ${operation} 
    ${secondDigit}`;
}

function updatePrevCalc() {
    if (digits.firstDigit !== "") {
        prevCalc.textContent = `
	${digits.firstDigit}
	${digits.operation}
	${digits.secondDigit} =`;
    } else {
        prevCalc.textContent = "";
    }
}

function numberClicked(value) {
    if (!operationSelected) {
        if (!(value === "." && digits.firstDigit.includes("."))) {
            digits.firstDigit += value;
        }
    } else {
        if (!(value === "." && digits.secondDigit.includes("."))) {
            digits.secondDigit += value;
        }
    }

    updateScreen();
}

function operationClicked(value) {
    if (digits.secondDigit !== "") {
        calc(value);
    } else {
        digits.operation = value;
        operationSelected = true;
    }
    updateScreen();
}

function clearClicked() {
    digits.firstDigit = "";
    digits.secondDigit = "";
    digits.operation = "";
    operationSelected = false;
    updateScreen();
    updatePrevCalc();
}

let deleteDigit = (digit) => {
    return digit.slice(0, length - 1);
};

function delClicked() {
    if (digits.secondDigit.length > 0) {
        digits.secondDigit = deleteDigit(digits.secondDigit);
    } else if (digits.operation.length > 0) {
        digits.operation = deleteDigit(digits.operation);
        operationSelected = false;
    } else if (digits.firstDigit.length > 0) {
        digits.firstDigit = deleteDigit(digits.firstDigit);
    }
    if (digits.firstDigit.length === 0) {
        updatePrevCalc();
    }
    updateScreen();
}

function threatCalc() {
    if (digits.firstDigit[digits.firstDigit.length - 1] === ".") {
        digits.firstDigit = deleteDigit(digits.firstDigit);
    }
    if (digits.secondDigit[digits.secondDigit.length - 1] === ".") {
        digits.secondDigit = deleteDigit(digits.secondDigit);
    }
    if (digits.firstDigit[0] === ".") {
        digits.firstDigit = "0".concat(digits.firstDigit);
    }
    if (digits.secondDigit[0] === ".") {
        digits.secondDigit = "0".concat(digits.secondDigit);
    }
    if (digits.secondDigit.length === 0) {
        digits.operation = "";
        operationSelected = false;
    }
}

function calc(nextValue = "") {
    threatCalc();
    updatePrevCalc();
    showResult(nextValue);
}

function showResult(nextValue = "") {
    let calcResult = "";
    if (
        digits.firstDigit !== "" &&
        digits.secondDigit !== "" &&
        digits.operation !== ""
    ) {
        if (digits.operation === "+") {
            calcResult = +digits.firstDigit + +digits.secondDigit;
        } else if (digits.operation === "-") {
            calcResult = +digits.firstDigit - +digits.secondDigit;
        } else if (digits.operation === "*") {
            calcResult = +digits.firstDigit * +digits.secondDigit;
        } else if (digits.operation === "/") {
            calcResult = +digits.firstDigit / +digits.secondDigit;
            if (+digits.secondDigit === 0) {
                prevCalc.textContent = "Unable to divide by 0";
                calcResult = "";
            }
        }
        calcResult = calcResult.toString();
    } else {
        calcResult = digits.firstDigit;
    }
    digits.secondDigit = "";
    digits.firstDigit = calcResult;
    digits.operation = nextValue;
    result.textContent = calcResult + nextValue;
    if (nextValue === "") {
        operationSelected = false;
    } else {
        operationSelected = true;
    }
}
