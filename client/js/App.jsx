import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import MainArea from './components/MainArea/MainArea.jsx';
import AdminArea from './components/AdminArea/AdminArea.jsx';

import '../scss/application.scss';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={MainArea} />
          <Route exact path='/admin' component={AdminArea} />
        </div>
      </Router>
    );
  }
};