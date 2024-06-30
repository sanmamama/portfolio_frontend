
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Profile from './components/Profile';
import Portfolio from './components/Portfolio';
import PrivacyPolicy from './components/PrivacyPolicy';
import Contact from './components/Contact';
import BlogDetail from './components/\BlogDetail';
import Login from './components/postter/Login';
import Logout from './components/postter/Logout';
import Signup from './components/postter/Signup';
import Confirm from './components/postter/Confirm';
import PostterHome from './components/postter/PostterHome';


function App() {
  return (
    <Router>
      <Header />
      <main>
        <div className="container">
          <div className="row">
            <Routes>
              {/* Routes for the blog app */}
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/detail/:id" element={<BlogDetail />} />

              {/* Routes for the postter app */}
              <Route path="/postter/" element={<PostterHome />} />
              <Route path="/postter/login" element={<Login />} />
              <Route path="/postter/logout" element={<Logout />} />
              <Route path="/postter/signup" element={<Signup />} />
              <Route path="/postter/confirm" element={<Confirm />} />
              
            </Routes>
          </div>
        </div>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
