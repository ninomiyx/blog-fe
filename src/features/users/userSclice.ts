import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import client from '../../api/client';

export interface User {
  id: number;
  displayName: string;
  email: string;
  password: string;
}

export interface UserWithoutPassword {
  id: number;
  displayName: string;
  email: string;
}

export interface LoginRequestArgs {
  email: string;
  password: string;
}

export interface SignUpResponseArgs {
  isSuccess: boolean;
  message: string;
}

export const login = createAsyncThunk<User, LoginRequestArgs>(
  'user/login',
  async ({ email, password }) => {
    const response = client.post<LoginRequestArgs, User>(
      '/api/user/login',
      { email, password },
    );
    return response;
  },
);

export const changeprofile = createAsyncThunk<UserWithoutPassword, User>(
  'user/changeprofile',
  async (userdata) => {
    const response = await client.put<User, UserWithoutPassword>(
      '/api/user/changeprofile',
      userdata,
    );
    return response;
  },
);

export const checkLogin = createAsyncThunk<UserWithoutPassword, void>(
  'user/checkLogin',
  async () => {
    const response = await client.get<User>(
      '/api/user/checklogin',
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

export const logout = createAsyncThunk<void, void>(
  'user/logout',
  async () => {
    await client.getWithoutReturn(
      '/api/user/logout',
    );
  },
);

interface UserState {
  lastAction: string,
  user?: User,
  status: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
}
const initialState = {
  lastAction: '',
  user: undefined,
  status: 'idle',
  error: null,
} as UserState;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearLastAction(state) {
      // eslint-disable-next-line no-param-reassign
      state.lastAction = '';
    },
  },
  extraReducers: {
    /* eslint-disable no-param-reassign */
    [login.pending.type]: (state) => {
      state.lastAction = 'login';
      state.status = 'loading';
      state.error = null;
      state.user = undefined;
    },
    [login.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        const { id, displayName, email } = action.payload;
        state.user = {
          id,
          displayName,
          email,
          password: '',
        };
        state.status = 'succeeded';
      }
    },
    [login.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [addNewUser.pending.type]: (state) => {
      state.lastAction = 'addNewUser';
      state.status = 'loading';
      state.error = null;
      state.user = undefined;
    },
    [addNewUser.fulfilled.type]: (state) => {
      if (state.status === 'loading') {
        state.status = 'succeeded';
      }
    },
    [addNewUser.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [checkLogin.pending.type]: (state) => {
      state.lastAction = 'checkLogin';
      state.status = 'loading';
      state.error = null;
    },
    [checkLogin.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        const { id, displayName, email } = action.payload;
        state.status = 'succeeded';
        state.user = {
          id,
          displayName,
          email,
          password: '',
        };
      }
    },
    [checkLogin.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [logout.pending.type]: (state) => {
      state.lastAction = 'logout';
      state.status = 'loading';
      state.error = null;
    },
    [logout.fulfilled.type]: (state) => {
      if (state.status === 'loading') {
        state.status = 'succeeded';
        state.user = {
          id: 0,
          displayName: '',
          email: '',
          password: '',
        };
      }
    },
    [logout.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
    [changeprofile.pending.type]: (state) => {
      state.lastAction = 'changeprofile';
      state.status = 'loading';
      state.error = null;
      state.user = undefined;
    },
    [changeprofile.fulfilled.type]: (state, action) => {
      if (state.status === 'loading') {
        const { id, displayName, email } = action.payload;
        state.user = {
          id,
          displayName,
          email,
          password: '',
        };
        state.status = 'succeeded';
      }
    },
    [changeprofile.rejected.type]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.payload;
      }
    },
  },
});

export const { clearLastAction } = userSlice.actions;
export default userSlice.reducer;
