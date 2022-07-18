import React, { Fragment, useState, useEffect, Profiler} from "react";
import "../style.css";
import {toast} from "react-toastify";
import { Navigate } from 'react-router-dom';

import { ReactComponent as Search } from "bootstrap-icons/icons/search.svg";
import { ReactComponent as AddPostIcon } from "bootstrap-icons/icons/plus-circle-dotted.svg";
import { ReactComponent as Notification } from "bootstrap-icons/icons/bell.svg";
import { ReactComponent as Chat } from "bootstrap-icons/icons/chat-left.svg";
import NoDP from "../images/noDp.png";


function Navbar ({setAuth}) {

  const Link = require("react-router-dom").Link;
  const serverBaseURI = 'http://localhost:5000'
  const image = NoDP;
  

  const [adminCheck, setAdminAuth] = useState(true);
    const adminAuth = boolean => {
        setAdminAuth(boolean);
      };
      

    const [inputs, setInputs] = useState({
        fn: ""
      });
      const {fn} = inputs;


    async function getDetails() {
        try {
            const response = await fetch("http://localhost:5000/dashboard", {
            method: "GET",
            headers: { token: localStorage.token}}
            );

        const parseRes = await response.json();

        // parseRes.f_name ? setAdminAuth(false) :
        //     setAdminAuth(true);
        //   // if(adminCheck){
        //   //   return <Navigate to="/dashboard"/>
        //   // }
        //   adminCheck?(<Navigate to="/dashboard"/>):(console.log(adminCheck));
        
        setInputs({...inputs, 
            fn: parseRes.f_name
           
            })


        } catch (err) {
            console.log(err.message);
        }
    }

    function logout (e) {
      e.preventDefault();
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logged out successfully")
  }

  const [data, setData] = useState([]);
  async function getFriendReqs(){
    
    try {
        const response = await fetch("http://localhost:5000/view/friendReqs",{
        method:"GET",
        headers: { token: localStorage.token ,user_id: localStorage.user_id , user_name: localStorage.user_name  }
      });

      const parseRes = await response.json();
      setData(parseRes);
   
    } catch (err) {
        console.log(err.message);
    }
}

async function onclick (cust_id ) {
  try {

      const body = { cust_id };

      const response = await fetch("http://localhost:5000/view/acceptFriend", {
          method: "POST",
          headers: {"Content-Type" : "application/json", token: localStorage.token, user_id: localStorage.user_id, user_name: localStorage.user_name },
          body: JSON.stringify(body)
      });

      const parseRes = await response.json();
      
      if(parseRes.cust_id1){ 
          toast.success("Friend Request Accepted")

        }else{
            toast.error(parseRes);

        }

  } catch (err) {
      console.log(err.message);
  }
}

    useEffect(() => {
        getDetails();
    }, [0]);
    useEffect(() => {
      getFriendReqs();
  }, [0]);

    return(<Fragment>
        <div class="container position-sticky z-index-sticky top-0" style={{zIndex:"1",backgroundColor:"white"}}>
        <div class="row">
          <div class="col-12">
            <nav class="navbar navbar-expand-lg blur border-radius-xl top-0 z-index-fixed navbar start-0 end-0 mx-4">
              <div class="container-fluid px-0">
                <a
                  class="navbar-brand font-weight-bolder ms-sm-3 blue-font"
                  href="/"
                  rel="tooltip"
                  title="Designed and Coded by Creative Tim"
                  data-placement="bottom"
                  target="_blank">
                  Social Media Website
                </a>
  
                <div
                  class="collapse navbar-collapse pt-3 pb-2 py-lg-0 w-100 d-flex justify-content-end"
                  id="navigation">
                  {/* <div class="row height d-flex justify-content-center align-items-center">
                    <div class="form w-100 d-flex">
                      <input
                        type="text"
                        class="form-control form-input"
                        placeholder="Search "
                      ></input>
                      <span class="left-pan">
                        <Search  style={{marginTop:"7px", marginLeft:"5px"}}/>
                      </span>
  
                    </div>
                    
                  </div> */}
                  <AddPostIcon className="blue-font" style={{width:"30px", height:"30px", marginLeft:"80px"}} data-bs-toggle="modal" data-bs-target="#postModal" /> 
                  <ul class="navbar-nav navbar-nav-hover">
                    
                      <a
                        class="nav-link ps-2 d-flex cursor-pointer align-items-center blue-font"
                        id="dropdownMenuPages"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <Notification style={{width:"22px", height:"22px", marginLeft:"15px"}}/>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end dropdown-nav-notification" aria-labelledby="dropdownMenuPages">
                      {data.length!=0?(data.map((item, index) => (
                        <li><div class="card w-100 add-friend-card-home">
                                <div class="card-body d-flex justify-content-between add-friend-card-home-div" >
                                    <div className="d-flex">
                                        <img src={item.profile_image?(
                                            `${serverBaseURI}/images/${item.profile_image}`
                                            ):(
                                                image
                                        )}
                                        style={{height:"30px",width:"30px",borderRadius:"50%"}}/>
                                        <div>
                                            <p class="card-text" style={{ marginBottom:"0px", marginLeft:"5px"}}><Link to={{pathname:"/viewUser", search: `?cust_id=${item.cust_id}`}} className="text-decoration-none text-reset">{item.f_name}</Link></p>    
                                
                                        </div>
                                        </div>
                                        <button type="submit" onClick={() => onclick(item.cust_id)} className="btn btn-sm navbar-friend-accept">Accept</button>
                                </div>
                        </div></li>
                      ))):(
                        <p style={{fontSize:"15px",fontWeight:"500" , marginLeft:"10px"}}>No Notifications</p>
                      )}
                      </ul>
                    <a
                      class="nav-link ps-2 d-flex cursor-pointer align-items-center blue-font" >
                        <Link to="/chat" className="text-reset">
                          <Chat style={{width:"22px", height:"22px", marginLeft:"15px"}}/>
                      </Link>
                      
                    </a>
                    <div>
                    <a
                      class="nav-link ps-2 d-flex cursor-pointer align-items-center blue-font"
                      id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{fontSize:"18px"}}>
                      {fn}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                      <li><Link to="/dashboard" className="dropdown-item">Profile</Link></li>
                      <li><hr class="dropdown-divider" /></li>
                      <li><a class="dropdown-item" onClick={e => logout(e)}>Sign Out</a></li>
                    </ul>
                    </div>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
    </div>
    
    </Fragment>
    );
    
}

export default Navbar;