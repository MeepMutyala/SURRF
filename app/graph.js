import { NetworkGraph } from 'react-vis-network-graph';

import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import { FCOSE_LAYOUT, GRAPH_STYLESHEET } from './styles/GraphStyles';

cytoscape.use(fcose)

export default function Graph({data, handleClick}) {
    // const [graphElements, setGraphElements] = useState<cytoscape.ElementDefinition[]>([]);
  
    // const getElements = useCallback(async () => {
    //   console.log(process.env)
    //   if (process.env.REACT_APP_ELEMENTS_FILE_PATH) {
    //     setGraphElements(await (await fetch(process.env.REACT_APP_ELEMENTS_FILE_PATH)).json());
    //   }
      
    // }, []);
    // useEffect(() => {
    //   getElements()
    // }, [getElements])
    return (
        <CytoscapeComponent style={{ width: "100vw", height: "100vh", border: "1px solid black" }} elements={CytoscapeComponent.normalizeElements(data)} layout={FCOSE_LAYOUT} stylesheet={GRAPH_STYLESHEET} cy={(cy) => { 
            cy.on('tap', 'node', (evt) => {
                console.log(evt.target.data('label'));
            handleClick(0, evt.target.data('label'));
            });
            cy.on('add', 'node', _evt => {
          cy.layout(FCOSE_LAYOUT).run()
          cy.fit()
          cy.center()
        })}}></CytoscapeComponent>
    );
  }