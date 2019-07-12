import React from 'react';

import './Variables.css';

export default function Variables (props) {
    const { variables } = props;

    return (
        <table className="Variables">
            <thead>
                <tr><th>Name</th><th>Value</th></tr>
            </thead>
            <tbody>
            {
                Object.keys(variables).map(name => <tr key={name}><td>{name}</td><td>{JSON.stringify(variables[name])}</td></tr>)
            }
            </tbody>
        </table>
    );
}