import React, { Component } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar.jsx';
import Order from './Order.jsx'
import Menu from './Menu.jsx';
import BookingForm from './BookingForm.jsx';
// import ReservationDashboard from './ReservationDashboard.jsx';

export default class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItemOrders: [],
      reservations: [],
      orderId: '2',
    };
  }

  removeFromOrder = (orderItem)=> {
    this.setState((prevState, props) => {
      delete prevState.menuItemOrders[orderItem];
      return {
        prevState
      }
    })
    console.log("This.state on DELETE", this.state.orderItems, orderItem)
   }

  addToOrder = menuItem => {
    menuItem.orderId = this.state.orderId;
    this.props.socket.emit('addItemToOrder', menuItem);
  }

  componentDidMount = () => {
    this.props.socket.on('allReservations', data => {
      this.setState({
        reservations: data
      })
    })
    this.props.socket.on('menuItemsByItemOrders', data => {
      this.setState({
        menuItemOrders: data
      })
    })
    this.props.socket.on('newOrderAdded', data => {
      this.setState(prevState => {
        return {
          menuItemOrders: [...prevState.menuItemOrders, data]
         };
      })
    })
    this.props.socket.emit('getAllReservations');
    this.props.socket.emit('getMenuItemsByItemOrders');
  }

  showRefId = () => {
    if (this.props.res_code) {
      return (
        <span className='subtitle is-5'>
          <em> - Reference ID: {this.props.res_code}</em>
        </span>
      );
    }
  };

  render() {
    return (
      <div className='container is-desktop'>
      <Navbar />
      <br />
      <main>
        <div className='tile is-parent'>
          <article className='tile is-child box'>
            <div className='content'>
              <p className='title is-4'>RESERVATIONS {this.state.reservations.length}</p>
              <div className='tile is-ancestor top-tile'>
                <div className='tile is-5 is-parent'>
                  <article className='tile is-child box'>
                    <div className='content'>
                      <span className='title is-4'>BOOK YOUR TABLE</span>
                      <BookingForm
                        reservations={this.state.reservations}
                        res_code={this.props.res_code}
                        socket={this.props.socket}
                      />
                    </div>
                  </article>
                </div>
              </div>

            </div>
          </article>
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
