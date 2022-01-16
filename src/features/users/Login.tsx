import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from './userSclice';
import { RootState } from '../../app/store';

const LogInForm: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const dispatch = useDispatch();
  const lastAction = useSelector<RootState, string>((state) => state.user.lastAction);
  const status = useSelector<RootState, string>((state) => state.user.status);
  const nav = useNavigate();

  useEffect(() => {
    if (lastAction === 'login') {
      nav('/');
    }
  }, [status]);

  const onEmailChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setEmail(e.currentTarget.value);
  };
  const onPassWordChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setPassWord(e.currentTarget.value);
  };
  const canSave = [email, password].every(Boolean);
  const onLoginClicked = async () => {
    if (canSave) {
      await dispatch(login({ email, password }));
    }
  };

  return (
    <section>
      <h2>Log in</h2>
      <form>
        <i>Email:</i>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={onEmailChanged}
        />
        <i>Password</i>
        <input
          type="text"
          id="passWord"
          name="passWord"
          value={password}
          onChange={onPassWordChanged}
        />
        <button type="button" onClick={onLoginClicked} disabled={!canSave}>Log In</button>
      </form>
    </section>
  );
};

export default LogInForm;
