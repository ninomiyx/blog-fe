import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const UserPage: React.FunctionComponent = () => {
  const userName = useSelector<RootState, string | undefined>(
    (state) => state.user.user?.displayName,
  );
  const userId = useSelector<RootState, number | undefined>(
    (state) => state.user.user?.id,
  );

  return (
    <section>
      <h2>Add a New Post</h2>
      <span>Post Author: </span>
    </section>
  );
};

export default UserPage;
