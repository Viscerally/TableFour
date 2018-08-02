import React, { Component } from 'react';

import Navbar from './Navbar.jsx';
import ReservationDashboard from './UserComponent/ReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';
import Order from './Order.jsx'
import Menu from './Menu.jsx';
import * as formHelp from '../../libs/form-helper-func.js';
import { setSocket } from '../../../libs/cli-sock-setters.js';

export default class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCustomer: formHelp.blankCustomer(),
      currentReservation: formHelp.blankReservation(),
      reservations: [],
      orderId: '2',
      menuItemOrders: [],
      res_code: ''
    };
  }

  removeFromOrder = (orderItem)=> {
    const newState = this.state.menuItemOrders.filter(item => {
      return item.id !== orderItem.id;
    });

    this.setState((prevState) => {
      return { menuItemOrders: newState}
    })

  }

  addToOrder = menuItem => {
    menuItem.orderId = this.state.orderId;
    this.props.socket.emit('addItemToOrder', menuItem);
  }

  componentDidMount = () => {
    let { res_code, socket } = this.props;

    socket = setSocket(this.props.socket, this);
    socket.emit('getReservations');
    socket.emit('getItemOrdersWMenuItemInfo');

  }

  render() {
    console.log('MAIN COMPONENT RENDERING: ', this.state);
    const { formData, reservations } = this.state;
    return (
      <div className='container is-desktop'>
        <header>
          <Navbar />
        </header>
        <br />
        <main>
          <div className='tile is-ancestor top-tile'>
            <div className='tile is-5 is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <span className='title is-4'>BOOK YOUR TABLE</span>
                  <BookingForm
                    currentReservation={this.state.currentReservation}
                    currentCustomer={this.state.currentCustomer}
                    socket={this.props.socket}
                  />
                </div>
              </article>
            </div>
            <div className='tile is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <p className='title is-4'>RESERVATION STATUS</p>
                  <ReservationDashboard
                    res_code={this.state.res_code}
                    reservations={this.state.reservations}
                    currentReservation={this.state.currentReservation}
                    currentCustomer={this.state.currentCustomer}
                  />
                </div>
              </article>
            </div>
          </div>
          <div className='columns' >
            <div className='column is-one-third' />
            <div className='column is-one-third'>
              <Menu
                addToOrder={this.addToOrder}
              />
            </div>
            <div className='column is-one-third' />
          </div>
          <div className='columns' >
            <div className='column is-one-third' />
            <div className='column is-one-third'>
              <Order
                orderId="2"
                orderItems={this.state.menuItemOrders}
                removeFromOrder={this.removeFromOrder}
              />
            </div>
            <div className='column is-one-third' />
          </div>
        </main>
        <footer></footer>
      </div >
    );
  }
}
