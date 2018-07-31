import React, { Component } from 'react';



export default class Order extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      menuItems: []
    }
  }

  componentDidMount(){
    fetch(`/api/orders/${this.props.orderId}/menu_items`)
      .then((response) => {
        return response.json()
      })
      .then((menuItems) => {
        this.setState({
          menuItems: menuItems
        })
      })

  }
  
  render() {
    
    const orderItems = this.state.menuItems.map(item => {
      return (
        <li key={item.id}><span>{item.name}</span></li>
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

