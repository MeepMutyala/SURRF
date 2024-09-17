export default function SuggestionPanel({ suggestions, onSuggestionClick }){
    if (!suggestions || suggestions.length === 0) {
      return null;
    }
  
    return (
      <div className="suggestion-panel">
        <h3 className="suggestion-title">Suggestions</h3>
        <div className="suggestion-buttons">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="suggestion-button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }