import React from 'react';
import './App.css';

import Console from './Console';
import Variables from './Variables';
import Graph from './Graph';

import interpreter from './interpreter';

function App() {
  const [ history , setHistory ] = React.useState([]);
  const [ context , setContext ] = React.useState({});

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
              const output = interpreter(input, context, setContext);
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

export default App;
