import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { blankReservation, blankCustomer, resoData } from '../../libs/form-helper-func.js';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservation: blankReservation(),
      customer: blankCustomer(),
      // path refers to where the form was submitted (customer or admin)
      path: ''
    }
  }

  // ADD NEW RESERVATION - DO NOT CHANGE
  createReservation = () => {
    this.props.socket.emit('submitReservation', resoData(this.state));
  }

  // UPDATE EXISTING RESERVATION - DO NOT CHANGE
  updateReservation = () => {
    const { customer, reservation } = this.state;
    this.props.socket.emit('updateReservation', { ...customer, ...reservation });
  }

  // CANCEL RESERVATION - DO NOT CHANGE
  cancelReservation = event => {
    event.preventDefault();
    const { res_code } = this.props.reservation;
    this.props.socket.emit('cancelReservation', { res_code });
  }

  // FORM SUBMISSION - DO NOT CHANGE
  handleSubmit = event => {
    event.preventDefault();
    const { res_code } = this.state.reservation;

    if (res_code) {
      this.updateReservation();
    } else {
      this.createReservation();
    }
  }

  // CREATE BUTTONS - DO NOT CHANGE
  submitButton = () => {
    return (
      <button
        type='submit'
        className="button is-link"
      >SUBMIT</button>
    )
  }

  updateButton = () => {
    return (
      <button
        type='submit'
        className="button is-success"
      >UPDATE</button>
    )
  }

  cancelButton = () => {
    return (
      <button
        onClick={this.cancelReservation}
        className="button is-danger"
      >CANCEL</button>
    )
  }
  // CREATE BUTTONS - END

  // HANDLE CUSTOMER INPUTS - DO NOT CHANGE
  handleCustomerChange = ({ target: { name, value } }) => {
    this.setState(oldState => {
      const { customer } = oldState;
      customer[name] = value;
      return { customer };
    })
  }

  // HANDLE RESERVATION INPUTS - DO NOT CHANGE
  handleReservationChange = ({ target: { name, value } }) => {
    this.setState(oldState => {
      const { reservation } = oldState;
      reservation[name] = value;
      return { reservation };
    })
  }

  // DO NOT CHANGE
  componentDidMount() {
    const { socket, urls } = this.props;
    this.setState({ path: urls.path });
    // check the url path
    if (urls.path === '/reservations/:res_code') {
      // if res_code is given as a url param, request customer and reservation
      // associated with the res_code and save them in state
      socket.emit('getCustomerByResCode', urls.params.res_code);
      socket.emit('getReservationByResCode', urls.params.res_code);
      socket.on('loadCustomer', customer => {
        this.setState({ customer });
      })
      socket.on('loadReservation', reservation => {
        this.setState({ reservation });
      })
    }
  }

  render() {
    const { customer: { name, phone, email }, reservation: { group_size } } = this.state;
    return (
      <form onSubmit={this.handleSubmit} >
        <div className='field'>
          <label className='label'>Name*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input'
              value={name}
              onChange={this.handleCustomerChange}
              name='name'
              type='text'
              placeholder='Name'
              required
            />
            <span className='icon is-left'>
              <i className='fas fa-user-alt'></i>
            </span>
            <span className='icon is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Phone*</label>
          <div className='control has-icons-left has-icons-right'>
            <NumberFormat
              className='input'
              format='(###) ###-####'
              value={phone}
              onChange={this.handleCustomerChange}
              name='phone'
              type='tel'
              placeholder='(778) 123-4567'
              required
            />
            <span className='icon is-left'>
              <a className='button is-static'>+1</a>
            </span>
            <span className='icon is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Group Size*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input'
              value={group_size}
              onChange={this.handleReservationChange}
              name='group_size'
              type='number'
              min='1'
              max='10'
              placeholder='e.g. 2'
              required
            />
            <span className='icon is-left'>
              <i className='fas fa-user-alt'></i>
            </span>
            <span className='icon is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label'>Email (optional)</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input'
              value={email}
              onChange={this.handleCustomerChange}
              name='email'
              type='email'
              placeholder='example@gmail.com'
            />
            <span className='icon is-left'>
              <i className='fas fa-envelope'></i>
            </span>
            <span className='icon is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className="field is-centered is-grouped">
          <p className="control">
            {/*Button rendering depends on if reservation has been created*/}
            {this.props.reservation.res_code ?
              (this.updateButton()) : (this.submitButton())}
          </p>
          <p className="control">
            {this.props.reservation.res_code ?
              (this.cancelButton()) : (null)}
          </p>
        </div>
      </form>
    );
  }
}
