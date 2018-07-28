import React, { Component } from 'react';
import { getAllReservations } from '../../libs/reservation-func.js';

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

export default class ReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { reservations: [] };

    this.TableBody = this.TableBody.bind(this);
  }

  TableBody() {
    const cells = this.state.reservations.map((reservation, index) =>
      <tr key={reservation.id}>
        <td>{index + 1}</td>
        <td>{reservation.group_size}</td>
        <td></td>
      </tr>
    );
    return <tbody>{cells}</tbody>;
    // return (
    //   <tbody>
    //     <tr>
    //       <td>1</td>
    //       <td>3</td>
    //       <td></td>
    //     </tr>
    //     <tr>
    //       <td><span className='tag is-medium is-info'>2</span></td>
    //       <td><strong>2</strong></td>
    //       <td>
    //         <a className='button is-danger is-outlined is-rounded'>
    //           <span>Cancel Booking</span>
    //           <span className="icon is-small">
    //             <i className="fas fa-times"></i>
    //           </span>
    //         </a>
    //       </td>
    //     </tr>
    //     <tr>
    //       <td>3</td>
    //       <td>3</td>
    //       <td></td>
    //     </tr>
    //     <tr>
    //       <td>4</td>
    //       <td>5</td>
    //       <td></td>
    //     </tr>
    //     <tr>
    //       <td>5</td>
    //       <td>3</td>
    //       <td></td>
    //     </tr>
    //   </tbody>
    // );
  };


  componentDidMount() {
    getAllReservations()
      .then(reservations => {
        // save all reso data to state
        this.setState({ reservations })
      })
      .catch(err => { console.log(err) });
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