import React, { Component } from 'react';
import { makeReservation } from '../../../libs/reservation-func.js';
import NumberFormat from 'react-number-format';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', phone: '', group_size: '', email: '' };
  }

  // make a POST request with form data
  handleFormSubmission = event => {
    // prevent default GET request
    event.preventDefault();
    // take out obj keys from event.target
    const { name, phone, group_size, email } = event.target;
    // create JSON with name, phone, and email
    const body = JSON.stringify({
      name: name.value.trim(),
      phone: phone.value.replace(/\D/g, ''),
      group_size: group_size.value,
      email: email.value,
      res_code: this.props.res_code
    });

    // make a POST request to /api/reservations
    // NOTE: specify the content type to application/json
    makeReservation(body)
      .then(response => { console.log(response); })
      .catch(err => { console.log(err); });
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  }

  render() {

    return (
      <form onSubmit={this.handleFormSubmission}>
        <div className='field'>
          <label className='label is-medium'>Name*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={this.state.value}
              onChange={this.handleChange}
              name='name'
              type='text'
              placeholder='Your name'
              required
            />
            <span className='icon is-medium is-left'>
              <i className='fas fa-user-alt'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label is-medium'>Phone*</label>
          <div className='control has-icons-left has-icons-right'>
            <NumberFormat
              className='input is-medium'
              format='(###) ###-####'
              value={this.state.phone}
              onChange={this.handleChange}
              name='phone'
              type='tel'
              placeholder='(778) 123-4567'
              required
            />
            <span className='icon is-medium is-left'>
              <a className='button is-static'>
                +1
              </a>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label is-medium'>Group Size*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={this.state.value}
              onChange={this.handleChange}
              name='group_size'
              type='number'
              min='1'
              max='10'
              placeholder='e.g. 2'
              required
            />
            <span className='icon is-medium is-left'>
              <i className='fas fa-user-alt'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label is-medium'>Email (optional)</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={this.state.email}
              onChange={this.handleChange}
              name='email'
              type='email'
              placeholder='example@gmail.com'
            />
            <span className='icon is-medium is-left'>
              <i className='fas fa-envelope'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link">Submit</button>
          </div>
        </div>
      </form>
    );
  }
}