import React, { Component, Fragment } from 'react';

// default table header
const createDefaultHeader = () => {
  return (
    <tr>
      <th>#</th>
      <th>NAME</th>
      <th>SIZE</th>
      <th></th>
    </tr>
  );
};

export default class ReservationDashboard extends Component {
  makeTable = (reservations, res_code) => {
    // set sizeSum to 0 before calculating how many people are ahead of the current customer
    let sizeSum = 0;
    let stats = '';
    let options = '';

    // loop through table rows
    const cells = reservations.map((reservation, index) => {
      // add the group size
      sizeSum += reservation.group_size;

      if (res_code == reservation.res_code) {
        // create stats for the current reservation
        stats = `Your position: #${index + 1} (${sizeSum - reservation.group_size} people ahead)`;

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
        options = '';
      }

      // we don't need to show all table rows
      // show the first 3 rows and then skip to the current user
      const visibleRowCut = 3;
      let { name, group_size } = reservation;
      const klassName = (res_code == reservation.res_code) ? 'is-selected' : '';
      name = (res_code == reservation.res_code) ? name : '...';

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
      } else if (res_code == reservation.res_code) {
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

    if (res_code === null) {
      stats = `Total of ${reservations.length} groups (${sizeSum} people) waiting..`;
    }

    return (
      <Fragment>
        <thead>
          <tr>
            <th colSpan='4'>{stats}</th>
          </tr>
          {createDefaultHeader()}
        </thead>
        <tbody>{cells}</tbody>
      </Fragment>
    );
  };

  render() {
    const { reservations, formData: { res_code } } = this.props;
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        {this.makeTable(reservations, res_code)}
      </table>
    );
  }
}
