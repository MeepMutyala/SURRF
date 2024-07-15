"use client";

export default function pageHeader({ topic }) {
  return (
    <div className="page-header">
      <h1>{topic}</h1>
      <h3>A new way to learn, built with <a href="https://www.perplexity.ai/">
      perplexity.ai!</a></h3>
    </div>
  );
}