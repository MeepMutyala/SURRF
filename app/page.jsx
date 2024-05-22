// page.js! homepage!
'use client'
import React, { useState } from 'react';
import ContentPage from "./content/ContentPage.jsx";
import Graph from "./graph/Graph.jsx";
import { addGraphNode, removeGraphNode } from './utils/graphUtils.js';

export default function App() {

  // Initialize state to store the page data
  const [page, setPage] = useState({
    cur: { title: "Georgia Tech", description: "This placeholder"},
    history: ["Georgia Tech"],
  });

  const graphChange = async (cy, action, label) => {
    let updatedPage = page;
    // Update traversal page
    if (action === "add") {
      updatedPage = await addGraphNode(cy, label, page);
    } else if (action === "remove") {
      updatedPage = removeGraphNode(cy, label, page);
    }
    setPage(updatedPage);
  };

  return (
    <div id="wholePage">
      <div id="contentWrapper">
        <ContentPage topic={page.cur.title} content={page.cur.description} />
      </div>
      <Graph graphChange={graphChange} />
    </div>
  )
};