import React, { Component } from 'react';

export default class Order extends Component {



  render() {
    const orderItems = this.props.orderItems.map(item => {

      return (
        <tr key={item.id}>
        <th>{/*index + 1*/}</th>
        <td><span className="listItemName">{item.name}</span></td>
        <td>{item.price}</td>
        </tr>

      )
    });

    return (
      <article className='tile is-12 box'>
       <div className='content'>
          <p className='title is-4'>ORDER LIST</p>
          <table className="orderTable">
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
                <th className='totalDescription'>Total to pay</th>
                <th>{/*totalPrice*/}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
          <button className="button is-link">Place your order</button>
        </div>
      </article>
    )
  }
}
