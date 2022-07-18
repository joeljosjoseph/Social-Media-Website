import React, {Fragment, useEffect, useState, Suspense} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//components

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Posts from './components/sidebar/Posts';
import Friends from './components/sidebar/Friends';
import Account from './components/sidebar/Account';
import Chat from './components/ChatDiv';
import AdminPosts from './components/adminSidebar/adminPosts';
import AdminViewUser from './components/adminSidebar/AdminViewUser';
import ViewUser from './components/ViewUser'

toast.configure();

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user_type = localStorage.getItem("user_type");

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify",{
        method: "GET",
        headers: {token: localStorage.token}
      });

      
      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true) :
      setIsAuthenticated(false);
      
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  })



  return (
    <Fragment>
      <ToastContainer theme="dark"/>
        <Suspense fallback={ <div>Loading ... </div> }>
          <Router>
            <div className='fluid-container'>
              <Routes>
                <Route exact path="/" element = { isAuthenticated && user_type === 'Customer' ? (
                    <Home setAuth = {setAuth}/>
                    ) : (
                      <Login setAuth = {setAuth} />
                    )} />
                <Route exact path="/" element = { isAuthenticated && user_type === 'Admin' ? 
                  <Navigate to="/dashboard" />
                  : 
                     <Login setAuth = {setAuth} />    
                    } />
                <Route exact path="/chat" element = { !isAuthenticated ? (
                    <Login setAuth = {setAuth} /> 
                    ) : (
                      <Chat setAuth = {setAuth}/>
                    )} />
                <Route exact path="/login" element = { !isAuthenticated ? (
                    <Login setAuth = {setAuth} /> 
                    ) : (
                      <Navigate to="/dashboard" />
                    )} />
                  <Route exact path="/login" element = { !isAuthenticated ? (
                    <Login setAuth = {setAuth} /> 
                    ) : (
                      <Navigate to="/dashboard" />
                    )} />
                <Route exact path="/register" element = { !isAuthenticated ? (
                    <Register setAuth = {setAuth} /> 
                    ) : (
                      <Navigate to="/login" />
                    )} />
                <Route exact path="/dashboard" element = { isAuthenticated ? (
                    <Dashboard setAuth = {setAuth} /> 
                    ) : (
                      <Navigate to="/login" />
                    )} />
                <Route exact path="/friends" element = { !isAuthenticated ? (
                    <Login setAuth = {setAuth} /> 
                    ) : (
                      <Friends setAuth = {setAuth}/>
                    )} />
                <Route exact path="/account" element = { !isAuthenticated ? (
                    <Login setAuth = {setAuth} /> 
                    ) : (
                      <Account setAuth = {setAuth}/>
                    )} />
                <Route exact path="/posts" element = { !isAuthenticated ? (
                    <Login setAuth = {setAuth} /> 
                    ) : (
                      <Posts setAuth = {setAuth}/>
                    )} />
                <Route exact path="/adminPosts" element = { !isAuthenticated ? (
                  <Login setAuth = {setAuth} /> 
                  ) : (
                    <AdminPosts setAuth = {setAuth}/>
                  )} />
                  <Route exact path="/viewUserAdmin" element = { !isAuthenticated ? (
                  <Login setAuth = {setAuth} /> 
                  ) : (
                    <AdminViewUser setAuth = {setAuth}/>
                  )} />
                  <Route exact path="/viewUser" element = { !isAuthenticated ? (
                  <Login setAuth = {setAuth} /> 
                  ) : (
                    <ViewUser setAuth = {setAuth}/>
                  )} />

              </Routes>
            </div>
          </Router>
      </Suspense>
    </Fragment>
  );
}

export default App;