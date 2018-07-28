import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import MainArea from './components/MainArea/MainArea.jsx';
import HostArea from './components/HostArea/HostArea.jsx';

import io from 'socket.io-client';


import '../scss/application.scss';

export default class App extends Component {

  componentDidMount () {
    const socket = io('http://localhost:3001');
    socket.on('connect', () => {
      console.log('sup guy');
    });

  }
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={MainArea} />
          <Route path="/host" component={HostArea} />
        </div>
      </Router>
    );
  }
};
