import React from 'react';

import './Console.css';

export default function Console (props) {
    const { history, sendCommand } = props;
    const [ input, setInput ] = React.useState("");
    const ref = React.useRef();

    function handleInput () {
        sendCommand(input);
        setInput("");
        setTimeout(() => ref.current.scrollTop = ref.current.scrollHeight, 10);
    }

    return (
        <div className="Console">
            <div className="Console-historyscroller" ref={ref}>
                <ul className="Console-history">
                {
                    history.map(line => {
                        if (line.type === "input") {
                            return <li key={line.id} className="line line-input">> {line.content}</li>;
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
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter") { handleInput(); }
                    }}
                />
                <button onClick={handleInput}>Send</button>
            </div>
        </div>
    );
}