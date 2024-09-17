"use client";

export default function pageHeader({ topic }) {
  return (
    <div className="page-header">
      <h1>{topic}</h1>
      <h3>The Semantic Ubiquitous Relation Research Framework (SURRF) aka, a new way to research and navigate the web. </h3>
      
      <h3> Built with NextJS, powered by <a href="https://www.perplexity.ai/">
      perplexity.ai!</a></h3>


    </div>
  );
}