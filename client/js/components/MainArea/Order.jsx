import React, { Component } from 'react';



export default class Order extends Component {

   
 

  render() {
    let orderItems;
    if(this.props.order){
    orderItems = this.props.order.map(menuItem => {
    
    });
  }

    return (
        <div className="OrderDisplay">
        <h3>Order List</h3>
        <ol>
          <li>{this.props.menuItem}</li>
        
          total
        </ol>
        <button className="button is-link">Pay for your order</button>
         
        </div>
    );
  }
}

