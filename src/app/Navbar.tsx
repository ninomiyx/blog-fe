import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar = (): JSX.Element => (
  <nav>
    <section>
      <Link to="/">Blog Home</Link>
      <div>
        <Link to="/login">Log in</Link>
        <i>/</i>
        <Link to="/signup">Sign up</Link>
      </div>
    </section>
  </nav>
);

export default Navbar;
