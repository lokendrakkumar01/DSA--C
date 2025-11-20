import { operate, isNumber, isConstant, isFunction, constants, variables, PRECISION } from './utils.js';

const evaluateRpn = (rpnTokens, isDegreesMode) => {
    const stack = [];

    rpnTokens.forEach(token => {
        if (isNumber(token)) {
            stack.push(parseFloat(token));
        } else if (isConstant(token)) {
            if (token === 'pi') {
                stack.push(constants.pi);
            } else if (token === 'e') {
                stack.push(constants.e);
            } else if (token === 'x') {
                stack.push(variables.x);
            } else if (token === 'y') {
                stack.push(variables.y);
            }
        } else if (isFunction(token)) {
            let operand;
            if (token === 'factorial') {
                operand = stack.pop();
                stack.push(operate[token](operand));
            } else {
                operand = stack.pop();
                stack.push(operate[token](operand, isDegreesMode));
            }
        } else if (operate.hasOwnProperty(token)) { // Operator
            const b = stack.pop();
            const a = stack.pop();
            stack.push(operate[token](a, b));
        } else {
            throw new Error("Unknown token: " + token);
        }
    });

    if (stack.length !== 1) {
        throw new Error("Invalid expression");
    }

    return parseFloat(stack.pop().toFixed(PRECISION));
};

export { evaluateRpn };
