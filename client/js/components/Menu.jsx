import React, { Component } from 'react';
import bulmaCarousel from 'bulma-carousel/dist/js/bulma-carousel.js';
import numeral from 'numeral';

export default class Menu extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    fetch('/api/menu_items')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          menu_items: data
        })
      })
      .catch(err => {
        reject(err.stack);
      })
  }


  render() {    
    let menuItems;
    if (this.state){
      menuItems = this.state.menu_items.map((menuItem) => {
        return (
          <div key={menuItem.id} className='carousel-item has-background'>
              <img
                className="is-background"
                src={menuItem.img_url}
                alt="item-description"
                width="250"
                height="250"
                />

            <div className="title">{menuItem.name}
              <div className="price">{numeral(menuItem.price/100).format('$0.00')}</div>
              <button onClick={(e) => this.props.addToOrder(menuItem)} className="button is-danger">Add to your order</button>
              </div>
          </div>
        )
      })

      const carousels = bulmaCarousel.attach();

    }

    return (
        <div className='carousel carousel-animated carousel-animate-slide' >
          <div className='carousel-container'>
              {menuItems}
          </div>
          <div className="carousel-navigation">
            <div className="carousel-nav-left">
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </div>
            <div className="carousel-nav-right">
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
    );
  }
}
