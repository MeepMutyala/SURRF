"use client";
import "./ContentPage.css";

export default function ContentPage({ topic, content }) {
  return (
    <div id="contentPage">
      <h2>{topic}</h2>
      <p title={content}>{content}</p>
    </div>
  );
};