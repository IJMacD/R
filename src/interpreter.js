/**
 *
 * @param {string} command
 * @param {{ [name: string]: any }} context
 * @param {(context: { [name: string]: any }) => void} setContext
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
            return assignValue(context, setContext, t1.value, evaluateValue(context, t3));
        } else if (t2.value === "->" && t3.type === "name") {
            return assignValue(context, setContext, t3.value, evaluateValue(context, t1));
        }

        return evaluateExpression(context, t1, t2.value, t3);
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
            return assignValue(context, setContext, t1.value, val);
        } else if (t4.value === "->" && (t2.value !== "<-" && t2.value !== "->") && t5.type === "name") {
            const val = evaluateExpression(context, t1, t2.value, t3);
            return assignValue(context, setContext, t5.value, val);
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
        match: /^[a-z][a-z0-9_]*/,
    },
    operator: {
        match: /^(<-|->|\+|-|\*|\/)/,
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

        for (const type in GRAMMAR) {
            const g = GRAMMAR[type];
            const match = g.match.exec(tail);
            if (match) {
                tokens.push({
                    type,
                    value: g.map ? g.map(match) : match[0],
                });
                i += match[0].length;
                break;
            }
        }

        if (i < input.length) {
            tail = input.substr(i);

            const whitespaceMatch = /^\s+/.exec(tail);
            if (whitespaceMatch) {
                i += whitespaceMatch[0].length;
                continue;
            }

            throw Error("Unrecognised Input: " + tail.substr(0, 10));
        }
    }

    return tokens;
}

function evaluateValue (context, token) {
    const v = token.type === "name" ? context[token.value] : token.value;

    if (typeof v === "undefined") {
        throw Error("symbol not found: " + token.value);
    }

    return v;
}

function evaluateNumeric (context, token) {
    if (token.type !== "number" && token.type !== "name") {
        throw Error(`Invalid numeric value: [${token.value}]`);
    }

    const v = token.type === "name" ? context[token.value] : token.value;

    if (typeof v === "undefined") {
        throw Error("symbol not found: " + token.value);
    }

    return v;
}

function assignValue (context, setContext, name, value) {
    setContext({
        ...context,
        [name]: value,
    });
}

function evaluateExpression (context, t1, op, t3) {
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
    }

    throw Error("Unrecognised operator: " + op);
}