// page.js! homepage!
'use client'
import React, { useState } from 'react';
import Vertex from './vertex';
import * as traversals from './traversalOps.js';
let useModel = 'mistral-7b-instruct'

function App() {

  const [history, setHistory] = useState([]);

  // Initialize state to store the page data
  const [page, setPage] = useState({
    left: { topic: 'georgia tech', description: '' },
    right: { topic: 'penguins', description: '' },
    main: { topic: 'cupcakes', description: '' },
    backward: { topic: 'old', description: '' },
  });

  const handleVertexClick = async (pos, topic) => {
    // Add the topic to history if it's not already there
    if (!history.includes(topic)) {
      setHistory(prevHistory => [...prevHistory, topic]);
    }
    console.log(history)

    // Pass updated history to backend
    const updatedPage = await traversals.updateTraversalPage(useModel, topic, page.backward.topic, history);
    setPage(updatedPage);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(20,20,97,1) 100%)' }}>
      <div style={{ position: 'absolute', top: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}> 
        <Vertex
          title={page.left.topic} // this is where I would update with page.left.topic
          description="Left"
          pos="left"
          style={{ left: 0 }}
          handleClick={handleVertexClick}>
          </Vertex>
        
        <Vertex
          title=""
          description=""
          pos="center"
          style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
          //handleClick={handleVertexClick}
        />
        <Vertex
          title={page.right.topic}// this is where I would update with page.right.topic
          description="Right"
          pos="right"
          style={{ position: 'absolute', top: 0, right: 0 }}
          handleClick={handleVertexClick}
        />
      </div>
      <div>
      <Vertex
          title={page.main.topic} // this is where I would update with page.main.topic
          description={page.main.description}
          pos="main"
        />
      </div> 
      <div>
      <Vertex
          title={page.backward.topic}// this is where I would update with page.backward.topic
          description=""
          pos="back"
          
        />
      </div> 
   </div> 
    
  );
}

export default App;