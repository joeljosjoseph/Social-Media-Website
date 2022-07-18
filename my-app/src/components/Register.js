import React, { Fragment, useState } from "react";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import logo from '../images/mp_logo.png';


function Register ({ setAuth }) {

    const [inputs, setInputs] = useState({
        email:"",
        username: "",
        password: "",
        firstname: "",
        middlename: "",
        lastname: "",
        phone: ""
    });

    const onchange =  (e) => {
        setInputs ({...inputs, 
            [e.target.name] : 
            e.target.value});
    }

    const onSubmitForm = async e => {

            e.preventDefault();

            try {

                const body = { email, username, password, firstname, middlename, lastname, phone };
                const response = await fetch("http://localhost:5000/auth/register", {
                    method: "POST",
                    headers: { "Content-Type" : "application/json" } ,
                    body: JSON.stringify(body)
                });

                const parseRes = await response.json();

                if(parseRes.user_id){
                    localStorage.setItem("user_id", parseRes.user_id)
                    localStorage.setItem("user_type",parseRes.user_type)
                    console.log(parseRes.user_type);
                }
                if(parseRes.user_name){
                    localStorage.setItem("user_name", parseRes.user_name)
                }
                

                if(parseRes.token){ 
                    localStorage.setItem("token", parseRes.token);
                    setAuth(true);
                    toast.success("Registered Successfully")
          
                  }else{
                      setAuth(false);
                      toast.error(parseRes);
        
                  }
                
            } catch (err) {
                console.log(err.message);
                
            }
    }
    const { email, username, password, firstname ,middlename ,lastname ,phone } = inputs;


    return (
        

                <div className="register-container row w-100">
                            
                <div className="login-container-1 col lg-6">
                    <img src={logo} className="register-logo"/>
                    
                    <h1 className="quote-login">Focus on how to be social, not on how to do social.</h1>
                    
                </div>
                <div className="credentials-container-main col lg-6 ">
                    <div className="credentials-container">
                        <form onSubmit={onSubmitForm} className="m-auto">
                            <h3 className="py-2 signin-form-color">Register</h3>
                            <label>First Name</label>
                            <input type="text" name="firstname" placeholder="Enter first name" className="form-control register-input" 
                            value={firstname} onChange = {e => onchange(e)} />
                            <label>Middle Name</label>
                            <input type="text" name="middlename" placeholder="Enter middle name" className="form-control register-input" 
                            value={middlename} onChange = {e => onchange(e)} />
                            <label>Last Name</label>
                            <input type="text" name="lastname" placeholder="Enter last Name" className="form-control register-input" 
                            value={lastname} onChange = {e => onchange(e)} />
                            <label>Phone Number</label>
                            <input type="text" name="phone" placeholder="Enter Phone number" minLength="10" maxLength="10" className="form-control register-input" 
                            value={phone} onChange = {e => onchange(e)} />
                            <label>Email</label>
                            <input type="email" name="email" placeholder="Enter your Email" className="form-control register-input" 
                            value={email} onChange = {e => onchange(e)} />
                            <label>User Name</label>
                            <input type="text" name="username" placeholder="Enter your username" className="form-control register-input" 
                            value={username} onChange = {e => onchange(e)} />
                            <label>Password</label>
                            <input type="password" name="password" placeholder="Enter Password" className="form-control register-input" 
                            value={password} onChange = {e => onchange(e)} />
                            <div class="d-grid gap-2">
                                <button className="btn register-button submit-button">Sign Up</button>
                            </div>
                            Already have an account? <Link to="/Login" className="signin-form-color">Login</Link>
                            
                        </form>
                    </div>
                    
                </div>

                </div>
        // </Fragment>
    );
};

export default Register;