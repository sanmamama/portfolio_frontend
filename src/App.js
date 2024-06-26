
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
import SidebarContent from './components/SidebarContent';
import BlogDetail from './components/\BlogDetail';


function App() {
  return (
    <Router>
      <Header />
      <main>
        <div className="container">
          <div className="row">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/detail/:id" element={<BlogDetail />} />
            </Routes>
            <Routes>
              <Route path="/" element={<SidebarContent />} />
              <Route path="/profile" element={<SidebarContent />} />
              <Route path="/portfolio" element={<SidebarContent />} />
              <Route path="/privacypolicy" element={<SidebarContent />} />
              <Route path="/contact" element={<SidebarContent />} />
            </Routes>
          </div>
        </div>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
