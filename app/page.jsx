'use client'
import React, { useState, useCallback, useEffect } from 'react';
import ContentPage from "./content/ContentPage.jsx";
import SuggestionPanel from './components/suggestionPanel.jsx';
import Graph from "./graph/Graph.jsx";
import * as traversals from './utils/traversalOps.js';
import ToggleSwitch from './components/ToggleSwitch.jsx';
import PageHeader from './content/pageHeader.jsx';
import SaveSurfButton from './components/SaveSurfButton.jsx';
import Collections from './components/Collections.jsx'; // Import the new Collections component
import SavePageModal from './components/SavePageModal.jsx';

const MODEL = 'mistral-7b-instruct';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');
  const [page, setPage] = useState({
    nodes: [{ data: { id: "Start" } }],
    edges: [],
    nodesGenInfo: {},
    edgesGenInfo: {},
    lastSelected: null,
    history: [],
    suggestions: []
  });
  const [savedPages, setSavedPages] = useState([]);

  const updatePageState = useCallback(async (topic, isNewTraversal = false) => {
    try {
      const pageUpdate = isNewTraversal
        ? await traversals.createTraversal(MODEL, topic)
        : await traversals.updatePage(MODEL, topic, page, page.lastSelected);
      setPage(pageUpdate);
    } catch (error) {
      console.error("Error updating page:", error);
    }
  }, [page]);

  const handleSuggestionClick = useCallback((suggestion) => {
    updatePageState(suggestion);
  }, [updatePageState]);

  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    if (searchTopic.trim() !== "Start") {
      let search = searchTopic.trim();
      updatePageState(search, page.nodes.length === 0);
    } else {
      console.log("Please enter a valid topic to start.");
    }
  }, [searchTopic, page.nodes.length, updatePageState]);

  const handleVertexClick = useCallback((topic) => {
    updatePageState(topic);
  }, [updatePageState]);

  const handleToggleChange = useCallback((checked) => {
    setIsDarkMode(checked);
    document.body.classList.toggle('dark-mode', checked);
  }, []);

  const clearAllPages = useCallback(() => {
    setSavedPages([]);
    localStorage.removeItem('savedPages');
    alert('All saved pages have been cleared');
  }, []);

  const handleSavePage = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleSavePageConfirm = useCallback((title, description) => {
    const pageData = { ...page, title, description };
    setSavedPages(prevSavedPages => [...prevSavedPages, pageData]);
    localStorage.setItem('savedPages', JSON.stringify([...savedPages, pageData]));
    alert('Page saved successfully!');
  }, [page, savedPages]);

  const handlePageClick = useCallback((savedPage) => {
    setPage(savedPage);
  }, []);

  useEffect(() => {
    const savedPagesData = localStorage.getItem('savedPages');
    if (savedPagesData) {
      setSavedPages(JSON.parse(savedPagesData));
    }
  }, []);

  return (
    <div id="wholePage" className="flex flex-col h-screen">
      <div id="headerWrapper" className="h-1/4 flex justify-between items-center px-4">
        <div className="w-1/2">
          <PageHeader topic="SURRF" content="A new way to learn, built with perplexity.ai!" />
        </div>
        <div className="w-1/2 flex justify-end items-center">
          <form onSubmit={handleSearchSubmit} className="search-form mr-4">
            <input 
              type="text" 
              value={searchTopic} 
              onChange={(e) => setSearchTopic(e.target.value)} 
              placeholder="Enter a topic" 
              className="search-input"
            />
            <button type="submit" className="search-button">Submit</button>
          </form>
          <SaveSurfButton onSave={handleSavePage} />
        </div>
      </div>

      <div className="flex flex-grow relative">
        <div className="w-full pr-4 flex flex-col items-left">
          {page.lastSelected && (
            <ContentPage 
              topic={page.lastSelected.nodeID} 
              content={page.lastSelected.info} 
            />
          )}
          <Graph data={page} handleClick={handleVertexClick} isDarkMode={isDarkMode} />        </div>
        <div id="sideWrapper">
          <SuggestionPanel 
            suggestions={page.suggestions} 
            onSuggestionClick={handleSuggestionClick} 
          />
          <Collections 
            savedPages={savedPages} 
            onPageClick={handlePageClick}
            onClearAll={clearAllPages}
          />
          <SavePageModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSavePageConfirm}
          />
        </div>
      </div>
      <ToggleSwitch id="darkModeToggle" checked={isDarkMode} onChange={handleToggleChange} />
    </div>
  );
}