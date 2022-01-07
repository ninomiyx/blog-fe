import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useAppDispatch } from '../../app/store';
import { addNewPost, fetchPosts, Post } from './postsSlice';

const AddPostForm: React.FunctionComponent = () => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [addRequestStatus, setAddRequestStatus] = React.useState('idle');
  const dispatch = useDispatch();

  const newPost: Post = {
    id: -1,
    title,
    content,
    reactions: {},
    lastModifiedTimestamp: new Date().getTime(),
  };

  const onTitleChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value);
  };
  const onContentChanged = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    setContent(e.currentTarget.value);
  };
  const canSave = [title, content].every(Boolean) && addRequestStatus === 'idle';
  const onSaveClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        newPost.title = title;
        newPost.content = content;
        // dispatch(addNewPost) return a promise
        // and we can await it to know when thunk has finished the request
        // but we do not know whether this request is fulfilled or rejected
        // .unwrap() can help
        await dispatch(addNewPost(newPost));
        setTitle('');
        setContent('');
        await dispatch(fetchPosts({ page: 1, pageSize: 10 }));
      } catch (err) {
        console.log('Fail to save the post: ', err);
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <h2>Post Title:</h2>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <span>Post Author: TODO</span>
        <span>Post Content</span>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSaveClicked} disabled={!canSave}>Save</button>
      </form>
    </section>
  );
};

export default AddPostForm;
