import React, { Component } from 'react';

import Navbar from '../Navbar.jsx';
import ReservationDashboard from './ReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';
import Menu from './Menu.jsx';
import Order from  './Order.jsx'

export default class MainArea extends Component {
  render() {
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
                  <h3 className='title is-4'>BOOK YOUR TABLE</h3>
                  <BookingForm />
                </div>
              </article>
            </div>
            <div className='tile is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <h3 className='title is-4'>RESERVATION STATUS</h3>
                  <ReservationDashboard urlParams={this.props.match.params} />
                </div>
              </article>
            </div>
          </div>
          <div className='tile menu-tile is-4'>
            <Menu />
          </div>
          <div className='tile order-tile is-4'>
            <Order />
          </div>
        </main>
        <footer></footer>
      </div >
    );
  }
}
