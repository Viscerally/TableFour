import React, { Fragment } from 'react';

const NavbarBrand = () => {
  return (
    <div className='navbar-brand'>
      <a className='navbar-item' href='/'>
        <div className='navbar-logo'>
          <img src="/images/logo_1.png" alt="Table For Me"/>
        </div>
      </a>
    </div>
  );
};
const NavbarMenu = () => {
  return (
    <div className='navbar-menu'>
      <div className='navbar-start'>
        <div className='navbar-item'>
          <p className='control'>
            <span className='nav-quote'></span>
          </p>
        </div>
      </div>
      <div className='navbar-end'>
        <div className='navbar-item'>
          <div className='field is-grouped'>
            <p className='control'>
              <a className='button is-info' href='/admin'>
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
    <Fragment>
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <NavbarBrand />
        <NavbarMenu />
      </nav>
    </Fragment>
  );
}