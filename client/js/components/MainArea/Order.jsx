import React, { Component } from 'react';



export default class Order extends Component {
 
  render() {    
    
    const orderItems = this.props.orderItems.map(item => {
      return (
        <li key={item.id}><span>{item.id}</span></li>
      )
    });

    return (
        <div className="OrderDisplay">
        <h3>Order List</h3>
        <ol>
          {orderItems}        
          total
        </ol>
        <button className="button is-link">Pay for your order</button>         
        </div>
    )
  }
}

