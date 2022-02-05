import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import postsReducer from '../features/posts/postsSlice';
// eslint-disable-next-line import/no-cycle
import userSclice from '../features/users/userSclice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userSclice,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
