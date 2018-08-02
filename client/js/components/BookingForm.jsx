import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { blankReservation, blankCustomer, resoData } from '../../libs/form-helper-func.js';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      reservation: props.currentReservation,
      customer: props.currentCustomer
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('PREVPROPS: ', prevProps);
    console.log('PREVSTATE: ', prevState);
    console.log('UPDATE STATE: ', this.state);
    console.log('UPDATE PROPS: ', this.props);
    const { reservation, customer } = this.state;
    if (prevProps.currentReservation.res_code !== this.props.currentReservation.res_code) {
      this.setState({
        reservation: this.props.currentReservation,
        customer: this.props.currentCustomer
      })
    }
    if (prevProps.currentCustomer.name !== this.props.currentCustomer.name ||
        prevProps.currentCustomer.phone !== this.props.currentCustomer.phone ||
        prevProps.currentCustomer.email !== this.props.currentCustomer.email
      ){
        this.setState({
          customer: this.props.currentCustomer
        })
      }
    }

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.reservation.res_code){
      this.createReservation();
    }else{
      this.updateReservation();
    }
  }

  createReservation = () => {
    this.props.socket.emit(`submitReservation`, resoData(this.state));
  }

  updateReservation = () => {
    let reso = resoData(this.state)
    reso.resId = this.state.reservation.id;
    reso.custId = this.state.customer.id;
    this.props.socket.emit(`updateReservation`, reso);
  }

  cancelReservation = (event) => {
    event.preventDefault();
    console.log('RES_CODE: ', this.state.reservation.res_code);
    this.props.socket.emit('cancelReservation', {
      res_code: this.state.reservation.res_code
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
        onClick={this.cancelReservation}
        className="button is-danger"
        >CANCEL</button>
      )
  }

  submitButton = () => {
    return (
      <button
        type='submit'
        className="button is-link"
        >SUBMIT</button>
      )
  }

  // handle changes in input boxes
  handleCustomerChange = ({ target: { name, value } }) => {
    this.setState(oldState => {
      const { customer } = oldState;
      customer[name] = value;
      return { customer };
    })
  }

  handleReservationChange = ({ target: {name, value }}) => {
    this.setState(oldState => {
      const { reservation } = oldState;
      reservation[name] = value;
      return { reservation };
    })
  }

  render() {
    console.log("BOOKINGFORM RES CODE: ", this.state.reservation.res_code);
    const { group_size } = this.state.reservation;
    const { name, phone, email } = this.state.customer;
    return (
      <form onSubmit={this.handleSubmit} >
        <div className='field'>
          <label className='label is-medium'>Name*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={name}
              onChange={this.handleCustomerChange}
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
              onChange={this.handleCustomerChange}
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
              onChange={this.handleReservationChange}
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
              onChange={this.handleCustomerChange}
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
          {/*Button rendering depends on if reservation has been created*/}
            { this.state.reservation.res_code ? (
              this.updateButton() ):(
              this.submitButton()
            )}
          </p>
          <p className="control">
          { this.state.reservation.res_code ? (
            this.cancelButton() ):(
            null
          )}
          </p>
        </div>
      </form>
    );
  }
}
