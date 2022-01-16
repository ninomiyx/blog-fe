import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import {
  deletePostById,
  fetchPostById,
  Post,
  selectPostById,
} from './postsSlice';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';

const SinglePostPage: React.FunctionComponent = () => {
  const { postId: postStr } = useParams();
  const postId = postStr ? +postStr : 0;
  const post = useSelector<RootState, Post | undefined>((state) => selectPostById(state, postId));
  const dispatch = useDispatch();
  const nav = useNavigate();
  const status = useSelector<RootState, string>((state) => state.posts.status);
  const lastAction = useSelector<RootState, string>((state) => state.posts.lastAction);
  const error = useSelector<RootState, Error | null>((state) => state.posts.error);

  useEffect(() => {
    if (!post) dispatch(fetchPostById({ postId }));
  }, [postId, dispatch]);

  useEffect(() => {
    if (lastAction === 'deletePostById') {
      nav('/');
    }
  }, [status]);

  const onDeleteButtonClicked = async () => {
    const confirmed = window.confirm('Do you want to delete?');
    if (confirmed) {
      await dispatch(deletePostById({ postId }));
    }
  };

  let content;

  if (status === 'loading') {
    content = <div className="loader">Loading...</div>;
  } else if (status === 'succeeded') {
    if (!post) {
      content = <h2>Post not found</h2>;
    } else {
      const date = new Date(post.lastModifiedTimestamp);
      content = (
        <section>
          <h2>{post.title}</h2>
          <TimeAgo timestamp={date} />
          <span>TODO: show author</span>
          <p>{post.content}</p>
          <ReactionButtons post={post} />
          <button type="button" onClick={onDeleteButtonClicked}>Delete Post</button>
          <Link to={`/editPost/${post.id}`}>Edit Post</Link>
        </section>
      );
    }
  } else if (status === 'error') {
    content = <div>{error}</div>;
  }

  return (
    <div>
      {content}
    </div>
  );
};

export default SinglePostPage;
