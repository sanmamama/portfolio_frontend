
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

import PostterBase from './components/postter/PostterBase';
import Login from './components/postter/Login';
import Logout from './components/postter/Logout';
import Signup from './components/postter/Signup';
import Confirm from './components/postter/Confirm';
import PostterHome from './components/postter/PostterHome';



function App() {
  return (
    <Router>
            <Routes>
              {/* Routes for the blog app */}
              <Route path="/" element={<BlogBase />} >
                <Route index element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/detail/:id" element={<BlogDetail />} />
              </Route>

              {/* Routes for the postter app */}
              <Route path="/postter" element={<PostterBase />} >
                <Route index element={<PostterHome />} />
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
                <Route path="signup" element={<Signup />} />
                <Route path="confirm" element={<Confirm />} />
              </Route>
              
            </Routes>
          
    </Router>
  );
}

export default App;
