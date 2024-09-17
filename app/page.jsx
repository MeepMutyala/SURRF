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
import SavePageModal from './components/savePageModal.jsx';
import * as analysisOps from './utils/analysisOps.js';
import AnalysisPanel from './components/AnalysisPanel.jsx';

const MODEL = 'mistral-7b-instruct';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState({ title: '', content: '' });
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');
  const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);


  const [page, setPage] = useState({
    nodes: [{ data: { id: "Start" } }],
    edges: [],
    clicked: null,
    lastClicked: null,
    history: [],
    suggestions: []
  });

  const handleToggleAnalysisPanel = useCallback(() => {
    setIsAnalysisPanelOpen(!isAnalysisPanelOpen);
  }, [isAnalysisPanelOpen]);

  const [savedPages, setSavedPages] = useState([]);

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };
  
  const handleNodeDelete = useCallback((nodeId) => {
    if (isDeleteMode) {
      // Remove the node
      setPage(prevPage => {
        const newNodes = prevPage.nodes.filter(node => node.data.id !== nodeId);
        const newEdges = prevPage.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
        return {
          ...prevPage,
          nodes: newNodes,
          edges: newEdges,
        };
      });
      // Exit delete mode
      setIsDeleteMode(false);
    }
  }, [isDeleteMode]);

  const updatePageState = useCallback(async (topic, isNewTraversal = false) => {
    try {
      const pageUpdate = isNewTraversal
        ? await traversals.createTraversal(MODEL, topic)
        : await traversals.updatePage(MODEL, topic, page);
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
    if (searchTopic.trim() && searchTopic.trim() !== "Start") {
      updatePageState(searchTopic, page.history.length === 0);
    } else {
      console.log("Please enter a valid topic to start.");
    }
  }, [searchTopic, page.history.length, updatePageState]);

  const handleRefactor = useCallback(async () => {
    try {
      const pageUpdate = await analysisOps.refactor(page);
      setPage(pageUpdate);
    } catch (error) {
      console.error("Error updating page:", error);
    }
  }, [page]);

  const handleVertexClick = useCallback(async (topic) => {
    try {
      const pageUpdate = await traversals.updatePage(MODEL, topic, page);
      console.log(JSON.stringify(pageUpdate))
      setPage(pageUpdate);
    } catch (error) {
      console.error("Error updating page:", error);
    }
  }, [page]);

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

  const handleDeletePage = useCallback((indexToDelete) => {
    setSavedPages(prevPages => {
      const newPages = prevPages.filter((_, index) => index !== indexToDelete);
      localStorage.setItem('savedPages', JSON.stringify(newPages));
      return newPages;
    });
  }, []);

  useEffect(() => {
    const savedPagesData = localStorage.getItem('savedPages');
    if (savedPagesData) {
      setSavedPages(JSON.parse(savedPagesData));
    }
  }, []);

  const handleGraphAnalysis = useCallback(async () => {
    const result = await analysisOps.graphAnalysis(
      JSON.stringify(page.nodes),
      JSON.stringify(page.edges),
      JSON.stringify(page.history)
    );
    setAnalysisResult({ title: 'Graph Analysis', content: result });
  }, [page]);

  const handleNodeAnalysis = useCallback(async () => {
    const result = await analysisOps.nodeAnalysis(
      JSON.stringify(page.nodes),
      JSON.stringify(page.edges),
      JSON.stringify(page.history)
    );
    setAnalysisResult({ title: 'Node Analysis', content: result });
  }, [page]);

  const handleEdgeAnalysis = useCallback(async () => {
    const result = await analysisOps.edgeAnalysis(
      JSON.stringify(page.nodes),
      JSON.stringify(page.edges),
      JSON.stringify(page.history)
    );
    setAnalysisResult({ title: 'Edge Analysis', content: result });
  }, [page]);

  return (
    <div id="wholePage" className="flex flex-col h-screen">
      {!page.clicked && (
      <div id="headerWrapper" className="h-1/4 flex justify-between items-center px-4">
        <div className="w-1/2">
          <PageHeader topic="Welcome to Surf!" />
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
        </div>
      </div>
      )}

      <div className="flex flex-grow relative overflow-hidden">
        <div className="w-full pr-4 flex flex-col items-left">
          {page.clicked && (
            <div>
            <ContentPage 
              topic={page.clicked.nodeID} 
              content={page.clicked.info} 
            />
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
            </div>
          )}
          <Graph 
            data={page} 
            handleClick={handleVertexClick} 
            isDarkMode={isDarkMode}
            isDeleteMode={isDeleteMode}
            onNodeDelete={handleNodeDelete}
          />          
          <div className="analysis-buttons">
          <button onClick={handleToggleAnalysisPanel}>
          {isAnalysisPanelOpen ? 'Close' : 'Analysis Options'}
          </button>
          {isAnalysisPanelOpen && (
            <div>
              <button onClick={handleGraphAnalysis}>Graph Analysis</button>
              <button onClick={handleNodeAnalysis}>Node Analysis</button>
              <button onClick={handleEdgeAnalysis}>Edge Analysis</button>
              <button onClick={handleRefactor}>Refactor Graph</button>
            </div>
          )}
          </div>
          </div>
        <div id="sideWrapper">
          <SuggestionPanel 
            suggestions={page.suggestions} 
            onSuggestionClick={handleSuggestionClick} 
          />
          <button 
            onClick={toggleDeleteMode}
            className={`delete-mode-button ${isDeleteMode ? 'active' : ''}`}>
            {isDeleteMode ? 'Exit Delete Mode' : 'Enter Delete Mode'}
          </button>
          <AnalysisPanel 
            title={analysisResult.title}
            content={analysisResult.content}
          />
          
          <Collections 
            savedPages={savedPages} 
            onPageClick={handlePageClick}
            onClearAll={clearAllPages}
            onDeletePage={handleDeletePage}
          />
          <SavePageModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSavePageConfirm} 
          />
          <SaveSurfButton onSave={handleSavePage} />
        </div>
      </div>
      <ToggleSwitch id="darkModeToggle" checked={isDarkMode} onChange={handleToggleChange} />
    </div>
  );
}