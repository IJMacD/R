/** @typedef {{ [name: string]: any }} Context */
/** @typedef {number[]} Vector */
/** @typedef {number|string|boolean|number[]|string[]|boolean[]} ValueTypes */

/**
 *
 * @param {string} command
 * @param {Context} context
 * @param {(context: Context) => void} setContext
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

        if (isNumeric(context, t1) && t2.type === "range" && isNumeric(context, t3)) {
            return JSON.stringify(range(evaluateNumeric(context, t1), evaluateNumeric(context, t3)));
        }

        if (t2.type !== "operator") {
            throw Error("Expression not supported");
        }

        const op = assertString(t2.value);

        if (t2.value === "<-" && t1.type === "name") {
            assignVariable(context, setContext, t1.value, evaluateValue(context, t3));
            return;
        } else if (t2.value === "->" && t3.type === "name") {
            assignVariable(context, setContext, t3.value, evaluateValue(context, t1));
            return;
        }

        return JSON.stringify(evaluateExpression(context, t1, op, t3));
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

        if (t1.type === "name" && t2.type === "index_bracket" &&
            t4.type === "index_bracket")
        {
            const v = evaluateVector(context, t1);
            const i = evaluateNumeric(context, t3);

            if (i < 1 || i >= v.length) {
                throw Error(`Index out of range: ${i}/${v.length}`);
            }

            return JSON.stringify(v[i-1|0]);
        }
    }

    if (tokens.length === 5) {
        const t1 = tokens[0];
        const t2 = tokens[1];
        const t3 = tokens[2];
        const t4 = tokens[3];
        const t5 = tokens[4];

        if (isNumeric(context, t1) && t2.type === "range" &&
            isNumeric(context, t3) && t4.type === "range" &&
            isNumeric(context, t5))
        {
            return JSON.stringify(range(evaluateNumeric(context, t1), evaluateNumeric(context, t3), evaluateNumeric(context, t5)));
        }

        if (t2.type !== "operator" || t4.type !== "operator")
        {
            throw Error("Expression not supported");
        }

        const op2 = assertString(t2.value);
        const op4 = assertString(t4.value);

        if (op2 === "<-" && (op4 !== "<-" && op4 !== "->") && t1.type === "name") {
            const val = evaluateExpression(context, t3, op4, t5);
            assignVariable(context, setContext, t1.value, val);
            return;
        } else if (op4 === "->" && (op2 !== "<-" && op2 !== "->") && t5.type === "name") {
            const val = evaluateExpression(context, t1, op2, t3);
            assignVariable(context, setContext, t5.value, val);
            return;
        } else {
            const val = evaluateExpression(context, t1, op2, t3);
            if (typeof val === "boolean") throw Error("Bad expression");
            return JSON.stringify(evaluateExpression(context, val, op4, t5));
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
        match: /^(<-|->|==|!=|<=|>=|&&|\|\||[-+*/<>&|^])/,
    },
    bracket: {
        match: /^[()]/,
    },
    index_bracket: {
        match: /^[[\]]/,
    },
    range: {
        match: /^:/,
    },
    whitespace: {
        match: /^\s+/,
        ignore: true,
    },
};

/** @typedef {"string"|"number"|"name"|"operator"|"bracket"|"index_bracket"|"range"|"whitespace"} TokenTypes */

/**
 * @typedef Token
 * @prop {TokenTypes} type
 * @prop {string|number} value
 */

/**
 *
 * @param {string} input
 * @returns {Token[]}
 */
function tokenizer (input) {
    let i = 0;
    const tokens = [];

    while (i < input.length) {
        let tail = input.substr(i);
        let match;

        for (const key in GRAMMAR) {
            const type = /** @type {TokenTypes} */ (key);
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

/**
 *
 * @param {Context} context
 * @param {Token|number|string} token
 */
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

/**
 *
 * @param {Context} context
 * @param {Token|ValueTypes} value
 */
function isNumeric (context, value) {
    if (typeof value === "number") {
        return true;
    }

    if (Array.isArray(value) || typeof value !== "object") {
        return false;
    }

    if (value.type !== "number" && value.type !== "name") {
        return false;
    }

    const v = value.type === "name" ? context[value.value] : value.value;

    if (typeof v === "undefined") {
        throw Error("Symbol not found: " + value.value);
    } else if (typeof v !== "number") {
        return false;
    }

    return true;
}

/**
 *
 * @param {Context} context
 * @param {Token|ValueTypes} value
 */
function isVector (context, value) {
    if (Array.isArray(value)) {
        return true;
    }

    if (typeof value !== "object") {
        return false;
    }

    if (value.type !== "name") {
        return false;
    }

    const v = context[value.value];

    if (typeof v === "undefined") {
        throw Error("Symbol not found: " + value.value);
    } else if (!Array.isArray(v)) {
        return false;
    }

    return true;
}

/**
 *
 * @param {Context} context
 * @param {Token|number} value
 */
function evaluateNumeric (context, value) {
    if (typeof value === "number") {
        return value;
    }

    if (Array.isArray(value)) {
        throw Error(`Invalid numeric value: [Array(${value.length})]`);
    }

    if (typeof value !== "object") {
        throw Error(`Invalid numeric value: [${value}]`);
    }

    if (value.type !== "number" && value.type !== "name") {
        throw Error(`Invalid numeric value: [${value.value}]`);
    }

    const v = value.type === "name" ? context[value.value] : value.value;

    if (typeof v === "undefined") {
        throw Error("Symbol not found: " + value.value);
    } else if (typeof v !== "number") {
        throw Error(`Variable '${value.value}' does not contain a numeric value`);
    }

    return v;
}

/**
 *
 * @param {Context} context
 * @param {Token|number[]} token
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

/**
 *
 * @param {Context} context
 * @param {Token|ValueTypes} t1
 * @param {string} op
 * @param {Token|ValueTypes} t3
 */
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
        op = flipOperator(op);
        return evaluateVectorScalarExpression(context, t3, op, t1);
    }

    throw Error("Invalid expression");
}

/**
 *
 * @param {Context} context
 * @param {number|Token} t1
 * @param {string} op
 * @param {number|Token} t3
 */
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
        case "^": {
            return Math.pow(v1, v3);
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

/**
 *
 * @param {Context} context
 * @param {Token|Vector} t1
 * @param {string} op
 * @param {Token|Vector} t3
 */
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
        case "^": {
            return v1.map((v,i) => Math.pow(v, v3[i]));
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

/**
 *
 * @param {Context} context
 * @param {Token|Vector} t1
 * @param {string} op
 * @param {Token|number} t3
 */
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
        case "^": {
            return v1.map(v => Math.pow(v, v3));
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

function range (start, end, step=1) {
    return Array(Math.floor((end - start)/step) + 1).fill(0).map((n,i) => (i * step) + start);
}

function assertString (x) {
    if (process.env.NODE_ENV === "production") return x;
    if (typeof x !== "string") {
        throw Error("Assertion Error");
    }
    return x;
}

function flipOperator (op) {
    if (op === ">") return "<";
    if (op === "<") return ">";
    if (op === ">=") return "<=";
    if (op === "<=") return ">=";
}