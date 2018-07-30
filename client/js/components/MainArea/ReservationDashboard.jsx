import React, { Component, Fragment } from 'react';
import { getAllReservations } from '../../../libs/reservation-func.js';
import io from 'socket.io-client';

export default class ReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      reservations: [],
      res_code: ''
    };
  }

  makeTable = () => {
    // set sizeSum to 0 before calculating how many people are ahead of the current customer
    let sizeSum = 0;
    // if reservation_id is not given,
    // display the total number of groups and people instead
    let stats = (this.state.res_code === '') && (
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

      // if correct reservation code is given, make the corresponding
      // row unique so that user knows the row shows their reservation
      if (this.state.res_code == reservation.res_code) {
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
      let { name, group_size } = reservation;
      const klassName = (this.state.res_code == reservation.res_code) ? 'is-selected' : '';
      name = (this.state.res_code == reservation.res_code) ? name : '...';

      if (index < visibleRowCut) {
        // first 3 rows
        return (
          <tr key={reservation.id} className={klassName}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{group_size}</td>
            <td>{options}</td>
          </tr>
        );
      } else if (this.state.res_code == reservation.res_code) {
        // current customer's reservation row
        return (
          <tr key={reservation.id} className={klassName}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{group_size}</td>
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
    // check if res_code's passed as a URL param
    // if it exists, save it in the state. if not, save it as null
    this.setState(oldState => {
      let { res_code } = this.props.urlParams;
      res_code = (this.props.urlParams.res_code) || null;

      oldState.res_code = res_code;
      // pass res_code to the parent component
      this.props.getResCode(res_code);
      return oldState;
    });

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
          reservation: { res_code, order_id, group_size, id, placement_time, status }
        } = newRecord;

        const newReservation = { email, name, phone, res_code, group_size, order_id, id, placement_time, status }

        this.setState(oldState => {
          // pass res_code to the parent component
          this.props.getResCode(res_code);
          const reservations = [...oldState.reservations, newReservation];
          return { ...oldState, res_code, reservations };
        });
      });
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