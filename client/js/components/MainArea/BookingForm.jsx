import React, { Component } from 'react';

export default class BookingForm extends Component {
  render() {
    return (
      <form>
        <div className='field'>

          <label className='label is-medium'>Name</label>
          <div className='control has-icons-left has-icons-right'>
            <input className='input is-large' name='name' type='text' placeholder='Your name' />
            <span className='icon is-medium is-left'>
              <i className='fas fa-user-alt'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>

          <label className='label is-medium'>Phone</label>
          <div className='control has-icons-left has-icons-right'>
            <input className='input is-large' name='tel' type='tel' placeholder='Your name' />
            <span className='icon is-medium is-left'>
              <a className='button is-static'>
                +1
              </a>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>

          <label className='label is-medium'>Email</label>
          <div className='control has-icons-left has-icons-right'>
            <input className='input is-large' name='email' type='email' placeholder='Your name' />
            <span className='icon is-medium is-left'>
              <i className='fas fa-envelope'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>
      </form>
    );
  }
}