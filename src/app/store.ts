import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-cycle
import postsReducer from '../features/posts/postsSlice';
// eslint-disable-next-line import/no-cycle
import usersSclice from '../features/users/usersSclice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersSclice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
