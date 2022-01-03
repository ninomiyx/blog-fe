import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  Post,
  fetchPosts,
  selectPostIds,
  selectPostById,
} from './postsSlice';

import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';

const PostExcerpt: React.FunctionComponent<{ postId: EntityId }> = ({ postId }) => {
  const post = useSelector<RootState, Post | undefined>((state) => selectPostById(state, postId));
  if (!post) return null;

  const date = new Date(post.lastModifiedTimestamp);

  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <span>TODO: show author</span>
      <TimeAgo timestamp={date} />
      <p>{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      <Link to={`/post/${post.id}`} className="button">
        View Post
      </Link>
    </article>
  );
};

const PostsList: React.FunctionComponent = () => {
  const { page: pageStr } = useParams();
  const page = parseInt(pageStr || '1', 10) || 1;
  const postIds = useSelector(selectPostIds);
  const status = useSelector<RootState, string>((state) => state.posts.status);
  const error = useSelector<RootState, Error | null>((state) => state.posts.error);
  const dispatch = useDispatch();

  // Sort posts in reverse chronological order
  const orderedPostIds = postIds.slice().reverse();

  // dispatch(action)
  // fetchPosts() return a action
  useEffect(() => {
    dispatch(fetchPosts({ page, pageSize: 10 }));
  }, [page, dispatch]);

  let content;

  if (status === 'loading') {
    content = <div className="loader">Loading...</div>;
  } else if (status === 'succeeded') {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ));
  } else if (status === 'error') {
    content = <div>{error}</div>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
      <div>
        {
          page > 1 ? <Link to={`/page/${page - 1}`}>previous</Link> : null
        }
        <span>{page}</span>
        <Link to={`/page/${page + 1}`}>next</Link>
      </div>
    </section>
  );
};

export default PostsList;
