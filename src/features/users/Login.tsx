import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckUserAuth } from './userSclice';

const LogInForm: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const dispatch = useDispatch();

  const onEmailChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setEmail(e.currentTarget.value);
  };
  const onPassWordChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setPassWord(e.currentTarget.value);
  };
  const canSave = [email, password].every(Boolean);
  const onLoginClicked = async () => {
    if (canSave) {
      await dispatch(CheckUserAuth({ email, password }));
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
