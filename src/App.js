
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogBase from './components/blog/BlogBase';
import Home from './components/blog/Home';
import Profile from './components/blog/Profile';
import Portfolio from './components/blog/Portfolio';
import PrivacyPolicy from './components/blog/PrivacyPolicy';
import Contact from './components/blog/Contact';
import BlogDetail from './components/blog/BlogDetail';

import AuthBase from './components/postter/AuthBase';
import MainBase from './components/postter/MainBase';
import Login from './components/postter/Login';
import Logout from './components/postter/Logout';
import Signup from './components/postter/Signup';
import Confirm from './components/postter/Confirm';
import PostterHome from './components/postter/Home';
import EditProfile from './components/postter/EditProfile';
import Header from './components/postter/Header';
import Footer from './components/postter/Footer';

import {UserDataProvider} from "./components/postter/providers/UserDataProvider"
import {FollowDataProvider} from "./components/postter/providers/FollowDataProvider"


function App() {
  return (
    <Router>
      <UserDataProvider>
      <FollowDataProvider>
          <Routes>
              {/* Routes for the blog app */}
              <Route path="/" element={<BlogBase />} >
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="privacypolicy" element={<PrivacyPolicy />} />
                <Route path="contact" element={<Contact />} />
                <Route path="detail/:id" element={<BlogDetail />} />
              </Route>

              
              {/* Routes for the main postter app */}
              <Route path="/postter" element={<MainBase />} >
                <Route index element={<PostterHome />} />
                <Route path="editprofile" element={<EditProfile />} />
              </Route>

              {/* Routes for the auth postter app */}
              <Route path="/postter" element={<AuthBase />} >
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
                <Route path="signup" element={<Signup />} />
                <Route path="confirm" element={<Confirm />} />
              </Route>
              
          </Routes>
          </FollowDataProvider>
      </UserDataProvider>
          
    </Router>
  );
}

export default App;
