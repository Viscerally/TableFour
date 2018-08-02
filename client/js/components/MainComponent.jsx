import React, { Component } from 'react';

import Navbar from './Navbar.jsx';
import ReservationDashboard from './UserComponent/ReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';
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

///////////////////////////////////
  placeOrder = (order_id) => {
    const newOrder = {
      orderId: this.state.order_id,
      priceTotal: this.state.price_declared,
      paymentConfirmation: this.state.is_paid,
      orderCode: order_id,
    };

    
  console.log("placeOrder ------>", this.setstate)
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

    this.setState(oldState => {
      if (!res_code) { res_code = null; }
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

      // socket.on('newStatus', newStatus => {
      //   const { id, status } = newStatus;
      //   const reservations = this.state.reservations.map(reservation => {
      //     if (reservation.id == id) {
      //       reservation.status = status;
      //     }
      //     return reservation;
      //   });
      //   this.setState({ reservations });
      // });


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

  showRefId = () => {
    const { res_code } = this.state.formData;
    if (res_code) {
      return (
        <span className='subtitle is-5'>
          <em> - Reference ID: {res_code}</em>
        </span>
      );
    }
  };

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
                  {this.showRefId()}
                  <BookingForm
                    formData={formData}
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
                    formData={formData}
                    reservations={reservations}
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
