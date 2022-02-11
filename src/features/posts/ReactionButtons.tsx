import React from 'react';
import { useDispatch } from 'react-redux';
import { Post, reactionChanged } from './postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  likes: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

const ReactionButtons: React.FunctionComponent<{ post: Post }> = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => (
    <button
      key={name}
      type="button"
      className="muted-button reaction-button"
      onClick={() => dispatch(reactionChanged({
        id: post.id,
        reaction: name,
      }))}
    >
      {emoji}
      {' '}
      {post.reactions[name]}
    </button>
  ));

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
