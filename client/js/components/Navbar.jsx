import React, { Fragment } from 'react';

const NavbarBrand = () => {
  return (
    <div className='navbar-brand'>
      <a id="admin-button" className='button is-info' href='/admin'>
          <span className='icon'>
            <i className="fas fa-user" aria-hidden="true"></i>
          </span>
          <span>Admin</span>
        </a>
      <a className='navbar-item' href='/'>
        <img className='navbar-logo' id="nav-logo-size" src="/images/logo_1.png" alt="Table For Me"/>
      </a>
    
    </div>
  );
};
const NavbarMenu = () => {
  return (
    <div className='navbar-menu'>
    </div>
  );
};

export default function Navbar() {
  return (
    <Fragment>
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <NavbarBrand />
        <NavbarMenu />
      </nav>
    </Fragment>
  );
}