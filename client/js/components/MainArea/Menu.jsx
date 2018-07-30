import React, { Component } from 'react';
import bulmaCarousel from 'bulma-carousel/dist/js/bulma-carousel.js';

export default class Menu extends Component {
  constructor(props){
    super();

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
            <figure className="image is-1by1">
              <img
                className="is-background"
                src={menuItem.img_url}
                alt="item-description"
                width="250"
                height="250"
                />
            </figure>

            <div className="title">{menuItem.name}
              <div className="price">{menuItem.price}</div>
              <button className="button is-danger">Add to your order</button>
              </div>
          </div>
        )
      })

      const carousels = bulmaCarousel.attach();
      console.log(menuItems);

    }

    return (
        <div className='tile is-child carousel carousel-animated carousel-animate-slide'>
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
