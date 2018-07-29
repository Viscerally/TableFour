import React, { Component } from 'react';
import { getAllReservations } from '../../libs/reservation-func.js';
import io from 'socket.io-client';

const TableHead = () => {
  return (
    <thead>
      <tr>
        <th>#</th>
        <th>NAME</th>
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
    this.state = {
      socket: '',
      reservations: []
    };

    this.TableBody = this.TableBody.bind(this);
  }



  TableBody() {
    const cells = this.state.reservations.map((reservation, index) =>
      <tr key={reservation.id}>
        <td>{index + 1}</td>
        <td>{reservation.name}</td>
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
    // initial loading of all reservations
    getAllReservations()
      .then(reservations => {
        // save all reso data to state
        this.setState({ reservations })
        console.log(reservations);
      })
      .catch(err => { console.log(err) });


    // after all components are mounted, socket disappears
    // this needs to be placed in state
    const socket = io('http://localhost:3001');
    this.setState({ socket });
    socket.on('connect', () => {
      socket.on('news', newRecord => {
        // customer_id, email, group_size, id, name. order_id, phone, placement_time, status
        const {
          customer: { customer_id, email, name, phone },
          reservation: { group_size, id, order_id, placement_time, status }
        } = newRecord;

        const newReservation = { customer_id, email, group_size, id, name, order_id, phone, placement_time, status }
        this.setState({ reservations: [...this.state.reservations, newReservation] });
        window.location = `/home/users/${id}`;
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