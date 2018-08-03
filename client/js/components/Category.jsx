import React, { Component } from 'react';


export default class Category extends Component {
  render () {
    console.log(this.props.menu);
      return (
        <div key={this.props.menu.id} className="tile">
            <a onClick={() => {this.props.setMenu(this.props.menu)}}>
              <p className="title">{this.props.menu.name}</p>
            </a>
        </div>
      )
  }
}
