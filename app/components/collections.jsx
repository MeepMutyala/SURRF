import React from 'react';
import { FaTrash } from 'react-icons/fa';

const Collections = ({ savedPages, onPageClick, onClearAll, onDeletePage }) => {
  return (
    <div className="collections-container">
      {savedPages.map((page, index) => (
        <div key={index} className="collection-item">
          <div 
            className="collection-content"
            onClick={() => onPageClick(page)}
          >
            <h3>{page.title}</h3>
            <p>{page.description}</p>
          </div>
          <button 
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDeletePage(index);
            }}
          >
            <FaTrash />
          </button>
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