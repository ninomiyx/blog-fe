import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import client from '../../api/client';

export interface User {
  id: number;
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequestArgs {
  email: string;
  password: string;
}

export interface SignUpResponseArgs {
  isSuccess: boolean;
  message: string;
}

const userAdapter = createEntityAdapter<User>();

export const CheckUserAuth = createAsyncThunk<User, LoginRequestArgs>(
  'user/checkUserAuth',
  async ({ email, password }) => {
    const response = client.post<LoginRequestArgs, User>(
      '/api/user/login',
      { email, password },
    );
    return response;
  },
);

export const addNewUser = createAsyncThunk<SignUpResponseArgs, User>(
  'user/addNewuser',
  async (initialUserData) => {
    const response = await client.post<User, SignUpResponseArgs>(
      '/api/user/signup',
      initialUserData,
    );
    return response;
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState({
    status: 'idle',
    error: null,
  }),
  reducers: {},
  extraReducers: {
    /* eslint-disable no-param-reassign */
    [CheckUserAuth.pending.type]: (state) => {
      state.status = 'loading';
      state.error = null;
      userAdapter.removeAll(state);
    },
    [CheckUserAuth.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        const response = action.payload;
        console.log(response);
        state.status = 'succeeded';
      }
    },
    [CheckUserAuth.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [addNewUser.pending.type]: (state) => {
      state.status = 'loading';
      state.error = null;
      userAdapter.removeAll(state);
    },
    [addNewUser.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        const response = action.payload;
        console.log(response);
        state.status = 'succeeded';
      }
    },
    [addNewUser.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
  },
});

export default userSlice.reducer;
