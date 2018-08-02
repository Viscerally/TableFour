import React, { Component } from 'react';


export default class Category extends Component {
 
  render () {

    return (
      <article className="menuCategories">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <article className="appetizers tile is-child box">
              <a href><p className="title">Appetizers</p></a>
            </article>
          </div>
          <div className="tile is-parent">
            <article className=" main tile is-child box">
              <a href><p class="title">Main Dishes</p> </a>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="desserts tile is-child box">
             <a href><p className="title">Desserts</p></a>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="drinks tile is-child box">
              <a href><p className="title">Drinks</p></a>
            </article>
          </div>
        </div>
       </article>
    )
  }
}