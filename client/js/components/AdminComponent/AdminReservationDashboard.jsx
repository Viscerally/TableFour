import React, { Component, Fragment } from 'react';
import StatusButton from './StatusButton.jsx';

// default table header
const createDefaultHeader = () => {
  return (
    <tr>
      <th>#</th>
      <th>SIZE</th>
      <th>NAME</th>
      <th>ORDERED?</th>
      <th>STATUS</th>
    </tr>
  );
};

const showOrderStatus = orderCode => {
  return (
    (orderCode === 'nonce' || orderCode === undefined) ? (
      <span className="icon has-text-danger">
        <i className="fas fa-times"></i>
      </span>
    ) : (
        <span className="icon has-text-success">
          <i className="fas fa-check-square"></i>
        </span>
      )
  );
}

export default class AdminReservationDashboard extends Component {
  selectBtn = (event, status) => {
    // get value of 'data-key' which is === primary key of reservation
    const id = event.target.getAttribute('data-key');

    // send the object to web socket
    this.props.socket.emit('updateReservationStatus', { id, status });
  }

  makeTable = reservations => {
    // FIRST OF ALL, FILTER RESERVATIONS WITH STATUS OTHER THAN 'WAITING'
    reservations = reservations.filter(reso => reso.status === 'waiting');

    // LOOP THROUGH ROWS
    const cells = reservations.map((reservation, index) => {
      const { id, group_size, name, order_code, status } = reservation;
      return (
        <tr key={id}>
          <td>{index + 1}</td>
          <td>{group_size}</td>
          <td>{name}</td>
          <td>{showOrderStatus(order_code)}</td>
          <td>
            <StatusButton id={id} status={status} selectBtn={this.selectBtn} />
          </td>
        </tr>
      )
    });

    // CREATE STATISTICS
    const sizeSum = reservations.reduce((prev, curr) => prev + curr.group_size, 0);
    const stats = `Total of ${reservations.length} groups (${sizeSum} people) waiting..`;

    return (
      <Fragment>
        <thead>
          <tr>
            <th colSpan='5'>{stats}</th>
          </tr>
          {createDefaultHeader()}
        </thead>
        <tbody>{cells}</tbody>
      </Fragment>
    );
  };

  render() {
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        {this.makeTable(this.props.reservations)}
      </table>
    );
  }
}
