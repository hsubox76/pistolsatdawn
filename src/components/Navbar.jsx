import React, { PropTypes } from 'react';

const Navbar = (props) => (
  <div className="navbar">
    <div className="navbar-link">pistols at dawn</div>
    <div className="submenu">
      <div className="navbar-link" onClick={() => props.setPage('duel')}>duel</div>
      {props.user
        ? <div className="navbar-link" onClick={() => props.onLogout()}>logout</div>
        : <div className="navbar-link" onClick={() => props.setPage('login')}>login</div>}
    </div>
  </div>
);

Navbar.propTypes = {
  setPage: PropTypes.func,
  onLogout: PropTypes.func,
  user: PropTypes.object
};

export default Navbar;