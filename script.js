let currentInput = '';
let currentOperator = '';
let previousInput = '';
let shouldResetDisplay = false;
let lastActiveButton = null;
let hasDecimal = false;
let lastPressedEquals = false;

const display = document.getElementById('display');

function setActiveButton(button) {
    if (lastActiveButton) {
        lastActiveButton.setAttribute('data-active', 'false');
    }
    button.setAttribute('data-active', 'true');
    lastActiveButton = button;
}

function appendNumber(num) {
    if (shouldResetDisplay || lastPressedEquals) {
        currentInput = '';
        shouldResetDisplay = false;
        hasDecimal = false;
        lastPressedEquals = false;
    }

    // Handle decimal point
    if (num === '.') {
        if (hasDecimal) return; // Prevent multiple decimals
        hasDecimal = true;
        if (currentInput === '') currentInput = '0'; // Add leading zero if decimal is first
    }

    currentInput += num;
    updateDisplay();
    setActiveButton(event.currentTarget);
}

function setOperator(operator) {
    if (currentInput === '') return;
    lastPressedEquals = false;
    if (previousInput !== '') {
        calculateResult();
    }
    previousInput = currentInput;
    currentOperator = operator;
    shouldResetDisplay = true;
    hasDecimal = false;
    setActiveButton(event.currentTarget);
}

function clearEntry() {
    currentInput = '';
    hasDecimal = false;
    lastPressedEquals = false;
    updateDisplay();
    setActiveButton(event.currentTarget);
}

function deleteLast() {
    if (currentInput.slice(-1) === '.') {
        hasDecimal = false;
    }
    currentInput = currentInput.slice(0, -1);
    lastPressedEquals = false;
    updateDisplay();
    setActiveButton(event.currentTarget);
}

function calculatePi() {
    currentInput = Math.PI.toString();
    hasDecimal = true;
    lastPressedEquals = false;
    updateDisplay();
    setActiveButton(event.currentTarget);
}

function calculate(operation) {
    if (currentInput === '') return;
    lastPressedEquals = false;
    
    const num = parseFloat(currentInput);
    let result;
    
    switch (operation) {
        case 'sin':
            result = Math.sin(num * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(num * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(num * Math.PI / 180);
            break;
        case 'root':
            previousInput = currentInput;
            currentOperator = 'root';
            shouldResetDisplay = true;
            hasDecimal = false;
            setActiveButton(event.currentTarget);
            return;
        case 'log':
            result = Math.log10(num);
            break;
        case 'ln':
            result = Math.log(num);
            break;
        case 'exp':
            result = Math.exp(num);
            break;
        case 'pow':
            previousInput = currentInput;
            currentOperator = 'pow';
            shouldResetDisplay = true;
            hasDecimal = false;
            setActiveButton(event.currentTarget);
            return;
    }
    
    currentInput = result.toString();
    hasDecimal = currentInput.includes('.');
    updateDisplay();
    setActiveButton(event.currentTarget);
}

function calculateResult() {
    if (previousInput === '' || currentInput === '') return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (currentOperator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                return;
            }
            result = prev / current;
            break;
        case 'pow':
            result = Math.pow(prev, current);
            break;
        case 'root':
            if (prev === 0) {
                alert('Root index cannot be zero');
                return;
            }
            result = Math.pow(current, 1/prev);
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    hasDecimal = currentInput.includes('.');
    previousInput = '';
    currentOperator = '';
    lastPressedEquals = true;
    updateDisplay();
    setActiveButton(event.currentTarget);
}

function updateDisplay() {
    display.value = currentInput;
}

// Initialize display
updateDisplay();

// Initialize data-active attributes
document.querySelectorAll('button').forEach(button => {
    button.setAttribute('data-active', 'false');
});
