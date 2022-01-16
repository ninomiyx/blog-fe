import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Navbar from './app/Navbar';
import PostsList from './features/posts/PostList';
import './App.css';
import SinglePostPage from './features/posts/SinglePostPage';
import AddPostForm from './features/posts/AddPostForm';
import EditPostForm from './features/posts/editPostForm';
import LogInForm from './features/users/Login';
import SignUp from './features/users/SignUp';

const App = (): JSX.Element => (
  <Router>
    <Navbar />
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={(
            <section>
              <AddPostForm />
              <PostsList />
            </section>
          )}
        />
        <Route path="/page/:page" element={<PostsList />} />
        <Route path="/post/:postId" element={<SinglePostPage />} />
        <Route path="/editPost/:postId" element={<EditPostForm />} />
        <Route path="/login" element={<LogInForm />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  </Router>
);

export default App;
