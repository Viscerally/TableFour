import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import { getAllReservations } from '../../../libs/reservation-func.js';

export default class AdminReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      reservations: []
    };
  }

  selectSeated = (event, status) => {
    // get value of 'data-key' which is === primary key of reservation
    const id = event.target.getAttribute('data-key');
    // send the object to web socket
    this.state.socket.emit('updateReservationStatus', { id, status });
  }

  makeTable = () => {
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
      const waitingBtnClass = (status === 'waiting') ? 'button is-warning is-selected' : 'button';
      const seatedBtnClass = (status === 'seated') ? 'button is-success is-selected' : 'button';
      const cancelledBtnClass = (status === 'cancelled') ? 'button is-danger is-selected' : 'button';

      const orderStatus = (order_id) ? (
        <span className="icon has-text-success">
          <i className="fas fa-check-square"></i>
        </span>
      ) : (
          <span className="icon has-text-danger">
            <i className="fas fa-times"></i>
          </span>
        );

      return (
        <tr key={id}>
          <td>{index + 1}</td>
          <td>{group_size}</td>
          <td>{name}</td>
          <td>{orderStatus}</td>
          <td>
            <div className="buttons has-addons is-centered">
              <span data-key={id}
                onClick={event => this.selectSeated(event, 'waiting')}
                className={waitingBtnClass}
              >WAITING</span>
              <span
                data-key={id}
                onClick={event => this.selectSeated(event, 'seated')}
                className={seatedBtnClass}
              >SEATED</span>
              <span
                data-key={id}
                onClick={event => this.selectSeated(event, 'cancelled')}
                className={cancelledBtnClass}
              >CANCELED</span>
            </div>
          </td>
        </tr>
      )
    });

    let stats = (
      <tr>
        <th colSpan='5'>
          Total of {this.state.reservations.length} groups ({sizeSum} people) waiting..
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
      })
      .catch(err => { console.log(err) });

    // SOCKET CONNECTION
    // as customer submits the form, the form data's broadcast back here
    // add the new reservation data into the existing state
    socket.on('connect', () => {
      console.log('Connected to websocket');
      socket.on('news', () => {
        getAllReservations()
          .then(reservations => {
            // save all reso data to state
            this.setState({ reservations });
          })
          .catch(err => { console.log(err) });
      });

      socket.on('newStatus', newStatus => {
        const { id, status } = newStatus;
        const reservations = this.state.reservations.map(reservation => {
          if (reservation.id == id) {
            reservation.status = status;
          }
          return reservation;
        });
        this.setState({ reservations });
      })
    });
  }

  render() {
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        {this.makeTable()}
      </table>
    );
  }
}
