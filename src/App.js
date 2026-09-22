
import './App.css';
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './components/NotFound';
import BlogBase from './components/blog/BlogBase';
import Home from './components/blog/Home';
import {UserDataProvider} from "./components/postter/providers/UserDataProvider"
import {FollowDataProvider} from "./components/postter/providers/FollowDataProvider"
import {NotificationProvider} from "./components/postter/providers/NotificationProvider"
import {BlogDataProvider} from "./components/blog/providers/BlogDataProvider"

// 画面を初めて開いたときに読み込む。
// 待機表示は、その画面の部分だけに表示する。
const lazyPage = (loader) => {
  const Component = lazy(loader);

  return function LazyPage(props) {
    return (
      <Suspense fallback={<div role="status">読み込み中です…</div>}>
        <Component {...props} />
      </Suspense>
    );
  };
};

const Profile = lazyPage(() => import('./components/blog/Profile'));
const Portfolio = lazyPage(() => import('./components/blog/Portfolio'));
const PrivacyPolicy = lazyPage(() => import('./components/blog/PrivacyPolicy'));
const Contact = lazyPage(() => import('./components/blog/Contact'));
const BlogDetail = lazyPage(() => import('./components/blog/BlogDetail'));

const AuthBase = lazyPage(() => import('./components/postter/AuthBase'));
const MainBase = lazyPage(() => import('./components/postter/MainBase'));
const Login = lazyPage(() => import('./components/postter/Login'));
const Logout = lazyPage(() => import('./components/postter/Logout'));
const Signup = lazyPage(() => import('./components/postter/Signup'));
const Confirm = lazyPage(() => import('./components/postter/Confirm'));
const PostterHome = lazyPage(() => import('./components/postter/Home'));
const ViewProfile = lazyPage(() => import('./components/postter/ViewProfile'));
const Following = lazyPage(() => import('./components/postter/Following'));
const Follower = lazyPage(() => import('./components/postter/Follower'));
const Message = lazyPage(() => import('./components/postter/Message'));
const MessageDetail = lazyPage(() => import('./components/postter/MessageDetail'));
const MemberList = lazyPage(() => import('./components/postter/MemberList'));
const MemberListDetail = lazyPage(() => import('./components/postter/MemberListDetail'));
const MemberListAdd = lazyPage(() => import('./components/postter/MemberListAdd'));
const Search = lazyPage(() => import('./components/postter/Search'));
const Notification = lazyPage(() => import('./components/postter/Notification'));
const PostDetail = lazyPage(() => import('./components/postter/PostDetail'));



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
      { path: "*", element: <NotFound />,},
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
      //{ path: "*", element: <NotFound />,},
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
      //{ path: "*", element: <NotFound />,},
    ],
  },
]);

const App = () => {
  return (
    <>
    <UserDataProvider>
      <FollowDataProvider>
        <NotificationProvider>
          <BlogDataProvider>
            <RouterProvider router={router}/>
          </BlogDataProvider>
        </NotificationProvider>
      </FollowDataProvider>
    </UserDataProvider>
    </>
  );
};

export default App;
