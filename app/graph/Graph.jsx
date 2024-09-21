import React, { useRef, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import { getGraphStylesheet } from './GraphStyles';
import GraphTab from '../components/GraphTab';

cytoscape.use(fcose);

export default function Graph({ data, handleClick, isDarkMode, isDeleteMode, onNodeDelete, tabs = [], onCloseTab, searchTopic, setSearchTopic, handleSearchSubmit, nodeId }) {
  const cyRef = useRef(null);

  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      cy.on('mouseout', 'node', (evt) => {
        const node = evt.target;
        node.removeStyle('background-color');
        node.removeStyle('border-color');
        node.removeStyle('transition-property');
        node.removeStyle('transition-duration');
      });

      if (nodeId) {
        const node = cy.getElementById(nodeId);
        if (node && node.isNode()) {
          const pos = node.renderedPosition();
          cy.center(node);
        }
      }
    }
  }, [cyRef, nodeId]);
  
    const elements = [
      ...data.nodes.map(node => ({
        data: { id: node.data.id, label: node.data.id },
        classes: data.suggestions.includes(node.data.id) ? 'suggestion' : ''
      })),
      ...data.edges.map(edge => ({
        data: { source: edge.data.source, target: edge.data.target },
        classes: data.suggestions.includes(edge.data.target) ? 'suggestion-edge' : ''
      })),
      ...data.suggestions.map(suggestion => ({
        data: { id: suggestion, label: suggestion },
        classes: 'suggestion'
      }))
    ];
  
    const handleLocalSearchSubmit = (e) => {
      e.preventDefault();
      handleSearchSubmit(e);
      setSearchTopic('');
    };
  
    return (
      <div className="graph-container relative w-full h-full">
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '100%' }}
          stylesheet={getGraphStylesheet(isDarkMode)}
          cy={(cy) => { cyRef.current = cy; }}
        />
        <div className="graph-overlay absolute top-4 left-4">
          <form onSubmit={handleLocalSearchSubmit} className="graph-search-form">
            <input 
              type="text" 
              value={searchTopic} 
              onChange={(e) => setSearchTopic(e.target.value)} 
              placeholder="Enter a topic" 
              className="graph-search-input"
            />
            <button type="submit" className="graph-search-button">Search</button>
          </form>
        </div>
        {tabs && tabs.length > 0 && (
  <div className="graph-tabs-container absolute inset-0 pointer-events-none">
    {tabs.map((tab, index) => (
      <GraphTab
        key={index}
        title={tab.title}
        content={tab.content}
        onClose={() => onCloseTab(index)}
        nodeId={data.nodes.find(node => node.data.id === tab.title)?.data.id}
        cyRef={cyRef}
      />
    ))}
  </div>
)}

      </div>
    );
  }