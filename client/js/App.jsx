import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import MainArea from './components/MainArea/MainArea.jsx';
import HostArea from './components/HostArea/HostArea.jsx';
import io from 'socket.io-client';
import '../scss/application.scss';
import { getAllReservations, makeReservation } from '../libs/reservation-func.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      reservations: []
    };

    this.handleResoFormSubmit = this.handleResoFormSubmit.bind(this);
  }

  // make a POST request with form data
  handleResoFormSubmit(event) {
    // prevent default GET request
    event.preventDefault();
    // take out obj keys from event.target
    const { name, phone, group_size, email } = event.target;
    // create JSON with name, phone, and email
    const body = JSON.stringify({
      name: name.value,
      phone: phone.value,
      group_size: group_size.value,
      email: email.value
    });
    // make a POST request to /api/reservations
    // NOTE: specify the content type to application/json

    makeReservation(body)
      .then(() => {
        getAllReservations()
          .then(reservations => {
            // save all reso data to state
            this.setState({ reservations });
          })
          .catch(err => { console.log(err) });
      })
      .catch(err => { console.log(err) });
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
          <Route path="/home"
            render={props => (
              <MainArea {...props}
                handleResoFormSubmit={this.handleResoFormSubmit}
              />
            )}
          />
        </div>
      </Router>
    );
  }
};
