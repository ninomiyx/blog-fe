import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from 'rich-markdown-editor';
import { RootState } from '../../app/store';
import {
  deletePostById,
  fetchPostById,
  Post,
  selectPostById,
} from './postsSlice';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import './PostList.css';

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
    if (status === 'succeeded' && lastAction === 'deletePostById') {
      nav('/');
    }
  }, [status]);

  const onDeleteButtonClicked = async () => {
    // TODO use html for confirm
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Do you want to delete?');
    if (confirmed) {
      await dispatch(deletePostById({ postId }));
    }
  };

  const userId = useSelector<RootState, number | undefined>(
    (state) => state.user.user?.id,
  );
  const authorId = post?.authorId;

  let content;

  if (status === 'loading') {
    content = <div className="loader">Loading...</div>;
  } else if (status === 'succeeded') {
    if (!post) {
      content = <h2>Post not found</h2>;
    } else {
      const date = new Date(post.lastModifiedTimestamp);
      content = (
        <section className="post-excerpt">
          <h2>{post.title}</h2>
          <div className="author">
            <span>
              Author:
              <Link to={`/author/${post.authorId}/1`}>{post.displayName}</Link>
            </span>
            <TimeAgo timestamp={date} />
          </div>
          <Editor value={`${post.content}`} readOnly />
          {
            authorId === userId ? (
              <section>
                <button type="button" onClick={onDeleteButtonClicked} className="button">Delete&nbsp;Post</button>
                <span>&emsp;</span>
                <Link to={`/editPost/${post.id}`}>Edit&nbsp;Post</Link>
              </section>
            ) : <ReactionButtons post={post} />
          }
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
