import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from 'rich-markdown-editor';
import { RootState } from '../../app/store';
import {
  Post,
  selectPostById,
  fetchPostById,
  editPostById,
} from './postsSlice';
import '../form.css';

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
  const onContentChanged = (value: () => string): void => {
    setContent(value());
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
    <section className="input-group">
      <h2 className="h2">Edit Post</h2>
      <form>
        <div className="input-group mb-3">
          <span className="input-group-text">Post Title</span>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            className="form-control"
            placeholder={title}
            value={title}
            onChange={onTitleChanged}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            Author:
            {' '}
            { author }
          </span>
        </div>
        <span>Post Content</span>
        <Editor defaultValue={content} onChange={onContentChanged} placeholder={content} />
        <div>
          <button type="button" onClick={onSaveClicked} disabled={!canSave} className="input-button">Save</button>
        </div>
      </form>
    </section>
  );
};

export default EditPostForm;
