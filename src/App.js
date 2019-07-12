import React from 'react';
import './App.css';

import Console from './Console';
import Variables from './Variables';
import Graph from './Graph';

import interpreter from './interpreter';

const STATE_KEY = "R_VARIABLES";

function App() {
  const [ history , setHistory ] = React.useState([]);
  const [ context , setContext ] = React.useState(retrieveState(STATE_KEY));

  return (
    <div className="App">
      <div className="panel">
        <div style={{ flex: 4 }}>
          <Console history={history} sendCommand={input => {
            const newHistory = [
              ...history,
              { id: history.length + 1, type: "input", content: input }
            ];
            try {
              const output = interpreter(input, context, (context) => { setContext(context); persistState(STATE_KEY, context); });
              if (output) {
                newHistory.push({ id: history.length + 2, type: "output", content: output });
              }
            } catch (e) {
              newHistory.push({ id: history.length + 2, type: "error", content: e.message });
            }
            setHistory(newHistory);
          }} />
        </div>
        <div className="panel panel-vertical">
          <Variables variables={context} />
          <Graph />
        </div>
      </div>
    </div>
  );
}

function persistState (key, state) {
  localStorage.setItem(key, JSON.stringify(state));
}

function retrieveState (key, defaultState={}) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : defaultState;
  } catch (e) {
    return defaultState;
  }
}

export default App;
