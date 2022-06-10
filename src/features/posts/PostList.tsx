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
import './PostList.css';

export const PostExcerpt: React.FunctionComponent<{ postId: EntityId }> = ({ postId }) => {
  const post = useSelector<RootState, Post | undefined>((state) => selectPostById(state, postId));
  if (!post) return null;

  const date = new Date(post.lastModifiedTimestamp);
  const currAuthorId = post.authorId;
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div className="author">
        <span>
          Author:
          <Link to={`/author/${currAuthorId}/1`}>{post.displayName}</Link>
        </span>
        <TimeAgo timestamp={date} />
      </div>
      {/* <p className="post-content">{post.content.substring(0, 100)}</p> */}
      <ReactionButtons post={post} />
      <Link to={`/post/${post.id}`} className="button">
        View&nbsp;Post
      </Link>
    </article>
  );
};

const PostsList: React.FunctionComponent = () => {
  const { page: pageStr } = useParams();
  const page = parseInt(pageStr || '1', 10) || 1;
  const postIds = useSelector(selectPostIds);
  const status = useSelector<RootState, string>((state) => state.posts.status);
  const dispatch = useDispatch();
  const userId = useSelector<RootState, number | undefined>(
    (state) => state.user.user?.id,
  );

  // Sort posts in reverse chronological order
  const orderedPostIds = postIds.slice().reverse();

  // dispatch(action)
  // fetchPosts() return a action
  useEffect(() => {
    dispatch(fetchPosts({ page, pageSize: 10 }));
  }, [page, dispatch]);

  return (
    <section className="post">
      <h2>Posts</h2>
      {
        status === 'succeeded' ? <div className="hidden" /> : <div>{status}</div>
      }
      {
        orderedPostIds.map((postId) => (
          <PostExcerpt key={postId} postId={postId} />
        ))
      }
      <div className="page">
        {
          page > 1 ? <Link to={`/page/${page - 1}`}>previous</Link> : null
        }
        <span>&emsp;</span>
        <span>{page}</span>
        <span>&emsp;</span>
        <Link to={`/page/${page + 1}`}>next</Link>
      </div>
      <div className="add">
        {
          userId ? <Link to="/addnewpost">+</Link> : <Link to="/login">+</Link>
        }
      </div>
    </section>
  );
};

export default PostsList;
