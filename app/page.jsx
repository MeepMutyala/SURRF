// page.js! homepage!
'use client'
import React, { useState } from 'react';
import ContentPage from "./content/ContentPage.jsx";
import Graph from "./graph/Graph.jsx";
import * as traversals from './utils/traversalOps.js';
let model = 'mistral-7b-instruct'

export default function App() {

  // Initialize state to store the page data
  const [page, setPage] = useState({
    nodes: [
      { data: { id: "Georgia Tech" } },
    ],
    edges: [
    ],
    cur: { title: "Georgia Tech", description: "This placeholder"},
    history: ["Georgia Tech"],
  });

  const handleVertexClick = async (topic) => {
    // Update traversal page
    const updatedPage = await traversals.updateTraversalPage(model, topic, page);
    setPage(updatedPage);
  };

  return (
    <div id="wholePage">
      <div id="contentWrapper">
        <ContentPage topic={page.cur.title} content={page.cur.description} />
      </div>
      <Graph data={page} handleClick={handleVertexClick} />
    </div>
  )
};