"use client";
import "./ContentPage.css";

export default function ContentPage({ topic, content }) {
  return (
    <div id="contentPage">
      <h1>{topic}</h1>
      <p>{content}</p>
    </div>
  );
};