import React, { Component } from 'react';

export default class Category extends Component {
  render() {
    const { menu, setMenu } = this.props;
    return (
      <a onClick={() => setMenu(menu)} className="tile is-parent">
        <article className="tile is-child box menuCategories has-text-centered">
          <span className="title is-4">
            {menu.name}
          </span>
        </article>
      </a>
    )
  }
}
