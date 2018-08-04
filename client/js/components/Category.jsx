import React, { Component } from 'react';


export default class Category extends Component {
  render() {
    const { menu, setMenu } = this.props;
    return (
      <a key={menu.id} onClick={() => { setMenu(menu) }}>
          <span className="title is-4">
            {menu.name}
          </span>
      </a>

    )
  }
}
