"use client";

export default function pageHeader({ topic }) {
  return (
  <div className="bg-teal-900 text-white p-2"> {/* Reduced padding */}
    <h1 className="text-2xl font-bold">{topic}</h1> {/* Reduced font size */}
      <h3>The Semantic Ubiquitous Relations Research Framework (SURRF) aka, a new way to research and navigate the web. </h3>
      
      <h3> Built with NextJS, powered by <a href="https://www.perplexity.ai/">
      perplexity.ai!</a></h3>


    </div>
  );
}