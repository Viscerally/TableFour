import React, { Component } from 'react';


export default class Category extends Component {
  render () {
      return (
        <a key={this.props.menu.id} onClick={() => {this.props.setMenu(this.props.menu)}}>
        <article className="menuCategories">
            <div className="tile is-ancestor">
              <div className="tile is-parent">
                <article className="tile is-child box">
                  <div className="tile">
                    <p className="title">{this.props.menu.name}</p>
                  </div>        
                </article>
              </div>
            </div>
          </article>
          
        </a>
        
      )
  }
}
