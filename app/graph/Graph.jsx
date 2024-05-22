import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import "./Graph.css";

cytoscape.use(fcose);

export default function Graph({ graphChange }) {
    const FCOSE_LAYOUT = { 
        name: 'fcose',
        quality: 'proof',
        randomize: false,
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
        // Separation amount between nodes
        nodeSeparation: 10,
        // Ideal edge (non nested) length
        idealEdgeLength: 10,
        // Divisor to compute edge forces
        edgeElasticity: 0.95,
        // Place two nodes relatively in vertical/horizontal direction
        // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
    };

    const GRAPH_STYLESHEET = [
        {
            selector: 'node',
            style: {
                label: 'data(id)',
                'font-size': '4rem',
                'font-family': 'Montserrat',
                'text-valign': 'center',
                'text-halign': 'center',
                'background-opacity': '0',
                'border-width': '1rem',
                'border-color': 'black',
                'text-wrap': 'wrap',
            },
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'width': '1rem',
                'line-color': 'black',
            },
        },
    ];

    const data = { nodes: [{ data: { id: "Georgia Tech" } }] };

    return (
        <CytoscapeComponent
            id="journeyPanel"
            elements={CytoscapeComponent.normalizeElements(data)}
            layout={FCOSE_LAYOUT} stylesheet={GRAPH_STYLESHEET} 
            cy={(cy) => { 
                cy.unbind("onetap");
                cy.unbind("dbltap");
                cy.on("onetap", "node", (evt) => {
                    console.log("Adding " + evt.target.data("id"));
                    graphChange(cy, "add", evt.target);
                });
                cy.on("add", "node", _evt => {
                    cy.layout(FCOSE_LAYOUT).run();
                    cy.fit();
                    cy.center();
                });
                cy.on("dbltap", "node", (evt) => {
                    console.log("Removing " + evt.target.data("id"));
                    graphChange(cy, "remove", evt.target);
                });
            }}></CytoscapeComponent>
    );
  }