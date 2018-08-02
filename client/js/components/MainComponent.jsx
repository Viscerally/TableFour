import React, { Component } from 'react';

import ReservationDashboard from './UserComponent/ReservationDashboard.jsx';
import AdminReservationDashboard from './AdminComponent/AdminReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';

import Navbar from './Navbar.jsx';
import Order from './Order.jsx'
import Menu from './Menu.jsx';

import { returnResoArray } from '../../libs/reservation-func.js';

export default class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { name: '', phone: '', group_size: '', email: '', res_code: '' },
      reservations: [],
      orderId: '2',
      menuItemOrders: [],
    };
  }

  removeFromOrder = orderItem => {
    const menuItemOrders = this.state.menuItemOrders.filter(item => item.id !== orderItem.id);
    this.setState({ menuItemOrders });
  }

  addToOrder = menuItem => {
    menuItem.orderId = this.state.orderId;
    this.props.socket.emit('addItemToOrder', menuItem);
  }

  componentDidMount = () => {
    let { res_code, socket } = this.props;
    this.setState(oldState => {
      oldState.formData.res_code = res_code;
      return oldState;
    })

    socket.on('connect', () => {
      console.log('Connected to websocket');

      // LOAD INITIAL RESERVATIONS
      socket.emit('getReservations');
      socket.on('loadReservations', reservations => {
        let formData = {};
        let currentReservation = [];
        if (res_code) {
          currentReservation = reservations.filter(reservation => res_code === reservation.res_code);
        }
        formData = (currentReservation.length === 0) ? this.state.formData : currentReservation[0];
        this.setState({ formData, reservations });
      });

      // LOAD NEW RESERVATIONS
      socket.on('loadNewReservation', newReservation => {
        this.setState(oldState => {
          const reservations = [...oldState.reservations, newReservation];
          return { ...oldState, formData: newReservation, reservations };
        });
      })

      // UPDATE RESERVATION DATA
      socket.on('loadChangedReservation', newReservation => {
        this.setState(oldState => {
          const reservations = returnResoArray(oldState.reservations, newReservation);
          return { ...oldState, formData: newReservation, reservations };
        });
      })

      // CANCEL RESERVATION
      socket.on('removeCancelledReservation', newData => {
        this.setState(oldState => {
          const reservations = returnResoArray(oldState.reservations, newData);

          return {
            ...oldState,
            formData: { name: '', phone: '', group_size: '', email: '', res_code: '' },
            reservations
          };
        });
      })

      // UPDATE RESERVATION STATUS BY ADMIN
      socket.on('changeReservationStatus', newReservation => {
        this.setState(oldState => {
          const reservations = returnResoArray(oldState.reservations, newReservation);
          return { ...oldState, formData: newReservation, reservations };
        });
      })

      socket.emit('getItemOrdersWMenuItemInfo');
      socket.on('ItemOrdersWMenuItemInfo', menuItemOrders => {
        this.setState({ menuItemOrders });
      });

      socket.on('newOrderAdded', data => {
        this.setState(prevState => {
          return {
            menuItemOrders: [...prevState.menuItemOrders, data]
          };
        })
      })

    });

  }

  selectDashboard = (socket, formData, reservations) => {
    if (this.props.isAdmin) {
      // ADMIN DASHBOARD
      return (
        <AdminReservationDashboard
          socket={socket}
          reservations={reservations}
        />
      );
    } else {
      // CUSTOMER DASHBOARD
      return (
        <ReservationDashboard
          formData={formData}
          reservations={reservations}
        />
      );
    }
  }

  render() {
    const { formData, reservations, menuItemOrders } = this.state;
    const { socket, isAdmin } = this.props;
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
                    isAdmin={isAdmin}
                    formData={formData}
                    socket={socket}
                  />
                </div>
              </article>
            </div>
            <div className='tile is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <p className='title is-4'>RESERVATION STATUS</p>
                  {this.selectDashboard(socket, formData, reservations)}
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
                orderItems={menuItemOrders}
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
