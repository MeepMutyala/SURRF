import React from 'react';

const Collections = ({ savedPages, onPageClick, onClearAll }) => {
  return (
    <div className="collections-container">
      {savedPages.map((page, index) => (
        <div 
          key={index} 
          className="collection-item" 
          onClick={() => onPageClick(page)}
        >
          <h3>{page.title}</h3>
          <p>{page.description}</p>
        </div>
      ))}
      {savedPages.length > 0 && (
        <button className="clear-all-button" onClick={onClearAll}>
          Clear All
        </button>
      )}
    </div>
  );
};

export default Collections;