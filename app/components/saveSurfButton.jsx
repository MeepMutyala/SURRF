import React from 'react';

const SaveSurfButton = ({ onSave }) => {
  return (
    <button 
      onClick={onSave} 
      className="search-button"
    >
      Save
    </button>
  );
};

export default SaveSurfButton;