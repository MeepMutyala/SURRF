import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import { FCOSE_LAYOUT, getGraphStylesheet } from './GraphStyles';

cytoscape.use(fcose);

export default function Graph({data, handleClick, isDarkMode}) {
    return (
        <CytoscapeComponent
            id="graphStyle"
            elements={CytoscapeComponent.normalizeElements(data)} 
            layout={FCOSE_LAYOUT} 
            stylesheet={getGraphStylesheet(isDarkMode)} 
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
            }}
        />
    );
}