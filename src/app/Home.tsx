import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearLastAction } from '../features/users/userSclice';
import PostsList from '../features/posts/PostList';
import { RootState } from './store';

const Home: React.FunctionComponent = () => {
  const nav = useNavigate();
  const { location: { hash } } = window;
  const dispatch = useDispatch();
  const lastAction = useSelector<RootState, string>((state) => state.user.lastAction);

  useEffect(() => {
    if (lastAction === 'changeprofile') dispatch(clearLastAction());
  }, [lastAction]);

  useEffect(() => {
    if (hash && hash.length > 1 && hash[1] === '/') {
      nav(hash.slice(1));
    }
  }, [hash]);
  return (
    <section>
      <PostsList />
    </section>
  );
};

export default Home;
