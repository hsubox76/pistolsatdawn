import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const Navbar = (props) => (
  <div className="navbar">
    <div className="navbar-link"><Link to="/">pistols at dawn</Link></div>
    <div className="submenu">
      <div className="navbar-link"><Link to="/">home</Link></div>
      {props.user
        ? <div className="navbar-link" onClick={() => props.onLogout()}>logout</div>
        : <div className="navbar-link"><Link to="/login">login</Link></div>}
    </div>
  </div>
);

Navbar.propTypes = {
  setPage: PropTypes.func,
  onLogout: PropTypes.func,
  user: PropTypes.object
};

export default Navbar;