import React, { Component, Fragment } from 'react';
import { getAllReservations, returnResoArray } from '../../../libs/reservation-func.js';

export default class ReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservations: [],
      res_code: ''
    };
  }

  makeTable = () => {
    // set sizeSum to 0 before calculating how many people are ahead of the current customer
    let sizeSum = 0;
    let stats = '';

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

    const cells = this.state.reservations.map((reservation, index) => {
      // add the group size
      sizeSum += reservation.group_size;
      if (this.state.res_code == reservation.res_code) {
        stats = `Your position: #${index + 1} (${sizeSum - reservation.group_size} people ahead)`;
      } else {
        options = '';
      }


      const visibleRowCut = 3;
      let { name, group_size } = reservation;
      const className = (this.state.res_code == reservation.res_code) ? 'is-selected' : '';
      name = (this.state.res_code == reservation.res_code) ? name : '...';

      if (index < visibleRowCut || this.state.res_code == reservation.res_code) {
        return (
          <tr key={reservation.id} className={className}>
            <td>{index + 1}</td>
            <td>{name}</td>
            <td>{group_size}</td>
            <td>{options}</td>
          </tr>
        );
      } else if (index == visibleRowCut) {
        return (
          <tr key='empty_row'>
            <td colSpan='4'>...</td>
          </tr>
        );
      }
    });

    if (this.state.res_code === null) {
      stats = `Total of ${this.state.reservations.length} groups (${sizeSum} people) waiting..`;
    }
    return (
      <Fragment>
        <thead>
          <tr>
            <th colSpan='4'>{stats}</th>
          </tr>
          {tHeader}
        </thead>
        <tbody>{cells}</tbody>
      </Fragment>
    );
  };

  componentDidMount() {

    this.setState(oldState => {
      let { res_code } = this.props.urlParams;
      res_code = (this.props.urlParams.res_code) || null;

      oldState.res_code = res_code;
      // pass res_code to the parent component
      this.props.getResCode(res_code);
      return oldState;
    });

    getAllReservations()
      .then(reservations => {
        // save all reso data to state
        this.setState({ reservations });
      })
      .catch(err => { console.log(err) });

    // SOCKET CONNECTION
    // as customer submits the form, the form data's broadcast back here
    // add the new reservation data into the existing state
    const { socket } = this.props;
    socket.on('connect', () => {
      console.log('Connected to websocket');
      socket.on('news', newRecord => {
        const newReservation = { ...newRecord.customer, ...newRecord.reservation }

        this.setState(oldState => {
          const { res_code } = newReservation;

          // pass res_code to the parent component
          this.props.getResCode(res_code);

          const reservations = returnResoArray(oldState.reservations, newReservation);
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
