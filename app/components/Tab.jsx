import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { IoMdClose } from 'react-icons/io';

const Tab = ({ title, content, onClose }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".tab-header">
      <div ref={nodeRef} className="tab">
        <div className="tab-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-button">
            <IoMdClose />
          </button>
        </div>
        <div className="tab-content">
          <p>{content.text}</p>
          <h4>Sources:</h4>
          <ul>
            {content.sources.map((source, index) => (
              <li key={index}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Draggable>
  );
};

export default Tab;