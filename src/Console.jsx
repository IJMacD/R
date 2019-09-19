import React from 'react';

import './Console.css';

let scrollback = 0;

export default function Console (props) {
    const { history, sendCommand, performReplacement } = props;
    const [ input, setInput ] = React.useState("");
    const ref = React.useRef();
    const inputRef = React.useRef();

    function handleInput (e) {
        let { value } = e.target;

        if (performReplacement) {
            value = value
                .replace("*","×")
                .replace("/","÷")
                .replace("!=", "≠")
                .replace("!=", "≠")
                .replace("<=", "⩽")
                .replace(">=", "⩾")
                .replace("->", "→")
                .replace("<-", "←");
        }

        setInput(value);
    }

    function handleSend () {
        sendCommand(input);
        setInput("");
        setTimeout(() => typeof ref.current !== "undefined" && (ref.current.scrollTop = ref.current.scrollHeight), 10);
        scrollback = 0;
    }

    function handleScrollback (down=false) {
        const inputs = history.filter(h => h.type === "input");

        if (inputs.length === 0) return;

        if (down && scrollback > 1) {
            scrollback--;
        }
        else if (!down && scrollback < inputs.length) {
            scrollback++;
        }

        setInput(inputs[inputs.length - scrollback].content);
    }

    return (
        <div className="Console" onClick={() => inputRef.current && document.getSelection().isCollapsed && inputRef.current.focus()}>
            <div className="Console-historyscroller" ref={ref}>
                <ul className="Console-history">
                {
                    history.map(line => {
                        if (line.type === "input") {
                            return <li key={line.id} className="line line-input">{line.content}</li>;
                        }
                        return <li key={line.id} className={`line line-${line.type}`}>{line.content}</li>;
                    })
                }
                </ul>
            </div>
            <div className="Console-inputline">
                <span className="Console-prompt">></span>
                <input
                    value={input}
                    className="Console-input"
                    autoFocus
                    ref={inputRef}
                    onChange={handleInput}
                    onKeyDown={e => {
                        if (e.key === "Enter") { handleSend(); }
                        else if (e.key === "ArrowUp") { handleScrollback(); e.preventDefault(); }
                        else if (e.key === "ArrowDown") { handleScrollback(true); e.preventDefault(); }
                    }}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}