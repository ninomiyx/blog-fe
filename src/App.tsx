import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Navbar } from './app/Navbar';
import PostsList from './features/posts/PostList';
import './App.css';
import SinglePostPage from './features/posts/SinglePostPage';
import AddPostForm from './features/posts/AddPostForm';

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
        <Route
          path="/page/:page"
          element={(
            <section>
              <PostsList />
            </section>
          )}
        />
        <Route
          path="/post/:postId"
          element={(
            <section>
              <SinglePostPage />
            </section>
          )}
        />
      </Routes>
    </div>
  </Router>
);

export default App;
