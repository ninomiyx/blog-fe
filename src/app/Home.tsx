import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PostsList from '../features/posts/PostList';

const Home: React.FunctionComponent = () => {
  const nav = useNavigate();
  const { location: { hash } } = window;
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
