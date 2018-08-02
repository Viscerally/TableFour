import React, { Component } from 'react';


export default class Categories extends Component {
 
  render () {

    return (
      <article className="menuCategories">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <article className="appetizers tile is-child box">
              <p className="title"><a href>Appetizers</a></p>
        
            </article>
          </div>
          <div className="tile is-parent">
            <article className=" main tile is-child box">
              <p class="title"><a href>Main Dishes</a></p>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="desserts tile is-child box">
              <p className="title"><a href>Desserts</a></p>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="drinks tile is-child box">
              <p className="title"><a href>Drinks</a></p>
            </article>
          </div>
        </div>
          <div className="columns">
            <div className="column column is-one-quarter">
              First column
              <a className="button is-text">Appetizers</a>
            </div>
            <div className="column column is-one-quarter">
              Second column
              <a className="button is-text">Main Dishes</a>
            </div>
            <div className="column column is-one-quarter">
              Third column
              <a className="button is-text">Desserts</a>
            </div>
            <div className="column column is-one-quarter">
              Fourth column
              <a className="button is-text">Drinks</a>
            </div>  
          </div>
        </article>
    )
  }
}