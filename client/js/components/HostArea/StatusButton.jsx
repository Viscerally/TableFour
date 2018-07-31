import React, { Component } from 'react';

export default class StatusButton extends Component {
  constructor(props) {
    super(props);
  }

  createBtns = () => {
    const btnConfig = [
      { status: 'waiting', colorClass: 'is-warning' },
      { status: 'seated', colorClass: 'is-success' },
      { status: 'cancelled', colorClass: 'is-danger' },
    ];

    const btnGroup = btnConfig.map((config, index) => {
      let btnClass = 'button';
      if (this.props.status === config.status) {
        btnClass += ` ${config.colorClass} is-selected`;
      }
      return (
        <span
          key={index}
          data-key={this.props.id}
          onClick={event => this.props.selectBtn(event, config.status)}
          className={btnClass}
        >{config.status.toUpperCase()}</span>
      );
    });

    return btnGroup;
  }

  render() {
    return (
      <div className="buttons has-addons is-centered">
        {this.createBtns()}
      </div>
    );
  }
}