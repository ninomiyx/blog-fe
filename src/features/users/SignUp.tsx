import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewUser, User } from './usersSclice';

const SignUp: React.FunctionComponent = () => {
  const [displayname, setName] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const [email, setEmail] = React.useState('');
  const dispatch = useDispatch();

  const onNameChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setName(e.currentTarget.value);
  };
  const onPassWordChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setPassWord(e.currentTarget.value);
  };
  const onEmailChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setEmail(e.currentTarget.value);
  };
  const canSave = [displayname, password, email].every(Boolean);
  const onSignupClicked = async () => {
    if (canSave) {
      const newUser: User = {
        id: -1,
        displayName: displayname,
        email,
        password,
      };
      await dispatch(addNewUser(newUser));
    }
  };
  return (
    <section>
      <h2>Sign up</h2>
      <form>
        <i>User name:</i>
        <input
          type="text"
          id="userName"
          name="userName"
          value={displayname}
          onChange={onNameChanged}
        />
        <i>Email</i>
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
        <button type="button" onClick={onSignupClicked} disabled={!canSave}>Sign up</button>
      </form>
    </section>
  );
};

export default SignUp;
