import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from './store';
import './Navbar.css';

const Navbar: React.FunctionComponent = () => {
  const status = useSelector<RootState, string>((state) => state.user.status);
  const userName = useSelector<RootState, string | undefined>(
    (state) => state.user.user?.displayName,
  );
  let loginbox;

  if (status === 'succeeded') {
    loginbox = (
      <div>
        <i>{userName}</i>
      </div>
    );
  } else {
    loginbox = (
      <div>
        <Link to="/login">Log in</Link>
        <i>/</i>
        <Link to="/signup">Sign up</Link>
      </div>
    );
  }
  return (
    <nav>
      <section>
        <Link to="/">Blog Home</Link>
        {
          status === 'succeeded'
            ? (
              <div>
                <i>{userName}</i>
              </div>
            )
            : (
              <div>
                <Link to="/login">Log in</Link>
                <i>/</i>
                <Link to="/signup">Sign up</Link>
              </div>
            )
        }
      </section>
    </nav>
  );
};

export default Navbar;
