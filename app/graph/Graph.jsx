import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import { FCOSE_LAYOUT, getGraphStylesheet } from './GraphStyles';

cytoscape.use(fcose);

// Define the highlight color
const HIGHLIGHT_COLOR = '#30C7DE'; // This is the light blue color from your CSS variables

export default function Graph({ data, handleClick, isDarkMode, isDeleteMode, onNodeDelete }) {
    const cyRef = useRef(null);

    useEffect(() => {
        if (cyRef.current) {
            const cy = cyRef.current;

            cy.unbind("tap");                           
            cy.on("tap", "node", (evt) => {             // this is on node click essentially
                const nodeId = evt.target.data("id");
                if (isDeleteMode) {
                    onNodeDelete(nodeId);
                } else {
                    console.log(nodeId);
                    handleClick(nodeId);
                }
            });

            cy.on("add", "node", _evt => {
                cy.layout(FCOSE_LAYOUT).run();
                cy.fit();
                cy.center();
            });

            cy.on('mouseover', 'node', (evt) => {
                const node = evt.target;
                if (isDeleteMode) {
                    node.style({
                        'background-color': '#ff0000',
                        'border-color': '#ff0000'
                    });
                } else {
                    node.style({
                        'background-color': HIGHLIGHT_COLOR,
                        'border-color': HIGHLIGHT_COLOR,
                        'transition-property': 'background-color, border-color',
                        'transition-duration': '0.3s'
                    });
                }
            });

            cy.on('mouseout', 'node', (evt) => {
                const node = evt.target;
                node.removeStyle('background-color');
                node.removeStyle('border-color');
                node.removeStyle('transition-property');
                node.removeStyle('transition-duration');
            });
        }
    }, [handleClick, isDeleteMode, onNodeDelete]);

    return (
        <CytoscapeComponent
            id="graphStyle"
            elements={CytoscapeComponent.normalizeElements(data)} 
            layout={FCOSE_LAYOUT} 
            stylesheet={getGraphStylesheet(isDarkMode)} 
            cy={(cy) => { cyRef.current = cy; }}
        />
    );
}