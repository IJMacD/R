/**
 *
 * @param {string} command
 * @param {{ [name: string]: any }} context
 * @param {(context: { [name: string]: any }) => void} setContext
 * @returns {string}
 */
export default function interpreter (command, context, setContext) {
    if (command.length === 0) {
        return;
    }

    const tokens = tokenizer(command);

    if (tokens.length === 1) {
        if (tokens[0].type === "name") {
            if (tokens[0].value in context) {
                return JSON.stringify(context[tokens[0].value]);
            } else {
                throw Error("symbol not found: " + tokens[0].value);
            }
        }

        if (tokens[0].type === "number" || tokens[0].type === "string") {
            return JSON.stringify(tokens[0].value);
        }

        throw Error("Invalid expression");
    }

    if (tokens.length === 3) {
        const t1 = tokens[0];
        const t2 = tokens[1];
        const t3 = tokens[2];

        if (t2.type !== "operator")
        {
            throw Error("Expression not supported");
        }

        if (t2.value === "<-" && t1.type === "name") {
            assignVariable(context, setContext, t1.value, evaluateValue(context, t3));
            return;
        } else if (t2.value === "->" && t3.type === "name") {
            assignVariable(context, setContext, t3.value, evaluateValue(context, t1));
            return;
        }

        return JSON.stringify(evaluateExpression(context, t1, t2.value, t3));
    }

    if (tokens.length === 4) {
        const t1 = tokens[0];
        const t2 = tokens[1];
        const t3 = tokens[2];
        const t4 = tokens[3];

        if (t1.type === "name" && t2.type === "bracket" &&
            t3.type === "name" && t4.type === "bracket")
        {
            switch (t1.value) {
                case "rm":
                    removeVariable(context, setContext, t3.value);
                    return;
            }
        }
    }

    if (tokens.length === 5) {
        const t1 = tokens[0];
        const t2 = tokens[1];
        const t3 = tokens[2];
        const t4 = tokens[3];
        const t5 = tokens[4];

        if (t2.type !== "operator" || t4.type !== "operator")
        {
            throw Error("Expression not supported");
        }

        if (t2.value === "<-" && (t4.value !== "<-" && t4.value !== "->") && t1.type === "name") {
            const val = evaluateExpression(context, t3, t4.value, t5);
            assignVariable(context, setContext, t1.value, val);
            return;
        } else if (t4.value === "->" && (t2.value !== "<-" && t2.value !== "->") && t5.type === "name") {
            const val = evaluateExpression(context, t1, t2.value, t3);
            assignVariable(context, setContext, t5.value, val);
            return;
        } else {
            const val = evaluateExpression(context, t1, t2.value, t3);
            return JSON.stringify(evaluateExpression(context, val, t4.value, t5));
        }
    }

    throw Error(`Command not recognised: '${command}'`);
}

const GRAMMAR = {
    string: {
        match: /^"([^"]*)"/,
        map: m => m[1],
    },
    number: {
        match: /^-?[0-9]+(?:\.[0-9]+)?/,
        map: m => +m[0],
    },
    name: {
        match: /^[a-z][a-z0-9_.]*/i,
    },
    operator: {
        match: /^(<-|->|==|!=|<=|>=|&&|\|\||[-+*/<>&|])/,
    },
    bracket: {
        match: /^[()]/,
    },
    whitespace: {
        match: /^\s+/,
        ignore: true,
    },
};

/**
 *
 * @param {string} input
 */
function tokenizer (input) {
    let i = 0;
    const tokens = [];

    while (i < input.length) {
        let tail = input.substr(i);
        let match;

        for (const type in GRAMMAR) {
            const g = GRAMMAR[type];
            match = g.match.exec(tail);
            if (match) {
                if (!g.ignore) {
                    tokens.push({
                        type,
                        value: g.map ? g.map(match) : match[0],
                    });
                }
                i += match[0].length;
                break;
            }
        }

        if (!match) {
            throw Error("Unrecognised Input: " + tail.substr(0, 10));
        }
    }

    return tokens;
}

function evaluateValue (context, token) {
    if (typeof token === "number" || typeof token === "string") {
        return token;
    }

    const v = token.type === "name" ? context[token.value] : token.value;

    if (typeof v === "undefined") {
        throw Error("symbol not found: " + token.value);
    }

    return v;
}

function isNumeric (context, token) {
    if (typeof token === "number") {
        return true;
    }

    if (token.type !== "number" && token.type !== "name") {
        return false;
    }

    const v = token.type === "name" ? context[token.value] : token.value;

    if (typeof v === "undefined") {
        throw Error("Symbol not found: " + token.value);
    } else if (typeof v !== "number") {
        return false;
    }

    return true;
}

function isVector (context, token) {
    if (Array.isArray(token)) {
        return true;
    }

    if (token.type !== "name") {
        return false;
    }

    const v = context[token.value];

    if (typeof v === "undefined") {
        throw Error("Symbol not found: " + token.value);
    } else if (!Array.isArray(v)) {
        return false;
    }

    return true;
}

function evaluateNumeric (context, token) {
    if (typeof token === "number") {
        return token;
    }

    if (token.type !== "number" && token.type !== "name") {
        throw Error(`Invalid numeric value: [${token.value}]`);
    }

    const v = token.type === "name" ? context[token.value] : token.value;

    if (typeof v === "undefined") {
        throw Error("Symbol not found: " + token.value);
    } else if (typeof v !== "number") {
        throw Error(`Variable '${token.value}' does not contain a numeric value`);
    }

    return v;
}

/**
 *
 * @param {*} context
 * @param {*} token
 * @returns {number[]}
 */
function evaluateVector (context, token) {
    if (Array.isArray(token)) {
        return token;
    }

    if (token.type !== "name") {
        throw Error(`Invalid vector value: [${token.value}]`);
    }

    const v = context[token.value];

    if (typeof v === "undefined") {
        throw Error("Symbol not found: " + token.value);
    } else if (!Array.isArray(v)) {
        throw Error(`Variable '${token.value}' does not contain a vector value`);
    }
    return v;
}

function assignVariable (context, setContext, name, value) {
    setContext({
        ...context,
        [name]: value,
    });
}

function removeVariable (context, setContext, name) {
    const { [name]: toRemove, ...rest } = context;
    setContext(rest);
}

function evaluateExpression (context, t1, op, t3) {
    if (isNumeric(context, t1) && isNumeric(context, t3)) {
        return evaluteScalarExpression(context, t1, op, t3);
    }

    if (isVector(context, t1) && isVector(context, t3)) {
        return evaluateVectorExpression(context, t1, op, t3);
    }

    if (isVector(context, t1) && isNumeric(context, t3)) {
        return evaluateVectorScalarExpression(context, t1, op, t3);
    }

    if (isNumeric(context, t1) && isVector(context, t3)) {
        if (op === ">") op = "<";
        else if (op === ">") op = "<";
        else if (op === ">=") op = "<=";
        else if (op === "<=") op = ">=";
        return evaluateVectorScalarExpression(context, t3, op, t1);
    }

    throw Error("Invalid expression");
}

function evaluteScalarExpression (context, t1, op, t3) {
    const v1 = evaluateNumeric(context, t1);
    const v3 = evaluateNumeric(context, t3);

    switch (op) {
        case "+": {
            return v1 + v3;
        }
        case "-": {
            return v1 - v3;
        }
        case "*": {
            return v1 * v3;
        }
        case "/": {
            return v1 / v3;
        }
        case "==": {
            return v1 == v3;
        }
        case "!=": {
            return v1 != v3;
        }
        case "<": {
            return v1 < v3;
        }
        case ">": {
            return v1 > v3;
        }
        case "<=": {
            return v1 <= v3;
        }
        case ">=": {
            return v1 >= v3;
        }
        case "&&": {
            return Boolean(v1 && v3);
        }
        case "||": {
            return Boolean(v1 || v3);
        }
        case "&":
            throw Error("Use && to compare numbers");
        case "|":
            throw Error("Use || to compare numbers");
    }

    throw Error("Unrecognised operator: " + op);
}

function evaluateVectorExpression (context, t1, op, t3) {
    const v1 = evaluateVector(context, t1);
    const v3 = evaluateVector(context, t3);

    if (v1.length != v3.length) {
        throw Error(`Vector lengths do not match: ${v1.length} and ${v3.length}`)
    }

    switch (op) {
        case "+": {
            return v1.map((v,i) => v + v3[i]);
        }
        case "-": {
            return v1.map((v,i) => v - v3[i]);
        }
        case "*": {
            return v1.map((v,i) => v * v3[i]);
        }
        case "/": {
            return v1.map((v,i) => v / v3[i]);
        }
        case "==": {
            return v1.map((v,i) => v == v3[i]);
        }
        case "!=": {
            return v1.map((v,i) => v != v3[i]);
        }
        case "<": {
            return v1.map((v,i) => v < v3[i]);
        }
        case ">": {
            return v1.map((v,i) => v > v3[i]);
        }
        case "<=": {
            return v1.map((v,i) => v <= v3[i]);
        }
        case ">=": {
            return v1.map((v,i) => v >= v3[i]);
        }
        case "&": {
            return v1.map((v,i) => Boolean(v && v3[i]));
        }
        case "|": {
            return v1.map((v,i) => Boolean(v || v3[i]));
        }
        case "&&": {
            return v1.every((v,i) => v && v3[i]);
        }
        case "||": {
            return v1.every((v,i) => v || v3[i]);
        }
    }

    throw Error("Unrecognised operator: " + op);
}

function evaluateVectorScalarExpression (context, t1, op, t3) {
    const v1 = evaluateVector(context, t1);
    const v3 = evaluateNumeric(context, t3);

    switch (op) {
        case "+": {
            return v1.map(v => v + v3);
        }
        case "-": {
            return v1.map(v => v - v3);
        }
        case "*": {
            return v1.map(v => v * v3);
        }
        case "/": {
            return v1.map(v => v / v3);
        }
        case "==": {
            return v1.map(v => v == v3);
        }
        case "!=": {
            return v1.map(v => v != v3);
        }
        case "<": {
            return v1.map(v => v < v3);
        }
        case ">": {
            return v1.map(v => v > v3);
        }
        case "<=": {
            return v1.map(v => v <= v3);
        }
        case ">=": {
            return v1.map(v => v >= v3);
        }
        case "&": {
            return v1.map(v => Boolean(v && v3));
        }
        case "|": {
            return v1.map(v => Boolean(v || v3));
        }
        case "&&": {
            return v1.every(v => v && v3);
        }
        case "||": {
            return v1.every(v => v || v3);
        }
    }

    throw Error("Unrecognised operator: " + op);
}