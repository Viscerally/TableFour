import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import MainArea from './components/MainArea/MainArea.jsx';
import AdminArea from './components/AdminArea/AdminArea.jsx';

import '../scss/application.scss';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={MainArea} />
          <Route path="/admin" component={AdminArea} />
        </div>
      </Router>
    );
  }
};