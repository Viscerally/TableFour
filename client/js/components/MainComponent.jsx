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
      orderId: '2',
      menuItemOrders: [],
      res_code: props.res_code,
      currentMenu: {}
    };
  }

  setMenu = menu => {

    this.setState({
      currentMenu: menu
    })
  }

  removeFromOrder = orderItem => {
    this.props.socket.emit('removeOrderItem', (orderItem));
  }

  addToOrder = menuItem => {
    menuItem.orderId = this.state.orderId;
    this.props.socket.emit('addItemToOrder', menuItem);
  }

  placeOrder = (order_id) => {
    const newOrder = {
      orderId: this.state.order_id,
      priceTotal: this.state.price_declared,
      paymentConfirmation: this.state.is_paid,
      orderCode: order_id,
    };


    ///////////////////////////////////
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
    const categoriesArray = [];
    let categoryComponents = [];

    if (this.state.menu) {
      for (let cat in this.state.menu) {
        categoriesArray.push(this.state.menu[cat]);
      }
      // console.log('menu', this.state.menu);
      // console.log('arraylike', Array.from(this.state.menu))
      // console.log('array', categoriesArray);
      categoryComponents = categoriesArray.map((category) => {
        return (
          <div className="tile is-parent">
            <article className="tile is-child box">
              <Category menu={category} setMenu={this.setMenu} />
            </article>
          </div>
        )
      })
      return categoryComponents;
    }
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
                  <BookingForm urls={urls} socket={socket} />
                </div>
              </article>
            </div>

            <div className='tile is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <p className='title is-4'>RESERVATION STATUS</p>
                  {this.selectDashboard(this.state)}
                </div>
              </article>
            </div>

          </div>
          {/*LOAD THE CATEGORY COMPONENTS*/}

          <article className="menuCategories">
            <div className="tile is-ancestor">
              {this.createCategories()}
            </div>
          </article>

          <div className='columns' >
            <div className='column is-one-third' />
            <div className='column is-one-third'>
              <Menu
                addToOrder={this.addToOrder}
                currentMenu={this.state.currentMenu}
              />
            </div>
            <div className='column is-one-third' />
          </div>

          <div className='columns'>
            <div className='column is-one-third' />
            <div className='column is-one-third'>
              <Order
                orderId="2"
                orderItems={this.state.menuItemOrders}
                removeFromOrder={this.removeFromOrder}
                placeOrder={this.state.placeOrder}
              />
            </div>
          </div>
        </main>
        <footer></footer>
      </div >
    );
  }
}
