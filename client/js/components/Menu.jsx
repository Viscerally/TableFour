import React, { Component } from 'react';
import bulmaCarousel from 'bulma-carousel/dist/js/bulma-carousel.js';
import numeral from 'numeral';
import Slider from 'react-slick';

export default class Menu extends Component {
  constructor(props) {
    super(props);
  }

  generateButton = menuItem => {
    return (
      <button
        onClick={event => this.props.addToOrder(menuItem)}
        className="button is-danger"
        disabled={!this.props.reservation.id}
      >Add to your order
    </button>
    );
  }

  generateMenu = () => {
    let menuItems = [];
    let menuItemComponents;
    if (this.props.currentMenu.menuItems !== undefined) {
      menuItems = this.props.currentMenu.menuItems;
      menuItemComponents = menuItems.map((menuItem) => {
        return (
          <div key={menuItem.id} className='carousel-item has-background'>
            <figure>
              <img
                className="is-background"
                src={menuItem.img_url}
                alt="item-description"
                width="250"
                height="250"
              />
            </figure>
            <div className="title">{menuItem.name}
              <div className="price">
                {numeral(menuItem.price / 100).format('$0.00')}
              </div>
              {this.generateButton(menuItem)}
            </div>
          </div>
        )
      })
      return menuItemComponents;
    }
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1
    };
    return (
      <div>
        <h2> Single Item</h2>
        <Slider {...settings}>
          {this.generateMenu()}
        </Slider>
      </div>
    );
  }
}
