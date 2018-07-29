import React, { Component, Fragment } from 'react';
import { getAllReservations } from '../../../libs/reservation-func.js';
import io from 'socket.io-client';

export default class ReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      reservations: [],
      res_id: '',
      position: ''
    };
    this.Table = this.Table.bind(this);
  }

  Table() {
    // set sizeSum to 0 before calculating how many people are ahead of the current customer
    let sizeSum = 0;
    // if reservation_id is not given,
    // display the total number of groups and people instead
    let stats = (this.state.res_id === '') && (
      <tr>
        <th colSpan='4'>
          {this.state.reservations.length} groups ({sizeSum} people) waiting..
        </th>
      </tr>
    );
    // default table header
    const tHeader = (
      <tr>
        <th>#</th>
        <th>NAME</th>
        <th>SIZE</th>
        <th></th>
      </tr>
    );
    let options = '';

    // loop through table rows
    const cells = this.state.reservations.map((reservation, index) => {
      // add the group size
      sizeSum += reservation.group_size;

      // if correct reservation id is given, make the corresponding
      // row unique so that user knows the row shows their reservation
      if (this.state.res_id == reservation.id) {
        // create stats for the current customer
        stats = (
          <tr>
            <th colSpan='4'>
              Your position: {index + 1} ({sizeSum - reservation.group_size} people ahead)
            </th>
          </tr>
        );
        // option for the selected reservation
        options = (
          <a className='button is-link is-rounded is-small'>
            <span>Place Order</span>
            <span className='icon is-small'>
              <i className="fas fa-cart-arrow-down"></i>
            </span>
          </a>
        );
      } else {
        // hide customer name other than the current customer's name
        options = '';
      }

      // we don't need to show all table rows
      // show the first 3 rows and then skip to the current user
      const visibleRowCut = 3;
      if (index < visibleRowCut) {
        // first 3 rows
        return (
          <tr key={reservation.id}>
            <td>{index + 1}</td>
            <td>...</td>
            <td>{reservation.group_size}</td>
            <td>{options}</td>
          </tr>
        );
      } else if (this.state.res_id == reservation.id) {
        // current customer's reservation row
        return (
          <tr key={reservation.id} className='is-selected'>
            <td>{index + 1}</td>
            <td>{reservation.name}</td>
            <td>{reservation.group_size}</td>
            <td>{options}</td>
          </tr>
        )
      } else if (index == visibleRowCut) {
        return (
          <tr key='empty_row'>
            <td colSpan='4'>...</td>
          </tr>
        );
      }
    });

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

    // RESERVATION ID
    // if res_id's passed as a URL param, save it in the state
    const { res_id } = this.props.urlParams;
    if (res_id) { this.setState({ res_id }); }

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
      socket.on('news', newRecord => {
        const {
          customer: { email, name, phone },
          reservation: { customer_id, group_size, id, order_id, placement_time, status }
        } = newRecord;

        const newReservation = { customer_id, id, placement_time, group_size, status, order_id, email, id, name, phone }

        this.setState(oldState => {
          const reservations = [...oldState.reservations, newReservation];
          oldState.reservations = reservations;
          oldState.res_id = id;
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