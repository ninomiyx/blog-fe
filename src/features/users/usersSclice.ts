import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import client from '../../api/client';

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequestArgs {
  username: string;
  password: string;
}

export interface LoginResponseArgs {
  isAuth: boolean;
  message: string;
  id: number;
  displayName: string;
}

export interface SignUpResponseArgs {
  isSuccess: boolean;
}

const userAdapter = createEntityAdapter<User>();

export const CheckUserAuth = createAsyncThunk<LoginResponseArgs, LoginRequestArgs>(
  'user/checkUserAuth',
  async ({ username, password }) => {
    const response = client.post<LoginRequestArgs, LoginResponseArgs>(
      `/api/user/${username}`,
      { username, password },
    );
    return response;
  },
);

export const addNewUser = createAsyncThunk<SignUpResponseArgs, User>(
  'user/addNewuser',
  async (initialUserData) => {
    const response = await client.post<User, SignUpResponseArgs>(
      '/api/user',
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
    [addNewUser.fulfilled.type]: userAdapter.addOne,
  },
});

export default userSlice.reducer;
