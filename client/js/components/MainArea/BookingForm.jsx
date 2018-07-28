import React, { Component } from 'react';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', phone: '', group_size: '', email: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  render() {
    return (
      <form onSubmit={this.props.handleResoFormSubmit}>
        <div className='field'>
          <label className='label is-medium'>Name</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-large'
              value={this.state.value}
              onChange={this.handleChange}
              name='name'
              type='text'
              placeholder='Your name'
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
          <label className='label is-medium'>Phone</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-large'
              value={this.state.phone}
              onChange={this.handleChange}
              name='phone'
              type='tel'
              placeholder='7788873994'
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
          <label className='label is-medium'>Group Size</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-large'
              value={this.state.value}
              onChange={this.handleChange}
              name='group_size'
              type='number'
              min='1'
              placeholder='e.g. 2'
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
          <label className='label is-medium'>Email</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-large'
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