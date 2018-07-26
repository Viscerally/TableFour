import React, { Component } from 'react';

const TableHead = () => {
  return (
    <thead>
      <tr>
        <th>#</th>
        <th>GROUP SIZE</th>
        <th>
          <a className='button is-link is-rounded'>
            <span>Place Order</span>
            <span className='icon is-small'>
              <i className="fas fa-cart-arrow-down"></i>
            </span>
          </a>
        </th>
      </tr>
    </thead>
  );
}

const TableBody = () => {
  return (
    <tbody>
      <tr>
        <td>1</td>
        <td>3</td>
        <td></td>
      </tr>
      <tr>
        <td><span className='tag is-medium is-info'>2</span></td>
        <td><strong>2</strong></td>
        <td>
          <a className='button is-danger is-outlined is-rounded'>
            <span>Cancel Booking</span>
            <span className="icon is-small">
              <i className="fas fa-times"></i>
            </span>
          </a>
        </td>
      </tr>
      <tr>
        <td>3</td>
        <td>3</td>
        <td></td>
      </tr>
      <tr>
        <td>4</td>
        <td>5</td>
        <td></td>
      </tr>
      <tr>
        <td>5</td>
        <td>3</td>
        <td></td>
      </tr>
    </tbody>
  );
};

export default class ReservationDashboard extends Component {
  render() {
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        <TableHead />
        <TableBody />
      </table>
    );
  }
}