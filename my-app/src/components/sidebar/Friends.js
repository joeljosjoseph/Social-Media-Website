import React, { Fragment, useState, useEffect, Profiler} from "react";
import {toast} from "react-toastify";
import "../../style.css";
import SidebarCust from "./SidebarCust";
import NoPostsYet from '../../images/noPostsYet.svg';
import NoDP from "../../images/noDp.png";

const Friends = ({ setAuth }) => {
    const serverBaseURI = 'http://localhost:5000'
    const [isActive,setActive] = useState("friends");
    const Link = require("react-router-dom").Link;
    const image = NoDP;
    const [data, setData] = useState([]);
    
    async function getFriends(){
    
        try {
            const response = await fetch("http://localhost:5000/view/friends",{
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

            const response = await fetch("http://localhost:5000/dashboard/removeFriend", {
                method: "POST",
                headers: {"Content-Type" : "application/json", token: localStorage.token, user_name: localStorage.user_name },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            
            if(parseRes.cust_id1){ 
                toast.success("Friend Removed")
      
              }else{
                  toast.error(parseRes);
    
              }

        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        getFriends();
    }, [0]);

    return <Fragment>

        <div className="d-flex">
        <SidebarCust setAuth={setAuth}  isActive={isActive}/>

        <div className="bg-trasparent my-4 p-3 w-100" >
        {data.length!=0?(data.map((item, index) => (
            <div class="card w-100 my-2">
                <div class="card-body d-flex justify-content-between" >
                    <div className="d-flex">
                        <img className="friend_image" alt="friend_image" style={{marginRight:"10px"}}
                        src={item.profile_image?(
                            `${serverBaseURI}/images/${item.profile_image}`
                            ):(
                                image
                        )}/>
                        <div><Link to={{pathname:"/viewUser", search: `?cust_id=${item.cust_id}`}} className="text-decoration-none text-reset">
                            <h4 class="card-text" style={{ marginBottom:"0px"}}>{item.f_name}</h4>
                            <p class="card-text">{item.username}</p>
                            </Link>
                   
                        </div>
                         </div>
                    <button onClick={() => onclick(item.cust_id)} class="btn btn-danger friend_remove_button" >Remove</button>
                </div>
            </div>
            ))):(
                <div>
                    <p className="mt-5 mb-5" style={{fontSize:"27px", fontWeight:"600", marginLeft:"30%"}}>It Looks Empty Here!</p>
                    <img src={NoPostsYet} style={{height:"40vh",width:"100vh", margin:"0 10%"}} alt="React Logo" className="text-center" />
                  </div>
            )}
        </div>
            
        
        </div>
    </Fragment>


}

export default Friends;