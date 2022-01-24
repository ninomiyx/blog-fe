import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from './store';
import './Navbar.css';
import { logout } from '../features/users/userSclice';

const Navbar: React.FunctionComponent = () => {
  const userName = useSelector<RootState, string | undefined>(
    (state) => state.user.user?.displayName,
  );
  const dispatch = useDispatch();

  const onLogoutClicked = async () => {
    await dispatch(logout());
  };

  return (
    <nav>
      <section>
        <div className="left">
          <img src="/logo192.png" alt="logo" className="logo" />
          <Link to="/">
            Blog Home
          </Link>
        </div>
        <div className="right">
          {
            userName
              ? (
                <div>
                  <i>{userName}</i>
                  <i> / </i>
                  <button type="button" className="button" onClick={onLogoutClicked}>Log out</button>
                </div>
              )
              : (
                <div>
                  <Link to="/login">Log in</Link>
                  <i> / </i>
                  <Link to="/signup">Sign up</Link>
                </div>
              )
          }
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
