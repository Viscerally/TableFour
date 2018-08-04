import React, { Component, Fragment } from "react";

export default class ReservationDashboard extends Component {
  makeTable = (reservations, res_code) => {
    // set sizeSum to 0 before calculating how many people are ahead of the current customer
    let sizeSum = 0;
    let index = 0;
    let stats = "";
    let options = "";

    const cells = reservations.map(reservation => {
      // don't show reservations with status other than 'waiting'
      if (reservation.status !== "waiting") {
        return true;
      }

      // define whether each row is viewable
      if (reservation.isViewable === undefined) {
        reservation.isViewable = true;
      }

      // define each row position
      const position = index + 1;

      // add the group size
      sizeSum += reservation.group_size;

      // current customer's reservation exists in the reservation table
      if (reservation.isViewable && res_code === reservation.res_code) {
        // create stats for the current reservation
        stats = `Your position: #${position} (${sizeSum - reservation.group_size} people ahead)`;

        // option for the selected reservation
        options = (
          <a className="button is-link is-rounded is-small">
            <span>Place Order</span>
            <span className="icon is-small">
              <i className="fas fa-cart-arrow-down" />
            </span>
          </a>
        );
      } else {
        options = "";
      }

      // only show the first 3 rows to save space, then the current customer's reservation.
      const visibleRowCut = 3;
      let { group_size } = reservation;
      let name = this.props.currentCustomer.name;
      const klassName = (reservation.isViewable && res_code === reservation.res_code) ? "is-selected" : "";
      name = res_code == reservation.res_code ? name : "...";

      let row = "";
      if (index < visibleRowCut) {
        // first 3 rows
        row = (
          <tr key={reservation.id} className={klassName}>
            <td>{position}</td>
            <td>{name}</td>
            <td>{group_size}</td>
            <td>{options}</td>
          </tr>
        );
      } else if (res_code == reservation.res_code) {
        // current customer's reservation row
        row = (
          <tr key={reservation.id} className={klassName}>
            <td>{position}</td>
            <td>{name}</td>
            <td>{group_size}</td>
            <td>{options}</td>
          </tr>
        );
      } else if (index == visibleRowCut) {
        row = (
          <tr key="empty_row">
            <td colSpan="4">...</td>
          </tr>
        );
      }

      index++;
      return row;
    });

    if (!res_code) {
      stats = `Total of ${reservations.length} groups (${sizeSum} people) waiting..`;
    }

    return (
      <Fragment>
        <thead>
          <tr>
            <th colSpan="4">{stats}</th>
          </tr>
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>SIZE</th>
            <th />
          </tr>
        </thead>
        <tbody>{cells}</tbody>
      </Fragment>
    );
  };

  render() {
    const { res_code, reservations } = this.props;
    return (
      <table className="table is-striped is-hoverable is-fullwidth reservation-dashboard">
        {this.makeTable(reservations, res_code)}
      </table>
    );
  }
}
