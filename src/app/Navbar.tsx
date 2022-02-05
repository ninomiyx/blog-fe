import React from 'react';
// import { Menu, Dropdown, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from './store';
import './Navbar.css';
import { logout } from '../features/users/userSclice';

const Navbar: React.FunctionComponent = () => {
  const userName = useSelector<RootState, string | undefined>(
    (state) => state.user.user?.displayName,
  );

  const dispatch = useDispatch();
  const nav = useNavigate();

  const onLogoutClicked = async () => {
    await dispatch(logout());
  };

  const directToEdit = () => {
    nav('/editprofile');
  };

  // const directToAdd = () => {
  //   nav('/addnewpost');
  // };
  // const directToPost = () => {
  //   nav(`/author/${currAuthorId}/1`);
  // };

  // const menu = (
  //   <Menu>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
  //         1st menu item
  //       </a>
  //     </Menu.Item>
  //     <Menu.Item>
  //       <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
  //         2nd menu item
  //       </a>
  //     </Menu.Item>
  //   </Menu>
  // );

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
                  <button type="button" className="button" onClick={directToEdit}>
                    {userName}
                    {' '}
                  </button>
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
