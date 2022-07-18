import React, { Fragment, useState, useEffect, Profiler} from "react";
import {toast} from "react-toastify";
import "../style.css";
import LikeButton from "./LikeButton";
import PostModal from './PostModal';
import CommentModal from "./CommentModal";
import Navbar from "./Navbar";
import AddFriend from "./AddFriend";
import { ReactComponent as CommentButton } from "bootstrap-icons/icons/chat.svg";
import { useSearchParams } from "react-router-dom";
import NoDP from '../images/noDp.png';
import NoPosts from '../images/noPostsYet.svg';


const ViewUser = ({setAuth}) => {

  const serverBaseURI = 'http://localhost:5000'
  const [cust, setCust] = useSearchParams();
  const cust_id = cust.get('cust_id');

  const [inputs, setInputs] = useState({
    username: "",
    f_name:"",
    profile_image: [],
    image: NoDP
  });


  const { username, f_name, image, profile_image } = inputs;

  const [data, setData] = useState([]);

  async function getUserDet() {
    try {

      const response = await fetch(
        "http://localhost:5000/view/viewUser",
        {
          method: "GET",
          headers: { token: localStorage.token, cust_id: cust_id},
        }
      );

      const parseRes = await response.json();
      setInputs({
        ...inputs,
        username: parseRes[0].username,
        f_name: parseRes[0].f_name,
        profile_image: parseRes[0].profile_image,
      });
 
    } catch (err) {
      console.log(err.message);
    }
  }
  async function getUserPosts(){
    
    try {
        const response = await fetch("http://localhost:5000/view/viewUserPosts",{
        method:"GET",
        headers: { token: localStorage.token , cust_id: cust_id  }
      });

      const parseRes = await response.json();
      setData(parseRes);
   
    } catch (err) {
        console.log(err.message);
    }
}

useEffect(() => {
    getUserDet();
    getUserPosts();
}, [0]);

return (
  <Fragment>
    <PostModal />
    <Navbar setAuth={setAuth}/>
    <div className="home-body">
    <div className="container ">
      <div className="d-flex w-100">
        <div className="bg-trasparent p-4 w-75">
            <div className="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-4 g-3 ">
                <div className="col" style={{width:"100%"}}>
                
                    <div className="card shadow-sm" style={{borderRadius:"5px"}}> 
                        <img src={profile_image?(
                                            `${serverBaseURI}/images/${profile_image}`
                                            ):(
                                                image
                                        )} className="card-title mx-auto mt-3" alt="..." style={{height:"20%", width:"20%", borderRadius:"50%"}}/>
                        <div className="card-body w-100 text-center" style={{paddingBottom:"0px"}}>
                            
                              <p style={{fontSize:"25px",fontWeight:"600"}} className="card-title">{f_name}</p> 
                              <p  style={{margin:"4px", fontSize:"18px", fontWeight:"400"}}>{username}</p>
                            
                            <div className="clearfix mb-3 row text-center"><div className="d-flex">

                              </div>                           
                              
                            </div>
                        </div>
                    </div>
                    {data.length!=0?(data.map((item, index) => (
                    <div className="card shadow-sm" style={{borderRadius:"5px", marginTop:"20px"}}> 
                        <img src={`${serverBaseURI}/images/${item.post_image}`} className="card-img-top-home" alt="..." style={{objectFit:"contain", backgroundColor: "#EAEAEA"}}/>
                        <div className="card-body w-100 d-flex justify-content-between" style={{paddingBottom:"0px"}}>
                            <div className="d-flex w-75">
                              <p style={{fontSize:"18px",margin:"2px"}} className="card-title">{item.username}:</p> 
                              <p className="post-caption" style={{margin:"3px"}}>{item.post_caption}</p>
                            </div>
                            <div className="clearfix mb-3 row"><div className="d-flex justify-content-end">
                              <LikeButton post_id={item.post_id} />
                              <CommentButton  style={{height:"20px",width:"20px", margin:"9px"}} data-bs-toggle="modal" data-bs-target="#commentModal"/>
                              <CommentModal post_id={item.post_id}/>
                              </div>   
                              <div className="row" style={{paddingRight:"0px", paddingTop:"10px"}}><div className="d-flex justify-content-end" style={{paddingRight:"0px"}}>
                              
                              </div>
                              </div>                           
                              
                            </div>
                        </div>
                    </div>
                    ))):(
                        <div className="d-flex">
                            <div className="card mt-3" style={{borderRadius:"5px", borderTopLeftRadius:"0px", borderTopRightRadius:"0px"}}> 
                                <p className="mx-auto mt-4" style={{fontSize:"20px", fontWeight:"500"}}>No Posts Yet</p>
                                <img className="mx-auto my-5" src={NoPosts} style={{width:"70%"}}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <AddFriend />
        </div>
    </div>
    </div>
    
  </Fragment>
);
}

export default ViewUser;