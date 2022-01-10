import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckUserAuth } from './usersSclice';

const LogInForm: React.FunctionComponent = () => {
  const [username, setName] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const dispatch = useDispatch();

  const onNameChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setName(e.currentTarget.value);
  };
  const onPassWordChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setPassWord(e.currentTarget.value);
  };
  const canSave = [username, password].every(Boolean);
  const onLoginClicked = async () => {
    if (canSave) {
      await dispatch(CheckUserAuth({ username, password }));
    }
  };

  return (
    <section>
      <h2>Log in</h2>
      <form>
        <i>User name:</i>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={username}
          onChange={onNameChanged}
        />
        <i>Password</i>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={password}
          onChange={onPassWordChanged}
        />
        <button type="button" onClick={onLoginClicked} disabled={!canSave}>Log In</button>
      </form>
    </section>
  );
};

export default LogInForm;
