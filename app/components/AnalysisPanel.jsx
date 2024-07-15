export default function AnalysisPanel({ title, content }) {
  if (!content) {
    return null;
  }

  return (
    <div className="analysis-panel">
      <h3 className="analysis-title">{title}</h3>
      <div className="analysis-content">
        {content}
      </div>
    </div>
  );
}