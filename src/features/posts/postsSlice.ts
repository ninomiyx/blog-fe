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

export const fetchPosts = createAsyncThunk<Post[]>(
  'posts/fetchPosts',
  async () => client.get<Post[]>('/api/posts'),
);

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

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => a.lastModifiedTimestamp - b.lastModifiedTimestamp,
});

export const {
  selectAll: selectAllPosts,
  selectIds: selectPostIds,
  selectById: selectPostById,
} = postsAdapter.getSelectors<RootState>((state) => state.posts);

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    status: 'idle',
    error: null,
  }),
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      postsAdapter.updateOne(state, { id, changes: { title, content } });
    },
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
      state.status = 'loading';
      state.error = null;
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
    [addNewPost.fulfilled.name]: postsAdapter.addOne,
    /* eslint-enable no-param-reassign */
  },
});

export const { postUpdated, reactionAdded, postsCleared } = postsSlice.actions;

export default postsSlice.reducer;

export const reloadAllPosts: () => AppThunk = () => async (dispatch) => {
  dispatch(postsCleared());
  dispatch(fetchPosts());
};
