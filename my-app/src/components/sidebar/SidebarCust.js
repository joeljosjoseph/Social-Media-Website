import React, { Fragment, useState, useEffect} from "react";
import {toast} from "react-toastify";
import "../../style.css";


const SidebarCust = (props) => {

    

    const Link = require("react-router-dom").Link;

    const [name,setName] = useState("")

    async function getName() {
        try {
            const response = await fetch("http://localhost:5000/dashboard", {
            method: "GET",
            headers: { token: localStorage.token}}
            );

        const parseRes = await response.json();
        
        setName(parseRes.f_name);

        } catch (err) {
            console.log(err.message);
        }
    }

    function logout (e) {
        e.preventDefault();
        localStorage.removeItem("token");
        props.setAuth(false);
        toast.success("Logged out successfully")
    }

    useEffect(() => {
        getName();
    }, []);

    const isActive = props.isActive;

        return <Fragment>
            
                
                    
                        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 cust-sidebar">
                            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
                                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
                                    <h3 className="d-lg-inline" style={{color:"#26215b", paddingTop:"20px"}}>Customer Panel</h3>
                                </a>
                               
                                <ul className="nav nav-pills  mb-sm-auto mb-0 align-items-center customer-sidebar-menu align-items-sm-start" id="menu">
                                <li className="nav-item sidebar-list"> 
                                        { isActive === "profile" ? 
                                            <Link to="/dashboard" className="nav-link align-middle active-sidebar" aria-current="page">
                                            <span className="ms-1 d-none d-sm-inline">Profile</span>
                                            </Link>
                                            :
                                            <Link to="/dashboard" className="nav-link align-middle sidebar-list">
                                                            <span className="ms-1 d-none d-sm-inline">Profile</span> </Link>
                                        }
                                        
                                    </li>
                                    <li className="nav-item sidebar-list"> 
                                        { isActive === "posts" ? 
                                            <Link to="/posts" className="nav-link align-middle active-sidebar" aria-current="page">
                                            <span className="ms-1 d-none d-sm-inline">Posts</span>
                                            </Link>
                                            :
                                            <Link to="/posts" className="nav-link align-middle sidebar-list">
                                                            <span className="ms-1 d-none d-sm-inline">Posts</span> </Link>
                                        }
                                        
                                    </li>
                                    <li className="nav-item sidebar-list">
                                    { isActive === "friends" ? 
                                            <Link to="/friends" className="nav-link align-middle active-sidebar" aria-current="page">
                                            <span className="ms-1 d-none d-sm-inline">Friends</span>
                                            </Link>
                                            :
                                            <Link to="/friends" className="nav-link align-middle sidebar-list">
                                            <span className="ms-1 d-none d-sm-inline">Friends</span> </Link>
                                        }
                                    </li>
                                    <li className="nav-item sidebar-list">
                                    { isActive === "account" ? 
                                            <Link to="/account" className="nav-link align-middle active-sidebar" aria-current="page">
                                            <span className="ms-1 d-none d-sm-inline">Account</span>
                                            </Link>
                                            :
                                            <Link to="/account" className="nav-link  align-middle sidebar-list">
                                            <span className="ms-1 d-none d-sm-inline">Account</span></Link>
                                        }
                                    </li>
                                    
                                    
                                </ul>
                                
                                <div class="d-grid col-12 " >
                                    <button className="btn btn-outline-danger my-1" style={{marginLeft:"0px"}} onClick={e => logout(e)}>Sign out</button>
                                </div>
                            </div>
                        </div>

                
       
        </Fragment>
}

export default SidebarCust;