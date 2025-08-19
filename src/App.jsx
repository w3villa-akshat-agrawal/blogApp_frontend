import React from 'react';
import "../src/App.css"
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import Signup from './features/auth/Signup';
import Login from './features/auth/Login'
import Google from './features/auth/Google';
import Dashboard from './pages/Dashboard';
import CreateBLog from './pages/CreateBLog';
import Profile from './pages/Profile';
import Update from './pages/Update';
import BlogPage from './pages/BlogPage';
import PlanPage from './pages/PlanPage';
import AdminPage from './pages/AdminPage';
import Otp from './features/auth/Otp';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="container-fluid m-auto">
            <div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50">
              <HomePage />
            </div>
          </div>
        }
      />
      <Route path='/signup'element={
        <div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><Signup/></div>
        }>
      </Route>
       <Route path='/login'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><Login/></div>}></Route>
       <Route path = '/google' element={<Google/>}></Route>
        <Route path = '/dashboard' element={<Dashboard/>}></Route>
        <Route path='/createBlog'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><CreateBLog/></div>}></Route>
        <Route path='/profile'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><Profile/></div>}></Route>
        <Route path='/update'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><Update/></div>}></Route>
        <Route path='/Blog'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><BlogPage/></div>}></Route>
        <Route path='/plans'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><PlanPage/></div>}></Route>
        <Route path='/admin'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><AdminPage/></div>}></Route>
        <Route path='/otpVerification'element={<div className="m-auto bg-gradient-to-r from-green-50 via-white to-green-50"><Otp/></div>}></Route>
        <Route path='/chat' element= {<ChatPage/>}></Route>
    </Routes>
  );
};

export default App;
