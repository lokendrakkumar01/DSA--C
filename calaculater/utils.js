const PRECISION = 10;

const operate = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    },
    '%': (a, b) => a % b,
    '^': (a, b) => Math.pow(a, b),
    'sqrt': (a) => {
        if (a < 0) throw new Error("Square root of negative number");
        return Math.sqrt(a);
    },
    'log': (a) => {
        if (a <= 0) throw new Error("Logarithm of non-positive number");
        return Math.log10(a);
    },
    'ln': (a) => {
        if (a <= 0) throw new Error("Natural logarithm of non-positive number");
        return Math.log(a);
    },
    'factorial': (a) => {
        if (a < 0 || !Number.isInteger(a)) throw new Error("Factorial of negative or non-integer number");
        if (a === 0) return 1;
        let result = 1;
        for (let i = 2; i <= a; i++) result *= i;
        return result;
    },
    'sin': (angle, isDegrees) => isDegrees ? Math.sin(toRadians(angle)) : Math.sin(angle),
    'cos': (angle, isDegrees) => isDegrees ? Math.cos(toRadians(angle)) : Math.cos(angle),
    'tan': (angle, isDegrees) => {
        if (isDegrees && (angle % 180 === 90 || angle % 180 === -90)) throw new Error("Tangent of 90 or 270 degrees is undefined");
        return isDegrees ? Math.tan(toRadians(angle)) : Math.tan(angle);
    },
    'asin': (val, isDegrees) => {
        if (val < -1 || val > 1) throw new Error("Arc sine input must be between -1 and 1");
        return isDegrees ? toDegrees(Math.asin(val)) : Math.asin(val);
    },
    'acos': (val, isDegrees) => {
        if (val < -1 || val > 1) throw new Error("Arc cosine input must be between -1 and 1");
        return isDegrees ? toDegrees(Math.acos(val)) : Math.acos(val);
    },
    'atan': (val, isDegrees) => isDegrees ? toDegrees(Math.atan(val)) : Math.atan(val),
};

const toRadians = (degrees) => degrees * (Math.PI / 180);
const toDegrees = (radians) => radians * (180 / Math.PI);

const isOperator = (token) => operate.hasOwnProperty(token) && ['+', '-', '*', '/', '%', '^'].includes(token);
const isFunction = (token) => operate.hasOwnProperty(token) && !isOperator(token);
const isNumber = (token) => !isNaN(parseFloat(token)) && isFinite(token);
const isConstant = (token) => ['pi', 'e', 'x', 'y'].includes(token);

const getPrecedence = (operator) => {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
        case '%':
            return 2;
        case '^':
            return 3;
        default:
            return 0;
    }
};

const getAssociativity = (operator) => {
    if (operator === '^') return 'right';
    return 'left';
};

const constants = {
    'pi': Math.PI,
    'e': Math.E,
};

const variables = {
    'x': 0, // Default value for x
    'y': 0, // Default value for y
};

export { operate, toRadians, toDegrees, isOperator, isFunction, isNumber, isConstant, getPrecedence, getAssociativity, constants, variables, PRECISION };
