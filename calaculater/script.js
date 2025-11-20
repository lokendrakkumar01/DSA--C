document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '';
    // Remove operator, firstOperand, expectingSecondOperand

    function updateDisplay() {
        display.value = currentInput;
    }

    function clearAll() {
        currentInput = '';
        updateDisplay();
    }

    function handleNumber(number) {
        currentInput += number;
        updateDisplay();
    }

    function handleDecimal() {
        // Prevent adding multiple decimals in the current number segment
        const lastNumberMatch = currentInput.match(/(\d+\.?\d*)$/);
        if (lastNumberMatch && !lastNumberMatch[0].includes('.')) {
            currentInput += '.';
        } else if (!lastNumberMatch && currentInput === '') {
            currentInput = '0.';
        } else if (!lastNumberMatch && !currentInput.endsWith('.') && currentInput !== '') {
            currentInput += '.';
        }
        updateDisplay();
    }

    function handleOperator(op) {
        // Ensure operator isn't added right after another operator (except for unary minus)
        const lastChar = currentInput.slice(-1);
        if (['+', '-', '*', '/', '^'].includes(lastChar) && op !== '-') {
            // Replace last operator if it's not a unary minus scenario
            currentInput = currentInput.slice(0, -1) + op;
        } else {
            currentInput += op;
        }
        updateDisplay();
    }

    function handleFunction(func) {
        currentInput += func + '(';
        updateDisplay();
    }

    function handleParenthesis(paren) {
        currentInput += paren;
        updateDisplay();
    }

    function calculateResult() {
        try {
            let expression = currentInput;

            // Replace special operators with standard JS math functions
            expression = expression.replace(/√/g, 'sqrt');
            expression = expression.replace(/\^/g, '**');

            // Handle functions like sin, cos, tan, log, sqrt
            expression = expression.replace(/sin\(([^)]*)\)/g, (match, p1) => `Math.sin(${p1 * (Math.PI / 180)})`); // Convert degrees to radians
            expression = expression.replace(/cos\(([^)]*)\)/g, (match, p1) => `Math.cos(${p1 * (Math.PI / 180)})`); // Convert degrees to radians
            expression = expression.replace(/tan\(([^)]*)\)/g, (match, p1) => `Math.tan(${p1 * (Math.PI / 180)})`); // Convert degrees to radians
            expression = expression.replace(/log\(([^)]*)\)/g, (match, p1) => `Math.log10(${p1})`);
            expression = expression.replace(/sqrt\(([^)]*)\)/g, (match, p1) => {
                const num = parseFloat(p1);
                if (num < 0) {
                    throw new Error("Cannot take square root of a negative number");
                }
                return `Math.sqrt(${num})`;
            });
            
            // Evaluate the expression using a safer method (or a custom parser if eval is strictly disallowed)
            // For now, using Function constructor as a safer alternative to direct eval
            const result = new Function('return ' + expression)();
            currentInput = String(result);
        } catch (error) {
            currentInput = 'Error';
            alert(error.message || "Invalid Expression");
        }
        updateDisplay();
    }

    buttons.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }

        const key = target.dataset.key;

        if (key === 'c') {
            clearAll();
        } else if (key === '=') {
            calculateResult();
        } else if (key === '.') {
            handleDecimal();
        } else if (['+', '-', '*', '/', '^'].includes(key)) {
            handleOperator(key);
        } else if (['sin', 'cos', 'tan', 'log', 'sqrt'].includes(key)) {
            handleFunction(key);
        } else if (['(', ')'].includes(key)) {
            handleParenthesis(key);
        } else {
            handleNumber(key);
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (key >= '0' && key <= '9') {
            handleNumber(key);
        } else if (key === '.') {
            handleDecimal();
        } else if (['+', '-', '*', '/'].includes(key)) {
            handleOperator(key);
        } else if (key === '^') {
            handleOperator('^');
        } else if (key === '(' || key === ')') {
            handleParenthesis(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculateResult();
        } else if (key === 'Escape') {
            clearAll();
        } else if (key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        }
        // For scientific functions like sin, cos, etc., direct keyboard input is less intuitive.
        // Users can use the on-screen buttons for these.
    });

    updateDisplay();
});
