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
import Tab from './components/Tab';
import { generateContent } from './utils/perplexityAPI';
import { getRelatedTopics, getSourcesAndLinks } from './utils/exaAPI';
import { setCache, getCache } from './utils/tabCache';

const MODEL = 'mistral-7b-instruct';

export default function App() {

  // consts
  //
    const [analysisResult, setAnalysisResult] = useState({ title: '', content: '' });
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchTopic, setSearchTopic] = useState('');
    const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);
    const [tabs, setTabs] = useState([]);

    
  // Page Setter- refresh the whole GRAPH using a new graph object, 
  //
    const [page, setPage] = useState({
      nodes: [{ data: { id: "Start" } }],
      edges: [],
      clicked: null,
      lastClicked: null,
      history: [],
      suggestions: []
    });
    const [savedPages, setSavedPages] = useState([]);

  // Tab Setter and logic- explanatory
  //
  const openTab = (title, content) => {
    setTabs((prevTabs) => {
      const existingTabIndex = prevTabs.findIndex(tab => tab.title === title);
      if (existingTabIndex !== -1) {
        // If the tab already exists, move it to the end of the array
        const updatedTabs = prevTabs.filter((_, index) => index !== existingTabIndex);
        return [...updatedTabs, { title, content }];
      }
      // If we have 3 tabs, remove the oldest one
      if (prevTabs.length >= 3) {
        return [...prevTabs.slice(1), { title, content }];
      }
      return [...prevTabs, { title, content }];
    });
  };

  const closeTab = (index) => {
    setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
  };

  // Page update- update the whole page state (use this often) 
  //
    const updatePageState = useCallback(async (topic, isNewTraversal = false) => {
      try {
        const pageUpdate = isNewTraversal
          ? await traversals.createTraversal(topic)
          : await traversals.updatePage(topic, page);
        setPage(pageUpdate);
      } catch (error) {
        console.error("Error updating page:", error);
      }
    }, [page]);


  // Analysis Panel Toggler Function
  //
    const handleToggleAnalysisPanel = useCallback(() => {
      setIsAnalysisPanelOpen(!isAnalysisPanelOpen);
    }, [isAnalysisPanelOpen]);


  // Delete Mode Toggler Function && Logic Function
  //
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
        // Remove the corresponding tab
        setTabs(prevTabs => prevTabs.filter(tab => tab.title !== nodeId));
        // Exit delete mode
        setIsDeleteMode(false);
      }
    }, [isDeleteMode]);

  // Search/Surf/Query/Explore/Research (keywords for ctrl-f) functionality
  //
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

    // on vertex click
    const handleVertexClick = useCallback(async (topic) => {
      try {
        const cachedContent = getCache(topic);
        if (cachedContent) {
          openTab(topic, cachedContent);
          return;
        }
    
        const [content, sourcesAndLinks] = await Promise.all([
          generateContent(MODEL, topic),
          getSourcesAndLinks(topic)
        ]);
    
        const tabContent = {
          text: content,
          sources: sourcesAndLinks
        };
    
        setCache(topic, tabContent);
        openTab(topic, tabContent);
      } catch (error) {
        console.error("Error updating page:", error);
      }
    }, []);

  // to be implemented
  // const handleRefactor = useCallback(async () => {
  //   try {
  //     const pageUpdate = await analysisOps.refactor(page);
  //     setPage(pageUpdate);
  //   } catch (error) {
  //     console.error("Error updating page:", error);
  //   }
  // }, [page]);

  // dark mode lol
  //
    const handleToggleChange = useCallback((checked) => {
      setIsDarkMode(checked);
      document.body.classList.toggle('dark-mode', checked);
    }, []);

  //
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
          <div className="tabs-container">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                title={tab.title}
                content={tab.content}
                onClose={() => closeTab(index)}
              />
            ))}
          </div>
          
          <div className="analysis-buttons">
          <button onClick={handleToggleAnalysisPanel}>
          {isAnalysisPanelOpen ? 'Close' : 'Analysis Options'}
          </button>
          {isAnalysisPanelOpen && (
            <div>
              <button onClick={handleGraphAnalysis}>Graph Analysis</button>
              <button onClick={handleNodeAnalysis}>Node Analysis</button>
              <button onClick={handleEdgeAnalysis}>Edge Analysis</button>
               <button>Refactor Graph</button> {/*onClick={handleRefactor}*/}
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