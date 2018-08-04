import React, { Component } from 'react';

import ReservationDashboard from './UserComponent/ReservationDashboard.jsx';
import AdminReservationDashboard from './AdminComponent/AdminReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';

import Navbar from './Navbar.jsx';
import Order from './Order.jsx'
import Menu from './Menu.jsx';
import Category from './Category.jsx';
import * as formHelp from '../../libs/form-helper-func.js';
import { setSocket } from '../../../libs/cli-sock-setters.js';

export default class MainComponent extends Component {
  constructor(props) {
    super(props);
    const { blankCustomer, blankReservation } = formHelp;
    this.state = {
      currentCustomer: blankCustomer(),
      currentReservation: blankReservation(),
      reservations: [],
      menuItemOrders: [],
      res_code: props.res_code,
      currentMenu: {}
    };
  }

  setMenu = menu => {
    this.setState({ currentMenu: menu });
  }

  removeFromOrder = orderItem => {
    this.props.socket.emit('removeOrderItem', (orderItem));
  }

  addToOrder = menuItem => {
    menuItem.orderId = this.state.currentReservation.order.id;
    this.props.socket.emit('addItemToOrder', menuItem);
  }

  placeOrder = () => {
    this.props.socket.emit('placeOrder', this.state.currentReservation.order);
  }

  cancelOrder = () => {
    this.props.socket.emit('cancelOrder', this.state.currentReservation.order);
  }

  selectDashboard = state => {
    const { res_code, reservations, currentReservation, currentCustomer } = state;
    if (this.props.isAdmin) {
      // ADMIN DASHBOARD
      return (
        <AdminReservationDashboard
          socket={this.props.socket}
          reservations={reservations}
        />
      );
    } else {
      // CUSTOMER DASHBOARD
      return (
        <ReservationDashboard
          res_code={res_code}
          reservations={reservations}
          currentReservation={currentReservation}
          currentCustomer={currentCustomer}
        />
      );
    }
  }

  createCategories = () => {
    return Object.values(this.state.menu).map(category => (
      <div class="tile is-parent">
        <article class="tile is-child box menuCategories">
          <Category menu={category} setMenu={this.setMenu} />
        </article>
      </div>
    ));
  }

  componentDidMount = () => {
    let { socket } = this.props;
    const { res_code } = this.state;
    socket = setSocket(socket, this);
    if (res_code) {
      // res_code received as a url param
      socket.emit('getReservationByResCode', res_code);
      socket.emit('getCustomerByResCode', res_code);
    }

    socket.emit('getReservations');
    socket.emit('getItemOrdersWMenuItemInfo');
    socket.emit('getMenu');
  }

  render() {
    const { socket, urls } = this.props;
    const { currentReservation } = this.state;
    return (
      <div className='container is-desktop'>
        <header>
          <Navbar />
        </header>
        <br />
        <main>
          {/* TOP TILE  */}
          <div className='tile is-ancestor top-tile'>
            {/* BOOKING FORM */}
            <div className='tile is-5 is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <span className='title is-4'>BOOK YOUR TABLE</span>
                  <BookingForm reservation={currentReservation} urls={urls} socket={socket} />
                </div>
              </article>
            </div>
            {/* BOOKING FORM - END */}
            {/* RESERVATION DASHBOARD */}
            <div className='tile is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <p className='title is-4'>RESERVATION STATUS</p>
                  {this.selectDashboard(this.state)}
                </div>
              </article>
            </div>
            {/* RESERVATION DASHBOARD -END */}
          </div>
          {/* TOP TILE - END */}

          {/* CATEGORIES */}
          <div class='tile is-ancestor'>
            {(this.state.menu) && (this.createCategories())}
          </div>
          {/* CATEGORIES - END */}

          <Menu
            addToOrder={this.addToOrder}
            currentMenu={this.state.currentMenu}
            reservation={this.state.currentReservation}
          />

        {this.state.currentReservation && !this.props.isAdmin ?
          (
          <div className='columns'>
            <div className='column is-one-third' />
            <div className='column is-one-third'>
              <Order
                order={this.state.currentReservation.order}
                orderItems={this.state.menuItemOrders}
                removeFromOrder={this.removeFromOrder}
                placeOrder={this.placeOrder}
                cancelOrder={this.cancelOrder}
              />
            </div>
          </div>
        ) : (null)}
        </main>
        <footer></footer>
      </div >
    );
  }
}
