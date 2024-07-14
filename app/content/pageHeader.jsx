"use client";

export default function pageHeader({ topic, content }) {
  return (
    <div className="page-header">
      <h1>{topic}</h1>
      <p>{content}</p>
    </div>
  );
}