import React, { Component } from 'react';

import ReservationDashboard from './UserComponent/ReservationDashboard.jsx';
import AdminReservationDashboard from './AdminComponent/AdminReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';

import Navbar from './Navbar.jsx';
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
      res_code: props.res_code
    };
  }

  removeFromOrder = orderItem => {
    this.props.socket.emit('removeOrderItem', (orderItem));    
  }

  addToOrder = menuItem => {
    menuItem.orderId = this.state.orderId;
    this.props.socket.emit('addItemToOrder', menuItem);
  }

///////////////////////////////////
  placeOrder = (order_id) => {
    const newOrder = {
      orderId: this.state.order_id,
      priceTotal: this.state.price_declared,
      paymentConfirmation: this.state.is_paid,
      orderCode: order_id,
    };

  //TODO:
  //generate new order_id,
  // price_declared(total),
  //total_paid - to be inplemented later
  // payment confirmation (is_paid),
  // order_code(UUID?)
  //menu_items_ids,

  //send to db,
  //send to admin
  //send via Twillio and as notification to customer on the home page,
  //generate success message (notification or new page -if statement
  // add 'cancel' button both on the app page as a link on message on sms from Twillio?
  }

/////////////////////////////////////

  componentDidMount = () => {
    let { res_code, socket } = this.props;

    socket = setSocket(this.props.socket, this);
    socket.emit('getReservations');
    socket.emit('getItemOrdersWMenuItemInfo');
    if (this.state.res_code){
      socket.emit('getReservationByResCode', this.state.res_code);
      socket.emit('getCustomerByResCode', this.state.res_code);
    }
  }

  render() {
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
                {/*this.selectDashboard(socket, formData, reservations)*/}
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
              placeOrder={this.state.placeOrder}
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
