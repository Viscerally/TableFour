import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { getAllReservations } from '../../../libs/reservation-func.js';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone: '',
      group_size: '',
      email: '',
      res_code: ''
    };
  }

  // make a POST request with form data
  handleFormSubmission = event => {
    // prevent default GET request
    event.preventDefault();
    // deconstruct event.target
    const { name, phone, group_size, email } = event.target;

    // send form data to websocket
    const { socket } = this.props;
    const formData = {
      name: name.value.trim(),
      phone: phone.value.replace(/\D/g, ''),
      group_size: group_size.value,
      email: email.value,
      res_code: this.props.res_code
    };

    if (this.props.res_code) {
      // CASE 2: update existing reservation
      // res_code !== null
      socket.emit('updateReservation', formData);
    } else {
      // CASE 1: send new reservation
      // res_code === null
      socket.emit('addReservation', formData);
    }
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  }

  componentWillReceiveProps = () => {
    // receive res_code as props from MainARea.jsx and save it in state
    const { res_code } = this.props;
    getAllReservations()
      .then(result => {
        const currentReso = result.filter(reservation => reservation.res_code === res_code)[0];
        let { name, phone, group_size, email } = currentReso;
        console.log({ name, phone, group_size, email, res_code });
        this.setState({ name, phone, group_size, email, res_code });

      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <form onSubmit={this.handleFormSubmission}>
        <div className='field'>
          <label className='label is-medium'>Name*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={this.state.name}
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
              value={this.state.group_size}
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