import React, { Component } from 'react';

import Navbar from '../Navbar.jsx';


export default class MainArea extends Component {
  render() {
    return (
      <div className='container is-desktop'>
        <Navbar />
        <main></main>
        <footer></footer>
      </div>
    );
  }
}