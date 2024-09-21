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
import GraphTab from './components/GraphTab';
// Remove the import for Tab
import * as perplexityAPI from './utils/perplexityAPI';
import * as exaAPI from './utils/exaAPI';
import { setCache, getCache } from './utils/tabCache';
import CenteredSearch from './components/CenteredSearch.jsx';
import SidePanel from './components/SidePanel.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';


const CONTENT_MODEL = 'llama-3.1-sonar-large-128k-online';
const SUGGESTION_MODEL = 'llama-3.1-sonar-small-128k-chat';


export default function App() {

  // consts
  //
    const [analysisResult, setAnalysisResult] = useState({ title: '', content: '' });
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchTopic, setSearchTopic] = useState('');
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    const [isAnalysisPanelOpen, setIsAnalysisPanelOpen] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [savedPages, setSavedPages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    
    const [isInitialSearch, setIsInitialSearch] = useState(true);
    const [page, setPage] = useState({
      nodes: [{ data: { id: 'surfing' } }],
      edges: [],
      clicked: null,
      lastClicked: { data: { id: 'surfing' } },
      history: ['surfing'],
      suggestions: []
    });

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

    // on vertex click
    const handleVertexClick = useCallback(async (topic, isSuggestion = false) => {
      setSearchTopic(topic);
      setIsLoading(true);
      try {
        let newPage;
        if (isSuggestion) {
          newPage = await traversals.updatePage(topic, page);
        } else {
          newPage = { ...page };
        }
    
        const cachedContent = getCache(topic);
        if (cachedContent) {
          openTab(topic, cachedContent);
        } else {
          const [content, sourcesAndLinks] = await Promise.all([
            perplexityAPI.generateContent(CONTENT_MODEL, topic),
            exaAPI.getSourcesAndLinks(topic)
          ]);
          const tabContent = { text: content, sources: sourcesAndLinks };
          setCache(topic, tabContent);
          openTab(topic, tabContent);
        }
    
        // Generate new suggestions
        const newSuggestions = await perplexityAPI.getKMostRelatedTopics(SUGGESTION_MODEL, 2, topic);
        setPage({
          ...newPage,
          lastClicked: { data: { id: topic } },
          suggestions: newSuggestions
        });
        setSearchTopic('');
      } catch (error) {
        console.error("Error updating page:", error);
      } finally {
        setIsLoading(false);
      }
    }, [page, openTab, setSearchTopic]);

  // Search/Surf/Query/Explore/Research (keywords for ctrl-f) functionality
  //
  const handleSearchSubmit = useCallback(async (event) => {
    event.preventDefault();
    const topic = searchTopic.trim();
    if (topic && topic !== "Start") {
      setIsLoading(true);
      try {
        const [newTraversal, content, sourcesAndLinks, suggestions] = await Promise.all([
          traversals.createTraversal(topic),
          perplexityAPI.generateContent(CONTENT_MODEL, topic),
          exaAPI.getSourcesAndLinks(topic),
          perplexityAPI.getKMostRelatedTopics(SUGGESTION_MODEL, 2, topic)
        ]);
        const tabContent = { text: content, sources: sourcesAndLinks };
        openTab(topic, tabContent);
        setPage({
          ...newTraversal,
          suggestions: suggestions
        });
        setIsInitialSearch(false);
      } catch (error) {
        console.error("Error creating traversal:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [searchTopic, openTab]);

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
    setSavedPages(prevSavedPages => {
      const newSavedPages = [...prevSavedPages, pageData];
      localStorage.setItem('savedPages', JSON.stringify(newSavedPages));
      return newSavedPages;
    });
    alert('Page saved successfully!');
  }, [page]);

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
      {isInitialSearch ? (
        <CenteredSearch
          onSubmit={handleSearchSubmit}
          searchTopic={searchTopic}
          setSearchTopic={setSearchTopic}
        />
      ) : (
        <>
          <div id="headerWrapper" className="flex justify-between items-center px-4">
            <div className="w-1/2">
              <PageHeader topic={page.lastClicked?.data.id || "Welcome to Surf!"} />
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
              <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="toggle-panel-button">
                {isSidePanelOpen ? '>' : '<'}
              </button>
            </div>
          </div>
          
          <div className="flex flex-grow relative overflow-hidden">
            <div className="w-full pr-4 flex flex-col items-center justify-center">
            {isLoading ? (
  <div className="w-full h-full flex items-center justify-center">
    <LoadingSpinner />
  </div>
) : (
  <Graph 
  data={page} 
  handleClick={handleVertexClick} 
  isDarkMode={isDarkMode}
  isDeleteMode={isDeleteMode}
  onNodeDelete={handleNodeDelete}
  tabs={tabs}
  onCloseTab={closeTab}
  searchTopic={searchTopic}
  setSearchTopic={setSearchTopic}
  handleSearchSubmit={handleSearchSubmit}
nodeId={page.lastClicked?.data.id}
/>

)}
            </div>
            <SidePanel isOpen={isSidePanelOpen} onClose={() => setIsSidePanelOpen(false)}>
              {/* SidePanel content remains the same */}
            </SidePanel>
          </div>
          <ToggleSwitch id="darkModeToggle" checked={isDarkMode} onChange={handleToggleChange} />
        </>
      )}
    </div>
  );
}