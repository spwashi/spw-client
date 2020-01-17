import React from 'react';

export function AnchorDisplay(props) {
    const { anchors, concepts } = props;
    return <nav>
        <header>
            Anchors
        </header>
        <ul>
            {
                [...anchors].map(anchor => (
                    <li key={`${anchor}`}>
                        <a className="mx-2"
                           onClick={() => console.log(concepts.get(anchor))}>{`${anchor}`}</a>
                    </li>
                ))
            }
        </ul>
    </nav>;
}
