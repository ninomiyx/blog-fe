import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearLastAction } from './userSclice';
import { RootState } from '../../app/store';
import '../form.css';

const LogInForm: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const dispatch = useDispatch();
  const lastAction = useSelector<RootState, string>((state) => state.user.lastAction);
  const status = useSelector<RootState, string>((state) => state.user.status);
  const nav = useNavigate();

  useEffect(() => {
    if (lastAction === 'addNewUser') dispatch(clearLastAction());
  });

  useEffect(() => {
    if (status === 'succeeded' && lastAction === 'login') {
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
    <section className="input-group">
      <h2 className="h2">Log in</h2>
      <form>
        <div className="input-group mb-3">
          <span className="input-group-text">Email</span>
          <input
            type="text"
            id="emai"
            name="email"
            className="form-control"
            value={email}
            onChange={onEmailChanged}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Password</span>
          <input
            type="password"
            id="passWord"
            name="passWord"
            className="form-control"
            value={password}
            onChange={onPassWordChanged}
          />
        </div>
        <button type="button" className="button" onClick={onLoginClicked} disabled={!canSave}>Log In</button>
      </form>
    </section>
  );
};

export default LogInForm;
