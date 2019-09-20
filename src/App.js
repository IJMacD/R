import React from 'react';
import './App.css';

import Console from './Console';
import Variables from './Variables';
import Graph from './Graph';

import interpreter from './interpreter';
import { Matrix } from './interpreter/matrix';

const STATE_KEY = "R_VARIABLES";

function App() {
  const [ history , setHistory ] = React.useState([]);
  const [ context , setContext ] = React.useState(retrieveState(STATE_KEY));

  function setVariables (variables) {
    setContext(variables);
    persistState(STATE_KEY, variables);
  }

  return (
    <div className="App">
      <div className="App-Variables">
        <Variables variables={context} setVariables={setVariables} />
      </div>
      <div className="App-Console">
        <Console history={history} sendCommand={input => {
          const newHistory = [
            ...history,
            { id: history.length + 1, type: "input", content: input }
          ];
          try {
            const output = formatOutput(interpreter(input, context, setVariables));
            let i = 2;
            for (const content of output) {
              newHistory.push({ id: history.length + (i++), type: "output", content });
            }
          } catch (e) {
            newHistory.push({ id: history.length + 2, type: "error", content: e.message });
          }
          setHistory(newHistory);
        }} performReplacement={true} />
      </div>
      <div className="App-Graph">
        <Graph />
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

/**
 *
 * @param {import('./interpreter').ValueType} value
 * @returns {string[]}
 */
function formatOutput (value) {
  if (value instanceof Matrix) {
    return value.toString().split("\n");
  }

  return [JSON.stringify(value)];
}

export default App;
