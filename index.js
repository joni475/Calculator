const calculator = document.querySelector(".calculator");
const calculatorKeys = calculator.querySelector(".calculator__keys");
const display = calculator.querySelector(".calculator__display");

function getDisplayedValue() {
  return calculator.querySelector(".calculator__display").textContent;
}

function pressKey(key) {
  calculator.querySelector(`[data-key="${key}"]`).click();
}

function pressKeys(...keys) {
  keys.forEach(pressKey);
}

function resetCalculator() {
  pressKeys("clear", "clear");

  console.assert(getDisplayedValue() === "0", "calculator cleared");
  console.assert(!calculator.dataset.firstValue, "No first value");
  console.assert(!calculator.dataset.operator, "No operator value");
  console.assert(!calculator.dataset.modifierValue, "No modifier value");
}

calculatorKeys.addEventListener("click", (event) => {
  if (!event.target.closest("button")) return;

  const button = event.target;
  const { buttonType, key } = button.dataset;
  const { previousButtonType } = calculator.dataset;
  const result = display.textContent;

  const operatorKeys = [...calculatorKeys.children].filter(
    (button) => button.dataset.buttonType === "operator"
  );
  operatorKeys.forEach((btn) => btn.classList.remove("is-pressed"));
  //number
  if (buttonType === "number") {
    if (result === "0") {
      display.textContent = key;
    } else {
      display.textContent = result + key;
    }

    if (previousButtonType === "operator") {
      display.textContent = key;
    }

    if (previousButtonType === "equal") {
      resetCalculator()
      display.textContent = key;
    }
  }
  //operator
  if (buttonType === "operator") {
    button.classList.add("is-pressed");

    const firstValue = parseFloat(calculator.dataset.firstValue);
    const operator = calculator.dataset.operator;
    const secondValue = parseFloat(result);

    if (
      previousButtonType !== "operator" &&
      previousButtonType !== "equal" &&
      typeof firstValue === "number" &&
      operator
    ) {
      let newResult;
      if (operator === "plus") newResult = firstValue + secondValue;
      if (operator === "minus") newResult = firstValue - secondValue;
      if (operator === "times") newResult = firstValue * secondValue;
      if (operator === "divide") newResult = firstValue / secondValue;

      display.textContent = newResult;
      console.log(firstValue, operator, secondValue, "=", newResult);
      calculator.dataset.firstValue = newResult;
    } else {
      calculator.dataset.firstValue = result;
    }

    calculator.dataset.operator = button.dataset.key;
  }
  //decimal
  if (buttonType === "decimal") {
    if (!result.includes(".")) {
      display.textContent = result + ".";
    }
    if (previousButtonType === "equal") {
      calculator.dataset.firstValue = result;
      calculator.dataset.operator = button.dataset.key;

      display.textContent = "0.";
    }
    if (previousButtonType === "operator") {
      display.textContent = "0.";
    }
  }
  //equal
  if (buttonType === "equal") {
    const firstValue = parseFloat(calculator.dataset.firstValue);
    const operator = calculator.dataset.operator;
    // const secondValue = parseFloat(result);
    // Use modifier value as secondValue (if possible)
    const modifierValue = parseFloat(calculator.dataset.modifierValue);
    const secondValue = modifierValue || parseFloat(result);

    if (typeof firstValue === "number" && operator) {
      let newResult;
      if (operator === "plus") newResult = firstValue + secondValue;
      if (operator === "minus") newResult = firstValue - secondValue;
      if (operator === "times") newResult = firstValue * secondValue;
      if (operator === "divide") newResult = firstValue / secondValue;

      display.textContent = newResult;

      console.log(firstValue, operator, secondValue, "=", newResult);

      calculator.dataset.firstValue = newResult;
      calculator.dataset.modifierValue = secondValue;
    } else {
      display.textContent = parseFloat(result) * 1;
    }
  }

  //clear
  if (buttonType === "clear") {
    if (button.textContent === "AC") {
      delete calculator.dataset.firstValue;
      delete calculator.dataset.operator;
      delete calculator.dataset.modifierValue;
    }
    display.textContent = "0";
    button.textContent = "AC";
  }

  if (buttonType !== "clear") {
    const clearButton = calculator.querySelector("[data-button-type=clear]");
    clearButton.textContent = "CE";
  }
  calculator.dataset.previousButtonType = buttonType;
});

// ***********TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST*********

function runTest(test) {
  pressKeys(...test.keys);
  console.assert(getDisplayedValue() === test.result, test.message);
  resetCalculator();
}

const tests = [
  {
    message: "Addition",
    keys: ["2", "plus", "5", "equal"],
    result: "7",
  },
  {
    message: "Subtraction",
    keys: ["5", "minus", "9", "equal"],
    result: "-4",
  },
  {
    message: "Multiplication",
    keys: ["4", "times", "8", "equal"],
    result: "32",
  },
  {
    message: "Division",
    keys: ["5", "divide", "1", "0", "equal"],
    result: "0.5",
  },
  {
    message: "Number Equal",
    keys: ["5", "equal"],
    result: "5",
  },
  {
    message: "Number Decimal Equal",
    keys: ["2", "decimal", "4", "5", "equal"],
    result: "2.45",
  },
  {
    message: "Deciam key",
    keys: ["decimal"],
    result: "0.",
  },
  {
    message: "Decimal Decimal",
    keys: ["2", "decimal", "decimal"],
    result: "2.",
  },
  {
    message: "Decimal Number Decimal",
    keys: ["2", "decimal", "5", "decimal", "5"],
    result: "2.55",
  },
  {
    message: "Decimal Equal",
    keys: ["2", "decimal", "equal"],
    result: "2",
  },
  {
    message: "Equal",
    keys: ["equal"],
    result: "0",
  },
  {
    message: "Equal Number",
    keys: ["equal", "3"],
    result: "3",
  },
  {
    message: "Number Equal Number",
    keys: ["5", "equal", "3"],
    result: "3",
  },
  {
    message: "Equal Decimal",
    keys: ["equal", "decimal"],
    result: "0.",
  },
  {
    message: "Number Equal Decimal",
    keys: ["5", "equal", "decimal"],
    result: "0.",
  },
  {
    message: "Calculator + Operator",
    keys: ["1", "plus", "1", "equal", "plus", "1", "equal"],
    result: "3",
  },
  {
    message: "Operator Decimal",
    keys: ["times", "decimal"],
    result: "0.",
  },
  {
    message: "Number Operator Decimal",
    keys: ["5", "times", "decimal"],
    result: "0.",
  },
  {
    message: "Number Operator Equal",
    keys: ["7", "divide", "equal"],
    result: "1",
  },
  {
    message: "Operator calculation",
    keys: ["9", "minus", "5", "minus"],
    result: "4",
  },
  {
    message: "Number Operator Operator",
    keys: ["9", "times", "divide"],
    result: "9",
  },
  {
    messege: "Number Operator Equal Equal",
    keys: ["9", "minus", "equal", "equal"],
    result: "-9",
  },
  {
    messege: "Number Operator Nmber Equal Equal",
    keys: ["8", "minus", "5", "equal", "equal"],
    result: "-2",
  },
  {
    messege: "Operator follow-up calculation",
    keys: ["1", "plus", "2", "plus", "3", "plus", "4", "plus", "5", "plus"],
    result: "15",
  },
];

tests.forEach(runTest);
