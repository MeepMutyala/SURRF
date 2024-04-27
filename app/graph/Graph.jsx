import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import { FCOSE_LAYOUT, GRAPH_STYLESHEET } from './GraphStyles';
import "./Graph.css";

cytoscape.use(fcose);

export default function Graph({data, handleClick}) {
    return (
        <CytoscapeComponent
            id="journeyPanel"
            elements={CytoscapeComponent.normalizeElements(data)} 
            layout={FCOSE_LAYOUT} stylesheet={GRAPH_STYLESHEET} 
            cy={(cy) => { 
                cy.unbind("tap");
                cy.on("tap", "node", (evt) => {
                    console.log(evt.target.data("id"));
                    handleClick(evt.target.data("id"));
                });
                cy.on("add", "node", _evt => {
                    cy.layout(FCOSE_LAYOUT).run();
                    cy.fit();
                    cy.center();
                })
            }}></CytoscapeComponent>
    );
  }