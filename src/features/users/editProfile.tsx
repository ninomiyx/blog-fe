import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeprofile, User } from './userSclice';
import { RootState } from '../../app/store';
import '../form.css';

const EditProfile: React.FunctionComponent = () => {
  const userId = useSelector<RootState, number | undefined>(
    (state) => state.user.user?.id,
  );
  const userName = useSelector<RootState, string | undefined>(
    (state) => state.user.user?.displayName,
  );
  const userEmail = useSelector<RootState, string | undefined>(
    (state) => state.user.user?.email,
  );
  const [password, setPassWord] = React.useState('');
  const [name, setName] = React.useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();
  const status = useSelector<RootState, string>((state) => state.user.status);
  const lastAction = useSelector<RootState, string>((state) => state.user.lastAction);

  if (!userId) {
    nav('/');
  }

  useEffect(() => {
    if (status === 'succeeded' && lastAction === 'changeprofile') {
      nav('/');
    }
  }, [status]);

  const onPassWordChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setPassWord(e.currentTarget.value);
  };
  const onNameChanged = (e: React.FormEvent<HTMLInputElement>): void => {
    setName(e.currentTarget.value);
  };

  const canSave = [name, password].every(Boolean);
  const onChangeClicked = async () => {
    if (canSave) {
      const newUser: User = {
        id: userId || 0,
        displayName: name,
        email: userEmail || '',
        password,
      };
      await dispatch(changeprofile(newUser));
    }
  };

  return (
    <section className="input-group">
      <h2 className="h2">Change Password and/or Display Name</h2>
      <form>
        <div className="input-group mb-3">
          <span className="input-group-text">Name</span>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder={userName}
            value={name}
            onChange={onNameChanged}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Password</span>
          <input
            type="text"
            id="passWord"
            name="passWord"
            className="form-control"
            value={password}
            onChange={onPassWordChanged}
          />
        </div>
        <button type="button" className="input-button" onClick={onChangeClicked} disabled={!canSave}>Save</button>
      </form>
    </section>
  );
};

export default EditProfile;
