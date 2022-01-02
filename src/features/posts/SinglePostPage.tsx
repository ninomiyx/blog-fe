import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { EntityId } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  Post,
  selectPostById,
} from './postsSlice';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';

const SinglePostPage: React.FunctionComponent = () => {
  const { postId: postStr } = useParams();
  const postId: EntityId = postStr || '0';
  const post = useSelector<RootState, Post | undefined>((state) => selectPostById(state, postId));
  if (!post) {
    return (
      <section>
        <h2>Post not found.</h2>
      </section>
    );
  }
  const date = new Date(post.lastModifiedTimestamp);

  return (
    <section>
      <h2>{post.title}</h2>
      <TimeAgo timestamp={date} />
      <span>TODO: show author</span>
      <p>{post.content}</p>
      <ReactionButtons post={post} />
    </section>
  );
};

export default SinglePostPage;
