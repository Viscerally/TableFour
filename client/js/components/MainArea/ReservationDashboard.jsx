import React, { Component } from 'react';
import { getAllReservations } from '../../../libs/reservation-func.js';
import io from 'socket.io-client';

const TableHead = () => {
  return (
    <thead>
      <tr>
        <th>#</th>
        <th>NAME</th>
        <th>SIZE</th>
        <th></th>
      </tr>
    </thead>
  );
}

export default class ReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: '',
      reservations: [],
      res_id: ''
    };

    this.TableBody = this.TableBody.bind(this);
  }

  TableBody() {
    // loop through table rows
    const cells = this.state.reservations.map((reservation, index) => {
      let { name, group_size } = reservation;
      // if user's has a correct reservation id, make the corresponding row unique so that
      // user knows the row shows their reservation
      let position = '';
      let options = '';
      if (this.state.res_id == reservation.id) {
        position = <span className='tag is-medium is-info'>{index + 1}</span>;
        options = (
          <a className='button is-link is-rounded'>
            <span>Place Order</span>
            <span className='icon is-small'><i className="fas fa-cart-arrow-down"></i></span>
          </a>
        );
      } else {
        position = index + 1;
        name = '...';
        options = '';
      }

      // we don't need to show all table rows
      // show the first 3 rows and then skip to the current user
      const visibleRowCut = 3;
      console.log(index == visibleRowCut + 1);
      if (index < visibleRowCut || this.state.res_id == reservation.id) {
        return (
          <tr key={reservation.id}>
            <td>{position}</td>
            <td>{name}</td>
            <td>{group_size}</td>
            <td>{options}</td>
          </tr>
        )
      } else if (index == visibleRowCut) {
        return (
          <tr key='empty_row'>
            <td>{position}</td>
            <td colSpan='3'>...</td>
          </tr>
        );
      }
    });
    return <tbody>{cells}</tbody>;
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
        <TableHead />
        <this.TableBody />
      </table>
    );
  }
}