import { isOperator, isFunction, isNumber, isConstant, getPrecedence, getAssociativity, constants } from './utils.js';

const tokenize = (expression) => {
    const tokens = [];
    const regex = /(\d+\.?\d*|\.\d+|\(|\)|[+\-*/%^]|sqrt|log|ln|sin|cos|tan|asin|acos|atan|factorial|pi|e|[xy])/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(expression)) !== null) {
        // Handle implicit multiplication for functions, constants, and parentheses
        if (match.index > lastIndex) {
            const precedingChar = expression.substring(lastIndex, match.index).trim();
            if (precedingChar.length > 0) {
                // Check for scenarios like 2(3), (3)4, 2sin(30), pi(2)
                const lastToken = tokens[tokens.length - 1];
                if (lastToken && (isNumber(lastToken) || lastToken === ')' || isConstant(lastToken) || lastToken === 'x' || lastToken === 'y') && (isFunction(match[0]) || isConstant(match[0]) || match[0] === '(' || match[0] === 'x' || match[0] === 'y')) {
                    tokens.push('*');
                }
            }
        }

        const token = match[0];
        tokens.push(token);
        lastIndex = regex.lastIndex;
    }
    return tokens;
};

const shuntingYard = (tokens) => {
    const outputQueue = [];
    const operatorStack = [];

    tokens.forEach(token => {
        if (isNumber(token) || isConstant(token) || token === 'x' || token === 'y') {
            outputQueue.push(token);
        } else if (isFunction(token)) {
            operatorStack.push(token);
        } else if (isOperator(token)) {
            while (
                operatorStack.length > 0 &&
                (isOperator(operatorStack[operatorStack.length - 1]) || isFunction(operatorStack[operatorStack.length - 1])) &&
                ((
                    getAssociativity(token) === 'left' &&
                    getPrecedence(token) <= getPrecedence(operatorStack[operatorStack.length - 1])
                ) ||
                (
                    getAssociativity(token) === 'right' &&
                    getPrecedence(token) < getPrecedence(operatorStack[operatorStack.length - 1])
                ))
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack.length === 0) {
                throw new Error("Mismatched parentheses");
            }
            operatorStack.pop(); // Pop the '('
            if (operatorStack.length > 0 && isFunction(operatorStack[operatorStack.length - 1])) {
                outputQueue.push(operatorStack.pop());
            }
        }
    });

    while (operatorStack.length > 0) {
        const operator = operatorStack[operatorStack.length - 1];
        if (operator === '(' || operator === ')') {
            throw new Error("Mismatched parentheses");
        }
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
};

export { tokenize, shuntingYard };
