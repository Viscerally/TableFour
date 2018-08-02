import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { namifyStr, getOnlyNumbers } from '../../libs/form-helper-func.js';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    let reservation;
    if (this.props.current_reservation){
      reservation = this.props.current_reservation
    }else{
      reservation = {
        placement_time: '',
        order_id: '',
        status: '',
        group_size: '2',
        customer_id: ''
      }
    }
    let customer;
    if (this.props.customer){
      customer = this.props.current_customer
    }else{
      customer = {
        name: ' ',
        phone: '',
        email: ''
      }
    }
    this.state = {
      reservation: reservation,
      customer: customer,
    }
  }

  handleFormSubmission = event => {
    event.preventDefault();
    console.log('I am submitting! ', this.state);

    this.props.socket.emit(`submitReservation`, {
      name: namifyStr(this.state.customer.name),
      phone: getOnlyNumbers(this.state.customer.phone),
      group_size: this.state.reservation.group_size,
      email: this.customer.email,
      res_code: this.props.res_code,
    })
  }

  cancelReservation = event => {
    event.preventDefault();

    this.props.socket.emit('cancelReservation', {
      res_code: this.props.res_code
    })
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
        type='submit'
        onClick={(e) => this.cancelReservation()}
        className="button is-danger"
        >CANCEL</button>
      )
  }

  submitButton = () => {
    return (
      <button
        type='submit'
        onClick={(e) => this.handleFormSubmission()}
        className="button is-link"
        >SUBMIT</button>
      )
  }

  handleReservationChange = ({ target: { name, value } }) => {
    this.setState(oldState => {
      const { reservation } = oldState;
      reservation[name] = value;
      return { ...oldState, reservation };
    })
  }

  handleNameChange = (e) => {
    this.setState({
      customer: {
        name: e.target.value
      }
    })
  }

  handleEmailChange = (e) => {
    this.setState({
      customer: {
        email: e.target.value
      }
    })
  }

  handlePhoneChange = (e) => {
    this.setState({
      customer: {
        phone: e.target.value
      }
    })
  }

  handleSizeChange = (e) => {
    this.setSate({
      reservation: {
        group_size: e.target.value
      }
    })
  }

  // if updated props !== current state, then replace it with new props
  componentDidUpdate(prevProps, prevState) {
    const { formData } = this.props;
    if (prevState.formData !== formData) {
      this.setState({ formData });
    }
  }

  render() {
    const { group_size } = this.state.reservation;
    const { name, phone, email } = this.state.customer;
    return (
      <form onSubmit={this.handleFormSubmission}>
        <div className='field'>
          <label className='label is-medium'>Name*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={name}
              onChange={this.handleNameChange}
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
              value={phone}
              onChange={this.handlePhoneChange}
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
              value={group_size}
              onChange={this.handleSizeChange}
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
              value={email}
              onChange={this.handleEmailChange}
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

        <div className="field is-centered is-grouped">
          <p className="control">
            {this.updateButton()}
          </p>
          <p className="control">
            {this.cancelButton()}
          </p>
        </div>
      </form>
    );
  }
}
