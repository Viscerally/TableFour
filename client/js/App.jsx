import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainArea from './components/MainArea/MainArea.jsx';
import HostArea from './components/HostArea/HostArea.jsx';

import '../scss/application.scss';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/admin" component={HostArea} />
          <Route exact path="/home" component={MainArea} />
          <Route path="/home/reservations/:res_code" component={MainArea} />
        </div>
      </Router>
    );
  }
};
