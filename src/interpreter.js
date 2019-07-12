/**
 *
 * @param {string} command
 * @param {{ [name: string]: any }} context
 * @param {({ [name: string]: any }) => void} setContext
 */
export default function interpreter (command, context, setContext) {
    const stringMatch = /^"([^"]*)"$/.exec(command)
    if (stringMatch) {
        return JSON.stringify(stringMatch[1]);
    }

    const assignLeftStringMatch = /^([a-z][a-z0-9_]*) <- "([^"]*)"$/.exec(command)
    if (assignLeftStringMatch) {
        setContext({
            ...context,
            [assignLeftStringMatch[1]]: assignLeftStringMatch[2],
        });
        return;
    }

    const assignRightStringMatch = /^"([^"]*)" -> ([a-z][a-z0-9_]*)$/.exec(command)
    if (assignRightStringMatch) {
        setContext({
            ...context,
            [assignRightStringMatch[2]]: assignRightStringMatch[1],
        });
        return;
    }

    const assignLeftNumberMatch = /^([a-z][a-z0-9_]*) <- ([0-9]+(?:\.[0-9]+)?)$/.exec(command)
    if (assignLeftNumberMatch) {
        setContext({
            ...context,
            [assignLeftNumberMatch[1]]: +assignLeftNumberMatch[2],
        });
        return;
    }

    const assignRightNumberMatch = /^([0-9]+(?:\.[0-9]+)?) -> ([a-z][a-z0-9_]*)$/.exec(command)
    if (assignRightNumberMatch) {
        setContext({
            ...context,
            [assignRightNumberMatch[2]]: +assignRightNumberMatch[1],
        });
        return;
    }

    if (command in context) {
        return JSON.stringify(context[command]);
    }

    if (command.length === 0) {
        return;
    }

    throw Error(`Command not recognised: '${command}'`);
}