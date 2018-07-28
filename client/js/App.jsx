import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainArea from './components/MainArea/MainArea.jsx';
import HostArea from './components/HostArea/HostArea.jsx';

import io from 'socket.io-client';
import '../scss/application.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { socket: '' };
  }

  componentDidMount() {
    // after all components are mounted, socket disappears
    // this needs to be placed in state
    const socket = io('http://localhost:3001');
    this.setState({ socket });

    socket.on('connect', () => {
      console.log('sup guy');
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/admin" component={HostArea} />
          <Route path="/home" component={MainArea} />
        </div>
      </Router>
    );
  }
};
