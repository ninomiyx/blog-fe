import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import {
  Post,
  selectPostById,
  fetchPostById,
  editPostById,
} from './postsSlice';

const EditPostForm: React.FunctionComponent = () => {
  const { postId: postStr } = useParams();
  const postId = postStr ? +postStr : 0;
  const post = useSelector<RootState, Post | undefined>((state) => selectPostById(state, postId));
  const author = post?.displayName === undefined ? '' : post.displayName;
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    if (!post) dispatch(fetchPostById({ postId }));
  }, [postId, dispatch]);

  const [title, setTitle] = useState(post ? post.title : '');
  const [content, setContent] = useState(post ? post.content : '');
  const onTitleChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value);
  };
  const onContentChanged = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    setContent(e.currentTarget.value);
  };
  const canSave = [title, content].every(Boolean);
  const newPost: Post = {
    id: postId,
    title,
    content,
    reactions: {},
    lastModifiedTimestamp: new Date().getTime(),
    postTimestamp: new Date().getTime(),
    authorId: 0,
    displayName: author,
  };

  const onSaveClicked = async () => {
    if (canSave) {
      await dispatch(editPostById(newPost));
      nav(`/post/${postId}`);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <h3>Post Title:</h3>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder={title}
          value={title}
          onChange={onTitleChanged}
        />
        <span>
          Post Author:
          {author}
        </span>
        <span>Post Content</span>
        <textarea
          id="postContent"
          name="postContent"
          placeholder={content}
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSaveClicked} disabled={!canSave}>Save</button>
      </form>
    </section>
  );
};

export default EditPostForm;
