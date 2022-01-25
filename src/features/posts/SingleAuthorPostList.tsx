import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { RootState } from '../../app/store';
import {
  selectPostIds,
  fetchPostByAthorId,
} from './postsSlice';
import { PostExcerpt } from './PostList';

const SingleAuthorPostList: React.FunctionComponent = () => {
  const { authorId: authorIdStr, page: pageStr } = useParams();
  const authorId = parseInt(authorIdStr || '0', 10) || 0;
  if (authorId === 0) return null;
  const page = parseInt(pageStr || '1', 10) || 1;
  const postIds = useSelector(selectPostIds);
  const status = useSelector<RootState, string>((state) => state.posts.status);
  const error = useSelector<RootState, Error | null>((state) => state.posts.error);
  const dispatch = useDispatch();
  const authorName = useSelector<RootState, string | undefined>(
    (state) => state.posts.entities[postIds[0]]?.displayName,
  );
  // console.log(postIds);
  // Sort posts in reverse chronological order
  const orderedPostIds = postIds.slice().reverse();

  useEffect(() => {
    dispatch(fetchPostByAthorId({ page, pageSize: 10, authorId }));
  }, [page, dispatch, authorId]);

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
    <section className="post">
      <h2>
        { authorName }
        &nbsp;
        Posts
      </h2>
      {content}
      <div className="page">
        {
          page > 1 ? <Link to={`/page/${page - 1}`}>previous</Link> : null
        }
        <span>{page}</span>
        <Link to={`/page/${page + 1}`}>next</Link>
      </div>
    </section>
  );
};

export default SingleAuthorPostList;
