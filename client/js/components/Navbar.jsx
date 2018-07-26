import React, { Component } from 'react';

const NavbarBrand = () => {
  return (
    <div className='navbar-brand'>
      <a className='navbar-item' href='/'>
        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28" />
      </a>
    </div>
  );
};
const NavbarMenu = () => {
  return (
    <div className='navbar-menu'>
      <div className='navbar-end'>
        <div className='navbar-item'>
          <div className='field is-grouped'>
            <p className='control'>
              <a className='button is-danger' href='/admin'>
                <span className='icon'>
                  <i className="fas fa-user" aria-hidden="true"></i>
                </span>
                <span>Admin</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Navbar() {
  return (
    <header>
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <NavbarBrand />
        <NavbarMenu />
      </nav>
    </header>
  );
}