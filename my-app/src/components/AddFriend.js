import React, { Fragment, useState, useEffect} from "react";
import {toast} from "react-toastify";
import { ReactComponent as AddFriendIcon } from "bootstrap-icons/icons/person-plus-fill.svg";
import NoDP from "../images/noDp.png";

const AddFriend = () => {

    const serverBaseURI = 'http://localhost:5000'
    const [data, setData] = useState([]);
    const image = NoDP;
    const Link = require("react-router-dom").Link;
    
    async function getUsers(){
    
        try {
            const response = await fetch("http://localhost:5000/view/suggFriend",{
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

            const response = await fetch("http://localhost:5000/view/addFriend", {
                method: "POST",
                headers: {"Content-Type" : "application/json", token: localStorage.token, user_id: localStorage.user_id, user_name: localStorage.user_name },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            
            if(parseRes.cust_id1){ 
                toast.success("Friend Request Sent")
      
              }else{
                  toast.error(parseRes);
    
              }

        } catch (err) {
            console.log(err.message);
        }
    }

    

    useEffect(() => {
        getUsers();
    }, [0]);


    return (
        <Fragment>
            <div className="m-4 w-25 home-friend-box" >
                <div class="card-header bg-transparent" style={{color:"#26215b", fontWeight:"500", paddingLeft:"25px"}}>Add Friends 
                </div>
                <div class="card-body">
                    {data.length!=0?(data.map((item, index) => (
                    <div class="card w-100 my-1 add-friend-card-home">
                                <div class="card-body d-flex justify-content-between add-friend-card-home-div" >
                                    <div className="d-flex">
                                        <img src={item.profile_image?(
                                            `${serverBaseURI}/images/${item.profile_image}`
                                            ):(
                                                image
                                        )}
                                        alt="friend_image" style={{borderRadius:"50%"}}/>
                                        <div>
                                            <p class="card-text" style={{ marginBottom:"0px", marginLeft:"5px"}}><Link to={{pathname:"/viewUser", search: `?cust_id=${item.cust_id}`}} className="text-decoration-none text-reset">{item.f_name}</Link></p>    
                                
                                        </div>
                                        </div>
                                        <button type="submit" onClick={() => onclick(item.cust_id)} style={{outline:"none",border:"0px",backgroundColor:"white"}}><AddFriendIcon className="blue-font"/></button>
                                </div>
                    </div>
                    ))):(
                        <p style={{fontSize:"15px", marginLeft:"10px"}}>No Friends to Add</p>
                    )}
                </div>
        </div>
        </Fragment>


    )
}

export default AddFriend;