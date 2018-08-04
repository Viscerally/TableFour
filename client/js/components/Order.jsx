import React, { Component } from 'react';
import numeral from 'numeral';


export default class Order extends Component {


  render() {
    if (this.props.order !== undefined){
      console.log('NEW ORDER RENDER: ', this.props.order.order_code);
    }
    let positionCounter = 0;
    let totalPrice = 0;
    const orderItems = this.props.orderItems.map((item,index) => {
      let integerToCurrency = numeral(item.price/100).format('$0.00')
      totalPrice += item.price;
      return (
        <tr key={item.id}>
          <th>{index + 1}</th>
          <td><span className="listItemName">{item.name}</span></td>
          <td>{integerToCurrency}</td>
          <td className='remove-from-order'>
            <a className='button is-danger is-outlined is-small' onClick={() => {this.props.removeFromOrder(item)}}>
              <span>Remove</span>
              <span className='icon is-small'>
                <i className='fas fa-times'></i>
              </span>
            </a>
          </td>
        </tr>
      )
    });

    if (this.props.order !== undefined){
      console.log(this.props.order);
    }

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
                <th>{numeral(totalPrice/100).format('$0.00')}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>          
          <button className="button is-link" onClick={() => {this.props.placeOrder()}}>Place your order</button>
        </div>
      </article>
    )
  }
}
