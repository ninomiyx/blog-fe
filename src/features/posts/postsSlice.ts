import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState, AppThunk } from '../../app/store';
import client from '../../api/client';

export interface PostReaction {
  [key: string]: number,
}

export interface Post {
  id: number;
  title: string;
  content: string;
  reactions: PostReaction;
  lastModifiedTimestamp: number;
  postTimestamp: number;
  authorId: number;
  displayName: string;
}

export interface FetchPostsArgs {
  page: number;
  pageSize: number;
}

export interface PostByIdArgs {
  postId: number;
}

export interface FetchPostsByAuthorIdArgs {
  page: number;
  pageSize: number;
  authorId: number;
}

// client.gets
// generate a promise
// promise will return 2 actions (pending, fulfilled/rejected)
export const fetchPosts = createAsyncThunk<Post[], FetchPostsArgs>(
  'posts/fetchPosts',
  async ({ page, pageSize }) => client.get<Post[]>(`/api/posts?page=${page}&pageSize=${pageSize}`),
);

export const fetchPostById = createAsyncThunk<Post, PostByIdArgs>(
  'posts/fetchPostById',
  async ({ postId }) => client.get<Post>(`/api/post/${postId}`),
);

export const fetchPostByAthorId = createAsyncThunk<Post[], FetchPostsByAuthorIdArgs>(
  'posts/fetchPostByAuthorId',
  async ({ page, pageSize, authorId }) => client.get<Post[]>(`/api/author/${authorId}?page=${page}&pageSize=${pageSize}`),
);

export const deletePostById = createAsyncThunk<void, PostByIdArgs>(
  'posts/deleteOldPost',
  async ({ postId }) => client.del(`/api/post/${postId}`),
);

export const editPostById = createAsyncThunk<Post, Post>(
  'posts/editPost',
  async ({
    id, title, content, lastModifiedTimestamp, authorId, displayName,
  }) => {
    const response = client.put<Post, Post>(
      `/api/post/${id}`,
      {
        id,
        title,
        content,
        lastModifiedTimestamp,
        reactions: {},
        postTimestamp: lastModifiedTimestamp,
        authorId,
        displayName,
      },
    );
    return response;
  },
);
// add initialPost to backend database
// returned response includes initialPost and an unique ID
export const addNewPost = createAsyncThunk<Post, Post>(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post<Post, Post>(
      '/api/posts',
      initialPost,
    );
    return response;
  },
);

// id: entity:{}
const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => a.id - b.id,
});

export const {
  selectAll: selectAllPosts,
  selectIds: selectPostIds,
  selectById: selectPostById,
} = postsAdapter.getSelectors<RootState>((state) => state.posts);

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    lastAction: '',
    status: 'idle',
    recentNewPostId: -1,
    error: null,
  }),
  // In reducers, we create an action and response to it
  // In extraReducers, we only response to a already created action
  reducers: {
    postsCleared: postsAdapter.removeAll,
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction] += 1;
      }
    },
  },
  extraReducers: {
    /* eslint-disable no-param-reassign */
    [fetchPosts.pending.type]: (state) => {
      state.lastAction = 'fetchPosts';
      state.status = 'loading';
      state.error = null;
      postsAdapter.removeAll(state);
    },
    [fetchPosts.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        postsAdapter.upsertMany(state, action.payload);
        state.status = 'succeeded';
      }
    },
    [fetchPosts.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [fetchPostById.pending.type]: (state) => {
      state.lastAction = 'fetchPostById';
      state.status = 'loading';
      state.error = null;
      postsAdapter.removeAll(state);
    },
    [fetchPostById.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        postsAdapter.addOne(state, action.payload);
        state.status = 'succeeded';
      }
    },
    [fetchPostById.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [fetchPostByAthorId.pending.type]: (state) => {
      state.lastAction = 'fetchPostByAthorId';
      state.status = 'loading';
      state.error = null;
      postsAdapter.removeAll(state);
    },
    [fetchPostByAthorId.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        postsAdapter.upsertMany(state, action.payload);
        state.status = 'succeeded';
      }
    },
    [fetchPostByAthorId.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [addNewPost.pending.type]: (state) => {
      state.lastAction = 'addNewPost';
      state.status = 'loading';
      state.error = null;
    },
    [addNewPost.fulfilled.type]: (state, action) => {
      postsAdapter.addOne(state, action.payload);
      state.recentNewPostId = action.payload.id;
      state.status = 'succeeded';
    },
    [deletePostById.pending.type]: (state) => {
      state.lastAction = 'deletePostById';
      state.status = 'loading';
      state.error = null;
    },
    [deletePostById.fulfilled.type]: (state, action) => {
      state.status = 'succeeded';
      postsAdapter.removeOne(state, action.meta.arg.postId);
    },
    [editPostById.pending.type]: (state) => {
      state.lastAction = 'editPostById';
      state.status = 'loading';
      state.error = null;
    },
    [editPostById.fulfilled.type]: (state, action) => {
      const {
        id, title, content, lastModifiedTimestamp,
      } = action.meta.arg;
      state.status = 'succeeded';
      postsAdapter.updateOne(state, { id, changes: { title, content, lastModifiedTimestamp } });
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { reactionAdded, postsCleared } = postsSlice.actions;

export default postsSlice.reducer;

export const reloadAllPosts: () => AppThunk = () => async (dispatch) => {
  dispatch(postsCleared());
  dispatch(fetchPosts({ page: 1, pageSize: 10 }));
};
