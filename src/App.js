
import './App.css';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import ViewProfile from './components/postter/ViewProfile';
import Following from './components/postter/Following';
import Follower from './components/postter/Follower';
import Message from './components/postter/Message';
import MessageDetail from './components/postter/MessageDetail';
import MemberList from './components/postter/MemberList';
import MemberListDetail from './components/postter/MemberListDetail';
import MemberListAdd from './components/postter/MemberListAdd';
import Search from './components/postter/Search';
import Notification from './components/postter/Notification';
import PostDetail from './components/postter/PostDetail';


import {UserDataProvider} from "./components/postter/providers/UserDataProvider"
import {FollowDataProvider} from "./components/postter/providers/FollowDataProvider"
import {NotificationProvider} from "./components/postter/providers/NotificationProvider"

const router = createBrowserRouter([
  {
    path: "/",
    element: <BlogBase />,
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "privacypolicy", element: <PrivacyPolicy /> },
      { path: "contact", element: <Contact /> },
      { path: "detail/:id", element: <BlogDetail /> },
    ],
  },
  {
    path: "/postter",
    element: <MainBase />,
    children: [
      { index: true, element: <PostterHome /> },
      { path: "home", element: <PostterHome /> },
      { path: ":uid", element: <ViewProfile /> },
      { path: "post/:post_id", element: <PostDetail /> },
      { path: ":uid/following", element: <Following /> },
      { path: ":uid/follower", element: <Follower /> },
      { path: "add_member/:id", element: <MemberListAdd /> },
      { path: "message", element: <Message /> },
      { path: "message/:ids", element: <MessageDetail /> },
      { path: "memberlist", element: <MemberList /> },
      { path: "memberlist/:id", element: <MemberListDetail /> },
      { path: "notification", element: <Notification /> },
      { path: "search", element: <Search /> },
    ],
  },
  {
    path: "/postter",
    element: <AuthBase />,
    children: [
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "signup", element: <Signup /> },
      { path: "confirm", element: <Confirm /> },
    ],
  },
]);

const App = () => {
  return (
    <>
    <UserDataProvider>
      <FollowDataProvider>
        <NotificationProvider>
          <RouterProvider router={router}/>
        </NotificationProvider>
      </FollowDataProvider>
    </UserDataProvider>
    </>
  );
};

export default App;
