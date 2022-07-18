import React, { Fragment, useState, useEffect} from "react";
import {toast} from "react-toastify";
import { ReactComponent as AddFriendIcon } from "bootstrap-icons/icons/person-plus-fill.svg";
import NoDP from "../images/noDp.png";
import Chat from "./Chat";


                       
const ChatDiv = () =>{   

  const serverBaseURI = 'http://localhost:5000'

  let [inputs, setInputs] = useState({
    comm: "",
    image: NoDP,
  });
  const [data, setData] = useState([]);
  let {profile_image, image, username} = inputs;

  async function getDetails() {
    try {
        const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.token}}
        );

    const parseRes = await response.json();

    setInputs({...inputs, 
        profile_image: parseRes.profile_image,
        image : NoDP,
        username:parseRes.username
        })

    } catch (err) {
        console.log(err.message);
    }
}

async function getFriends() {
  try {
      const response = await fetch("http://localhost:5000/view/chatFriends", {
      method: "GET",
      headers: { token: localStorage.token,user_name: localStorage.user_name}}
      );

  const parseRes = await response.json();
  setData(parseRes);


  } catch (err) {
      console.log(err.message);
  }
}

useEffect(() => {
  getDetails();
  getFriends();
  }, [0]);



    const Link = require("react-router-dom").Link;      
            return (
              <Fragment>
                <div className="d-flex">
                <div className="col-auto col-md-3 col-xl-3 px-sm-2 px-0 cust-sidebar">
                  <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
                    <a
                      href="/"
                      className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none"
                    >
                      <Link to="/" className="text-reset">
                        <img
                          src={profile_image?(
                            `${serverBaseURI}/images/${profile_image}`
                            ):(
                                image
                        )}width="35"
                          height="35"
                          className="rounded-circle"
                        />
                      </Link>
                      <h4
                        className="d-lg-inline"
                        style={{
                          color: "#26215b",
                          padding: "15px",
                          fontWeight: "700",
                        }}
                      >
                        Chats
                      </h4>
                    </a>
                    <ul
                      className="nav nav-pills w-100 mb-sm-auto mb-0 align-items-center customer-sidebar-menu align-items-sm-start"
                      id="menu">
                      {data.length!=0?(data.map((item, index) => (
                      <li className="nav-item sidebar-list-chat">
                        <div class="card w-100 chat-sidebar-card">
                          <Link to={{pathname:"/chat", search: `?cust_id=${item.cust_id}&f_name=${item.f_name}&image=${item.profile_image}`}} className="text-decoration-none text-reset">
                          <div class="card-body d-flex justify-content-between chat-sidebar-card-div">
                            <div className="d-flex">
                              <img
                                src={item.profile_image?(
                                  `${serverBaseURI}/images/${item.profile_image}`
                                  ):(
                                      image
                                )}
                                alt="friend_image"
                                style={{ borderRadius: "50%",height:"40px", width:"40px" }}/>
                              <div>
                                <p
                                  class="chat-sidebar-card-text"
                                  style={{
                                    marginBottom: "0px",
                                    marginLeft: "5px"}}>
                                  {item.f_name}
                                </p>
                              </div>
                            </div>
                          </div>
                          </Link>
                        </div>
                      </li>
                     ))):(
                      <p style={{fontSize:"15px", marginLeft:"10px"}}>No Friends to Chat with</p>
                  )}
                    </ul>
                  </div>
                </div>
                      <Chat className="w=100"/>
                </div>
                
              </Fragment>
            );
}
export default ChatDiv;
