import React, { Component, Fragment } from 'react';
import Navbar from '../Navbar.jsx';

export default class MainArea extends Component {
  render() {
    return (
      <Fragment>
        <Navbar />
        <div>Hello MainArea!</div>
      </Fragment>
    );
  }
}