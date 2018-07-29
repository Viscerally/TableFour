import React, { Component, Fragment } from 'react';
import { getAllReservations } from '../../../libs/reservation-func.js';
import io from 'socket.io-client';

export default class AdminReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { socket: '', reservations: [] };

    this.Table = this.Table.bind(this);
  }

  Table() {
    let sizeSum = 0;
    const tHeader = (
      <tr>
        <th>#</th>
        <th>SIZE</th>
        <th>NAME</th>
        <th>ORDERED?</th>
        <th>STATUS</th>
      </tr>
    );

    // loop through table rows
    const cells = this.state.reservations.map((reservation, index) => {
      // add the group size
      sizeSum += reservation.group_size;

      const { id, group_size, name, order_id, status } = reservation;
      console.log(reservation);
      return (
        <tr key={id}>
          <td>{index + 1}</td>
          <td>{group_size}</td>
          <td>{name}</td>
          <td>{(order_id) ? 'Y' : 'N'}</td>
          <td>{status}</td>
        </tr>
      )
    });

    let stats = (
      <tr>
        <th colSpan='5'>
          {this.state.reservations.length} groups ({sizeSum} people) waiting..
        </th>
      </tr>
    );

    return (
      <Fragment>
        <thead>{stats}{tHeader}</thead>
        <tbody>{cells}</tbody>
      </Fragment>
    );
  };

  componentDidMount() {
    // WEBSOCKET
    // initiate socket and save it in the state
    const socket = io('http://localhost:3001');
    this.setState({ socket });

    // INITIAL RESERVATION DATA
    // get all reservations
    getAllReservations()
      .then(reservations => {
        // save all reso data to state
        this.setState({ reservations });
        console.log(this.state);
      })
      .catch(err => { console.log(err) });

    // SOCKET CONNECTION
    // as customer submits the form, the form data's broadcast back here
    // add the new reservation data into the existing state
    socket.on('connect', () => {
      socket.on('news', newRecord => {
        const {
          customer: { email, name, phone },
          reservation: { res_code, order_id, group_size, id, placement_time, status }
        } = newRecord;

        const newReservation = { email, name, phone, res_code, group_size, order_id, id, placement_time, status }

        this.setState(oldState => {
          const reservations = [...oldState.reservations, newReservation];
          oldState.reservations = reservations;
          oldState.res_code = res_code;
          return oldState;
        });
      });
    });
  }

  render() {
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        <this.Table />
      </table>
    );
  }
}
