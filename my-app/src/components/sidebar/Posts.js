import React, { Fragment, useState, useEffect, Profiler} from "react";
import {toast} from "react-toastify";
import "../../style.css";
import CommentModal from "../CommentModal";
import SidebarCust from "./SidebarCust";
import NoPostsYet from '../../images/noPostsYet.svg';
import { ReactComponent as DeleteButton } from "bootstrap-icons/icons/trash-fill.svg";


const Posts = ({ setAuth }) => {

    const serverBaseURI = 'http://localhost:5000'
    const [isActive,setActive] = useState("posts");
    const [data, setData] = useState([]);

    async function getMyPosts(){
    
        try {
            const response = await fetch("http://localhost:5000/view/myPosts",{
            method:"GET",
            headers: { token: localStorage.token , user_name: localStorage.user_name }
          });
    
          const parseRes = await response.json();
          setData(parseRes);
       
        } catch (err) {
            console.log(err.message);
        }
    }

    async function deletePost(post_id ) {
        try {

            const body = { post_id };

            const response = await fetch("http://localhost:5000/dashboard/deletePost", {
                method: "POST",
                headers: {"Content-Type" : "application/json", token: localStorage.token, user_id: localStorage.user_id, user_name: localStorage.user_name },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            
            if(parseRes.cust_id1){ 
                toast.success("Post Deleted!")
      
              }else{
                  toast.error(parseRes);
    
              }

        } catch (err) {
            console.log(err.message);
        }
    }
    
    useEffect(() => {
      getMyPosts();
    }, [0]);

    return  <Fragment>
        <div className="d-flex">
        
            <SidebarCust setAuth={setAuth}  isActive={isActive}/>
       
        <div className="bg-trasparent my-4 p-3" >
        <div className="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-4 g-3">
            <div className="col w-100">
            {data.length!=0?(data.map((item, index) => (
                <div className="card h-100 shadow-sm" style={{borderRadius:"20px",width:"350px",backgroundColor:"#EAEAEA"}}> 
                    <DeleteButton style={{marginLeft:"90%", marginTop:"10px", height:"20px",width:"20px", color:"red"}} onClick={() => deletePost(item.post_id)}/>
                    <img src={`${serverBaseURI}/images/${item.post_image}`} className="card-img-top" style={{objectFit:"contain"}}/>
                    <div className="card-body w-100 bg-white">
                        <div className="d-flex" >
                            <p className="card-title" style={{fontSize:"16px",fontWeight:"500"}}>{item.post_caption}</p>
                        </div>
                        <div className="clearfix mb-3"> 
                        
                            <span className="float-start" data-bs-toggle="modal" data-bs-target="#commentModal" style={{fontSize:"12px", marginLeft:"1px"}}>View Comments</span> 
                            <CommentModal post_id={item.post_id}/>
                        </div>
                    </div>
                </div>
            ))):(
                <div>
                    <p className="mt-5 mb-5 text-center" style={{fontSize:"27px", fontWeight:"600",marginLeft:"100px"}}>It Looks Empty Here!</p>
                    <img src={NoPostsYet} style={{height:"40vh",width:"100vh", margin:"0 10%"}} alt="React Logo" className="text-center" />
                  </div>
            )}
            
            </div>
        </div>
    </div>
    </div>
        
    </Fragment>


}

export default Posts;