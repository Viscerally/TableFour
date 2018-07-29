import React, { Component } from 'react';
import bulmaCarousel from 'bulma-carousel/dist/js/bulma-carousel.js';

export default class Menu extends Component {
  componentDidMount(){
    const carousels = bulmaCarousel.attach();
    console.log('Carousels: ', carousels);
  }
  render() {    
    return (
        <div className='carousel carousel-animated carousel-animate-slide'>
          <div className='carousel-container'>
            <div className='carousel-item has-background is-active'>
              <img className="is-background" src="https://placebear.com/250/250" alt="" width="250" height="250" />
              <div className="title">Beary Christmas</div>
            </div>
            <div className='carousel-item has-background is-active'>
              <img className="is-background" src="https://placebear.com/250/250" alt="" width="250" height="250" />
              <div className="title">Happy Pawnnakah</div>
            </div>
            <div className='carousel-item has-background is-active'>
              <img className="is-background" src="https://placebear.com/250/250" alt="" width="250" height="250" />
              <div className="title">Beary Christmas</div>
            </div>
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
