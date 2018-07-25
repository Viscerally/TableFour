import React, { Component, Fragment } from 'react';
import fetch from 'cross-fetch';
import Navbar from '../Navbar.jsx';

export default class MainArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: []
    };
    this.showLocation = this.showLocation.bind(this);
  }

  showLocation() {
    console.log(this.state.locations);
    return this.state.locations.map(
      loc =>
      <li key={loc.Id}>
        <img src={loc.image} alt={loc.name} />
        {loc.name}
      </li>
    )
  }

  componentDidMount() {
    fetch('/api/locations')
      .then(res => res.json())
      .then(locations => this.setState({ locations }));
  }

  render() {
    return (
      <Fragment>
        <Navbar />
        <div clasName='home-page-container'>
          {this.showLocation()}
        </div>
      </Fragment>
    );
  }
}