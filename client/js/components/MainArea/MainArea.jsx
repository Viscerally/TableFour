import React, { Component } from 'react';

import Navbar from '../Navbar.jsx';
import ReservationDashboard from './ReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';
import Menu from './Menu.jsx';

export default class MainArea extends Component {
  constructor(props) {
    super(props);
    this.state = { res_code: '' };
  }

  getResCode = (resCode) => {
    this.setState({ res_code: resCode })
  }

  showRefId = () => {
    if (this.state.res_code) {
      return (
        <span className='subtitle is-5'>
          <em> - Reference ID: {this.state.res_code}</em>
        </span>
      );
    }
  };

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
                  <span className='title is-4'>BOOK YOUR TABLE</span>
                  {this.showRefId()}
                  <BookingForm res_code={this.state.res_code} />
                </div>
              </article>
            </div>
            <div className='tile is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <p className='title is-4'>RESERVATION STATUS</p>
                  <ReservationDashboard
                    urlParams={this.props.match.params}
                    getResCode={this.getResCode}
                  />
                </div>
              </article>
            </div>
          </div>
          <div className='tile menu-tile is-4'>
            <Menu />
          </div>
        </main>
        <footer></footer>
      </div >
    );
  }
}
