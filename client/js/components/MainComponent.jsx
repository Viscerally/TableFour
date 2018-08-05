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

  createBookingForm = (props, state) => {
    return (
      <div className='tile is-5 is-parent'>
        <article className='tile is-child box'>
          <div className='content'>
            <span className='icon floaty-icon'>
              <i class="far fa-file-alt"></i>
            </span>
            <span className='title is-5'>BOOK YOUR TABLE</span>
            <BookingForm
              reservation={state.currentReservation}
              urls={props.urls}
              socket={props.socket}
            />
          </div>
        </article>
      </div>
    );
  }

  createDashboard = state => {
    const { res_code, reservations, currentReservation, currentCustomer } = state;
    const dashBoard = (this.props.isAdmin) ? (
      <AdminReservationDashboard
        socket={this.props.socket}
        reservations={reservations}
      />
    ) : (
        <ReservationDashboard
          res_code={res_code}
          reservations={reservations}
          currentReservation={currentReservation}
          currentCustomer={currentCustomer}
        />
      );

    return (
      <div className='tile is-parent'>
        <article className='tile is-child box'>
          <div className='content'>
            <div className='icon floaty-icon'>
              <i class="far fa-clock"></i>
            </div>
            <span className='title is-5'>RESERVATION STATUS</span>
            {dashBoard}
          </div>
        </article>
      </div>
    );
  }

  createCategories = () => {
    return Object.values(this.state.menu).map(category => (
      <Category key={category.id} menu={category} setMenu={this.setMenu} />
    ));
  }

  createMenu = state => {
    return (
      <article className='tile is-parent'>
        <div className='tile is-child box columns'>
          <Menu
            addToOrder={this.addToOrder}
            currentMenu={state.currentMenu}
            reservation={state.currentReservation}
          />
        </div>
      </article>
    );
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
    return (
      <div className='container is-desktop'>
        <header>
          <Navbar />
        </header>
        <br />
        <main>
          <div className='tile is-ancestor top-tile'>
            {this.createBookingForm(this.props, this.state)}
            {this.createDashboard(this.state)}
          </div>

          <div className='tile is-ancestor'>
            {(this.state.menu) && (this.createCategories())}
          </div>

          <div className='tile is-ancestor'>
            {(Object.keys(this.state.currentMenu).length > 0) &&
              this.createMenu(this.state)}
          </div>

          {this.state.currentReservation && !this.props.isAdmin ?
            (
              <div className='columns'>
                <div className='column'></div>
                <div className='column is-6'>
                  <Order
                    order={this.state.currentReservation.order}
                    orderItems={this.state.menuItemOrders}
                    removeFromOrder={this.removeFromOrder}
                    placeOrder={this.placeOrder}
                    cancelOrder={this.cancelOrder}
                  />
                </div>
                <div className='column'></div>
              </div>
            ) : (null)}
        </main>
        <footer></footer>
      </div >
    );
  }
}