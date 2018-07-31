import React, { Component } from 'react';

export default class Order extends Component {
  
  
  render() {
    console.log(`\n\n\n ${this.props.orderItems[0]}`);
    console.log('Order is rendering');
    const orderItems = this.props.orderItems.map(item => {
   
      return (
        <tr key={item.id}>
        <td></td>
        <td>{item.name}</td>
        <td>{item.price}</td>
        </tr>
        
      )
    });

    console.log("order Items",orderItems)

    return (
        <div className="OrderDisplay">
         <p className='title is-4'>ORDER LIST</p>
        
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderItems}
          </tbody>
          <tfoot>
            <tr>
              <th><abbr title="Position"></abbr></th>
              <th>Total</th>
              <th>$100</th>
              <th></th>
            </tr>
          </tfoot>  
        </table>
        <button className="button is-link">Place your order</button>
        </div>
    )
  }
}

