import React, { Fragment, useState, useEffect, Profiler} from "react";
import {toast} from "react-toastify";
import "../style.css";
import LikeButton from "./LikeButton";
import PostModal from './PostModal';
import CommentModal from "./CommentModal";
import Navbar from "./Navbar";
import AddFriend from "./AddFriend";
import { ReactComponent as CommentButton } from "bootstrap-icons/icons/chat.svg";

import NoPosts from '../images/HomeNoPost.svg';



const Home = ({setAuth}) => {
  
  const Link = require("react-router-dom").Link;
  const serverBaseURI = 'http://localhost:5000'
  const [data, setData] = useState([]);
  async function getPosts(){
    
    try {
        const response = await fetch("http://localhost:5000/view/homePosts",{
        method:"GET",
        headers: { token: localStorage.token , user_name: localStorage.user_name  }
      });

      const parseRes = await response.json();
      console.log(parseRes);
      setData(parseRes);
   
    } catch (err) {
        console.log(err.message);
    }
}

// let post_id = 0;

// function passValue(p_id){
//   post_id= p_id;
//   console.log(post_id);
//   <CommentModal post_id={post_id}/>
//   document.querySelector('#btn1').click();
// }


useEffect(() => {
  getPosts();
}, [0]);

return (
  <Fragment>
    {/* <CommentModal post_id={post_id}/>
    <button type="button" id="btn1" data-bs-toggle="modal" data-bs-target="#commentModal"  onClick={() => onclick(post_id)}/> */}

    <PostModal />
    <Navbar setAuth={setAuth}/>
    <div className="home-body">
    <div className="container ">
      <div className="d-flex w-100">
        <div className="bg-trasparent p-4 w-75">
            <div className="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-4 g-3 ">
                <div className="col" style={{width:"100%"}}>
                {data.length!=0?(
                  data.map((item, index) => (
                    <div className="card shadow-sm" style={{borderRadius:"5px", marginTop:"20px"}}> 
                        <img src={`${serverBaseURI}/images/${item.post_image}`} className="card-img-top-home" alt="..." style={{objectFit:"contain", backgroundColor: "#EAEAEA"}}/>
                        <div className="card-body w-100 d-flex justify-content-between" style={{paddingBottom:"0px"}}>
                            <div className="d-flex w-75">
                              <p style={{fontSize:"18px",margin:"2px"}} className="card-title"><Link to={{pathname:"/viewUser", search: `?cust_id=${item.cust_id}`}} className="text-decoration-none text-reset">{item.username} :</Link></p> 
                              <p className="post-caption" style={{margin:"4px"}}>{item.post_caption}</p>
                            </div>
                            <div className="clearfix mb-3 row"><div className="d-flex justify-content-end">
                              
                              <LikeButton post_id={item.post_id} />
                              <CommentButton style={{height:"20px",width:"20px", margin:"9px"}} data-bs-toggle="modal" data-bs-target="#commentModal"/>
                              <CommentModal post_id={item.post_id}/>
                              </div>   
                              {/* <div className="row" style={{paddingRight:"0px", paddingTop:"10px"}}><div className="d-flex justify-content-end" style={{paddingRight:"0px"}}>
                                <p style={{fontSize:"12px"}}>274 Likes  2 Comments</p> 
                              </div>
                              </div>                            */}
                              
                            </div>
                        </div>
                    </div>
                ))):(
                  <div>
                    <p className="mt-5 mb-5 text-center" style={{fontSize:"27px", fontWeight:"600"}}>Add Friends to get Started</p>
                    <img src={NoPosts} style={{height:"60vh", margin:"0 20%"}} alt="React Logo" className="text-center" />
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

export default Home;