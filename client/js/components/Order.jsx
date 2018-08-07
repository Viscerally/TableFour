import React, { Component } from 'react';
import numeral from 'numeral';


export default class Order extends Component {


  render() {
    let positionCounter = 0;
    let totalPrice = 0;
    const orderItems = this.props.orderItems.map((item, index) => {
      let integerToCurrency = numeral(item.price / 100).format('$0.00')
      totalPrice += item.price;
      return (
        <tr key={item.id}>
          <th>{index + 1}</th>
          <td><span className="listItemName">{item.name}</span></td>
          <td>{integerToCurrency}</td>
          <td className='remove-from-order'>
            {this.props.order.order_code === 'nonce' ?
              <a className='button is-danger is-outlined is-small' onClick={() => { this.props.removeFromOrder(item) }}>
                <span>Remove</span>
                <span className='icon is-small'>
                  <i className='fas fa-times'></i>
                </span>
              </a> : null
            }

          </td>
        </tr>
      )
    });
    return (
      <article className='tile is-12 box is-vcentered'>
        <div className='content is-12 is-vcentered'>
          <span className='icon floaty-icon'>
            <i className="fas fa-utensils"></i>
          </span>
          <div className="order-list-text">
            <p className='order-list title is-4'>ORDER LIST</p>
            <table className="orderTable table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orderItems}
              </tbody>
              <tfoot>
                <tr>
                  <th><abbr title="Position"></abbr></th>
                  <th className='totalDescription'>Total to pay</th>
                  <th>{numeral(totalPrice / 100).format('$0.00')}</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
          {this.props.order && this.props.order.order_code === 'nonce' ?
            <button
              className="button is-link"
              onClick={() => { this.props.placeOrder() }}
            >Place your order</button> :
            <button
              className="button is-danger"
              onClick={() => { this.props.cancelOrder() }}
            >Cancel your order</button>}
        </div>

      </article>
    )
  }
}
