import React, { Fragment, useState } from "react";
import {toast} from "react-toastify";
import "../style.css"
import logo from '../images/mp_logo.png';


const Link = require("react-router-dom").Link;

const Login = ({ setAuth }) => {

     const   [inputs, setInputs] = useState({
        email: "",
        password: ""
     });

    const { email, password } = inputs;
   
     const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name] : e.target.value }) 
     };

    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {
            const body = { email, password };

            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            if(parseRes.user_id){
                localStorage.setItem("user_id", parseRes.user_id)
                localStorage.setItem("user_type",parseRes.user_type)
                console.log(localStorage.user_type);
            }
            if(parseRes.user_name){
                localStorage.setItem("user_name", parseRes.user_name)
            }
            
            
            if(parseRes.token){ 
                localStorage.setItem("token", parseRes.token);
                setAuth(true);

                toast.success("Logged in Successfully")
      
              }else{
                  setAuth(false);
                  toast.error(parseRes);
    
              }

            console.log(parseRes);
            
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className="login-container row w-100 ">
            
            <div className="login-container-1 col lg-6">
                <img src={logo} className="register-logo"/>
                <h1 className="quote-login">See life from a different perspective.</h1>
                
            </div>
            <div className="credentials-container-main col lg-6 ">
                <div className="credentials-container">
                    <form onSubmit={onSubmitForm} className="m-auto login-form">
                        <h3 className="py-2 signin-form-color">Login</h3>
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange = {e => onChange(e)}
                        placeholder="Enter Email" className="form-control login-input " />
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange = {e => onChange(e)}
                        placeholder="Enter Password" className="form-control login-input" />
                        <div class="d-grid gap-2">
                            <button className="btn login-button submit-button">Sign In</button>
                        </div>
                        Don't have an account? <Link to="/Register" className="signin-form-color">Register</Link>
                        
                    </form>
                </div>
                
            </div>
            
        </div>
    );
};

export default Login;


