import { tokenize, shuntingYard } from './parser.js';
import { evaluateRpn } from './evaluator.js';
import { constants, variables } from './utils.js';

const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');
const buttons = document.querySelector('.buttons');
const degRadToggle = document.querySelector('[data-key="deg_rad"]');

let currentInput = '';
let isDegreesMode = false;
let memory = 0;
let history = [];

const updateDisplay = (value = currentInput) => {
    display.value = value;
};

const updateHistory = (expression, result) => {
    history.push(`${expression} = ${result}`);
    if (history.length > 5) {
        history.shift(); // Keep only the last 5 entries
    }
    historyDisplay.innerHTML = history.join('<br>');
    historyDisplay.scrollTop = historyDisplay.scrollHeight; // Scroll to bottom
};

const clearAll = () => {
    currentInput = '';
    updateDisplay();
};

const handleMemoryClear = () => {
    memory = 0;
};

const handleMemoryRecall = () => {
    currentInput += String(memory);
    updateDisplay();
};

const handleMemoryAdd = () => {
    try {
        const result = evaluateExpression(currentInput);
        if (!isNaN(result)) {
            memory += result;
            updateDisplay(result);
            currentInput = String(result);
        } else {
            throw new Error("Invalid input for M+");
        }
    } catch (error) {
        updateDisplay("Error");
        currentInput = '';
        alert(error.message);
    }
};

const handleMemorySubtract = () => {
    try {
        const result = evaluateExpression(currentInput);
        if (!isNaN(result)) {
            memory -= result;
            updateDisplay(result);
            currentInput = String(result);
        } else {
            throw new Error("Invalid input for M-");
        }
    } catch (error) {
        updateDisplay("Error");
        currentInput = '';
        alert(error.message);
    }
};

const toggleDegreesRadians = () => {
    isDegreesMode = !isDegreesMode;
    degRadToggle.textContent = isDegreesMode ? 'DEG' : 'RAD';
};

const evaluateExpression = (expression) => {
    if (!expression) return '';
    try {
        const tokens = tokenize(expression);
        const rpnTokens = shuntingYard(tokens);
        const result = evaluateRpn(rpnTokens, isDegreesMode);
        return result;
    } catch (error) {
        throw error;
    }
};

const handleEquals = () => {
    try {
        const result = evaluateExpression(currentInput);
        updateHistory(currentInput, result);
        currentInput = String(result);
        updateDisplay();
    } catch (error) {
        updateDisplay("Error");
        updateHistory(currentInput, "Error");
        currentInput = '';
        alert(error.message);
    }
};

const handleButtonClick = (key) => {
    switch (key) {
        case 'c':
            clearAll();
            break;
        case 'backspace':
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
            break;
        case '=':
            handleEquals();
            break;
        case 'pi':
            currentInput += String(constants.pi);
            break;
        case 'e':
            currentInput += String(constants.e);
            break;
        case 'x':
        case 'y':
            currentInput += key;
            break;
        case 'mc':
            handleMemoryClear();
            break;
        case 'mr':
            handleMemoryRecall();
            break;
        case 'm_plus':
            handleMemoryAdd();
            break;
        case 'm_minus':
            handleMemorySubtract();
            break;
        case 'deg_rad':
            toggleDegreesRadians();
            break;
        case 'factorial':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'asin':
        case 'acos':
        case 'atan':
        case 'log':
        case 'ln':
            currentInput += key + '('; // Append function name like a function
            break;
        default:
            currentInput += key;
    }
    updateDisplay();
};

const setupEventListeners = () => {
    buttons.addEventListener('click', (event) => {
        const { target } = event;
        if (target.matches('button')) {
            handleButtonClick(target.dataset.key);
        }
    });

    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key >= '0' && key <= '9') {
            handleButtonClick(key);
        } else if (key === '.') {
            handleButtonClick(key);
        } else if (['+', '-', '*', '/', '%', '^'].includes(key)) {
            handleButtonClick(key);
        } else if (key === '(' || key === ')') {
            handleButtonClick(key);
        } else if (key === 'Enter') {
            event.preventDefault();
            handleButtonClick('=');
        } else if (key === 'Escape') {
            handleButtonClick('c');
        } else if (key === 'Backspace') {
            handleButtonClick('backspace');
        } else if (key === 'p') { // For pi
            handleButtonClick('pi');
        } else if (key === 'e') { // For e
            handleButtonClick('e');
        } else if (key === 'x') {
            handleButtonClick('x');
        } else if (key === 'y') {
            handleButtonClick('y');
        }
    });
};

export { setupEventListeners, updateDisplay };
