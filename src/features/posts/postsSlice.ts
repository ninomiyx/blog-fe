import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState, AppThunk } from '../../app/store';
import client from '../../api/client';

export interface PostReaction {
  [key: string]: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  reactions: PostReaction;
  lastModifiedTimestamp: number;
}

export interface FetchPostsArgs {
  page: number;
  pageSize: number;
}

export interface PostByIdArgs {
  postId: number;
}

export interface EditPostArgs {
  postId: number;
  title: string;
  content: string;
  lastModifiedTimestamp: number;
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

export const deletePostById = createAsyncThunk<void, PostByIdArgs>(
  'posts/deleteOldPost',
  async ({ postId }) => client.del(`/api/post/${postId}`),
);

export const editPostById = createAsyncThunk<Post, EditPostArgs>(
  'posts/editPost',
  async ({
    postId, title, content, lastModifiedTimestamp,
  }) => {
    const response = client.put<EditPostArgs, Post>(
      `/api/post/${postId}`,
      {
        postId, title, content, lastModifiedTimestamp,
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
    [addNewPost.pending.type]: (state) => {
      state.lastAction = 'addNewPost';
      state.status = 'loading';
      state.error = null;
    },
    [addNewPost.fulfilled.type]: postsAdapter.addOne,
    [deletePostById.pending.type]: (state) => {
      state.lastAction = 'deletePostById';
      state.status = 'loading';
      state.error = null;
    },
    [deletePostById.fulfilled.type]: (state, action) => {
      postsAdapter.removeOne(state, action.meta.arg.postId);
    },
    [editPostById.pending.type]: (state) => {
      state.lastAction = 'editPostById';
      state.status = 'loading';
      state.error = null;
    },
    [editPostById.fulfilled.type]: (state, action) => {
      const { postId, title, content } = action.meta.arg;
      const id = postId;
      postsAdapter.updateOne(state, { id, changes: { title, content } });
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
