import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewUser, User } from './userSclice';
import { RootState } from '../../app/store';
import '../form.css';

const SignUp: React.FunctionComponent = () => {
  const [displayname, setName] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const [email, setEmail] = React.useState('');
  const dispatch = useDispatch();
  const lastAction = useSelector<RootState, string>((state) => state.user.lastAction);
  const status = useSelector<RootState, string>((state) => state.user.status);
  const nav = useNavigate();

  useEffect(() => {
    if (status === 'succeeded' && lastAction === 'addNewUser') {
      nav('/login');
    }
  }, [status]);

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
    <section className="input-group">
      <h2 className="h2">Sign up</h2>
      <form>
        <div className="input-group mb-3">
          <span className="input-group-text">Name</span>
          <input
            type="text"
            id="userName"
            className="form-control"
            name="userName"
            value={displayname}
            onChange={onNameChanged}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Email</span>
          <input
            type="text"
            id="email"
            className="form-control"
            name="email"
            value={email}
            onChange={onEmailChanged}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Password</span>
          <input
            type="password"
            id="passWord"
            className="form-control"
            name="passWord"
            value={password}
            onChange={onPassWordChanged}
          />
        </div>
        <button className="button" type="button" onClick={onSignupClicked} disabled={!canSave}>Sign up</button>
      </form>
    </section>
  );
};

export default SignUp;
