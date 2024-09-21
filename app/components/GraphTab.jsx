import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

const GraphTab = ({ title, content, onClose, nodeId, cyRef }) => {
  const nodeRef = useRef(null);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (cyRef.current && nodeId) {
      const node = cyRef.current.getElementById(nodeId);
      if (node) {
        const pos = node.renderedPosition();
        setPosition({ x: pos.x, y: pos.y });
      } else {
        // If node doesn't exist, set a default position
        setPosition({ x: 100, y: 100 });
      }
    }
  }, [nodeId, cyRef]);


  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div ref={nodeRef} className="graph-tab p-4 rounded shadow-lg pointer-events-auto resize overflow-auto">
        <div className="graph-tab-header flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm md:text-base lg:text-lg">{title}</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="graph-tab-content max-h-60 overflow-y-auto">
          <p className="text-xs md:text-sm lg:text-base">{content.text}</p>
          <h4 className="font-semibold mt-2 text-xs md:text-sm lg:text-base">Sources:</h4>
          <ul className="list-disc pl-5">
            {content.sources.map((source, index) => (
              <li key={index}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs md:text-sm lg:text-base">{source.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Draggable>
  );
}

export default GraphTab;