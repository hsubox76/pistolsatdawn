import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const Navbar = (props) => (
  <div className="navbar is-primary">
    <div className="navbar-brand">
    <Link className="navbar-item" to="/">pistols at dawn</Link>
    </div>
    <div className="navbar-menu">
      <div className="navbar-end">
        <Link className="navbar-item" to="/">home</Link>
        {props.user
          ? <a className="navbar-item" onClick={() => props.onLogout()}>logout</a>
          : <Link className="navbar-item" to="/login">login</Link>}
      </div>
    </div>
  </div>
);

Navbar.propTypes = {
  setPage: PropTypes.func,
  onLogout: PropTypes.func,
  user: PropTypes.object
};

export default Navbar;