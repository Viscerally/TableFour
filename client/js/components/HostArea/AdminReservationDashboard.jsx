import React, { Component } from 'react';

const TableHead = () => {
  return (
    <thead>
      <tr>
        <th>#</th>
        <th>GROUP SIZE</th>
        <th>CUSTOMER NAME</th>
        <th>ORDERED?</th>
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
        <td>Peterson</td>
        <td>1</td>
      </tr>
      <tr>
        <td>2</td>
        <td>2</td>
        <td>Chan</td>
        <td>0</td>
      </tr>
      <tr>
        <td>3</td>
        <td>5</td>
        <td>Ivanovic</td>
        <td>0</td>
      </tr>
      <tr>
        <td>4</td>
        <td>2</td>
        <td>Byeong</td>
        <td>0</td>
      </tr>
    </tbody>
  );
};

export default class AdminReservationDashboard extends Component {
  render() {
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        <TableHead />
        <TableBody />
      </table>
    );
  }
}
