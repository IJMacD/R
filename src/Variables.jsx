import React from 'react';

import './Variables.css';

export default function Variables (props) {
    const { variables, setVariables } = props;
    const [ inputName, setInputName ] = React.useState("");
    const [ inputValue, setInputValue ] = React.useState("");
    const ref = React.useRef();

    return (
        <form onSubmit={e => {
            let v;
            try {
                v = JSON.parse(inputValue);
            } catch (e) {
                v = inputValue;
            }
            setVariables({ ...variables, [inputName]: v });
            setInputName("");
            setInputValue("");
            if (typeof ref !== "undefined" && typeof ref.current !== "undefined") ref.current.focus();
            e.preventDefault();
        }}>
            <table className="Variables">
                <thead>
                    <tr><th>Name</th><th>Value</th></tr>
                </thead>
                <tbody>
                {
                    Object.keys(variables).map(name => {
                        return (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>{JSON.stringify(variables[name])}</td>
                                <td><button type="button" onClick={() => setVariables(removeVariable(variables, name)) }>x</button></td>
                            </tr>
                        );
                    })
                }
                <tr>
                        <td><input ref={ref} value={inputName} onChange={e => setInputName(e.target.value)} placeholder="Name"/></td>
                        <td><input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Value"/></td>
                        <td><button type="submit">+</button></td>
                </tr>
                </tbody>
            </table>
        </form>
    );
}

function removeVariable (variables, name) {
    const { [name]: toRemove, ...keep } = variables;
    return keep;
}