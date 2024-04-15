// components/Vertex.js
'use client';
import * as traversals from './traversalOps.js';

import React, { Component } from 'react';
import * as easyAPI from './/easyAPI'; // Adjust the import path as necessary

function updatePage(content) {
  console.log(content);
}

class Vertex extends Component {
  constructor(props) {
    super(props);
    this.model = 'mistral-7b-instruct'
    this.state = {};
  }

  render() {
    const { title, description, pos, handleClick } = this.props;
    const circleStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      border: '4px solid rgba(255, 255, 255, 0.5)', // White, semi-transparent border
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      boxSizing: 'border-box',
      margin: '5%'
    };

    return (
      <div style={circleStyle} onClick={() => handleClick(pos, title)}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    );
  }
}

export default Vertex;