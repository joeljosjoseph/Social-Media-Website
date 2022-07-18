import React, { Fragment, useState, useEffect, Profiler} from "react";
import {toast} from "react-toastify";
import "../../style.css";
import { ReactComponent as CommentButton } from "bootstrap-icons/icons/chat.svg";
import AdminCommentModal from "../AdminCommentModal";
import SidebarAdmin from "./SidebarAdmin";
import { ReactComponent as DownloadButton } from "bootstrap-icons/icons/box-arrow-down.svg";


const Posts = ({ setAuth }) => {

    const serverBaseURI = 'http://localhost:5000'
    const [isActive,setActive] = useState("adminPosts");
    const [data, setData] = useState([]);

    async function getAllPosts(){
    
        try {
            const response = await fetch("http://localhost:5000/view/adminPosts",{
            method:"GET",
            headers: { token: localStorage.token}
          });
    
          const parseRes = await response.json();
          setData(parseRes);
       
        } catch (err) {
            console.log(err.message);
        }
    }

    async function onclick() {
        window.print();
      }
    
    
    useEffect(() => {
      getAllPosts();
    }, [0]);

    return  <Fragment>
        <div className="d-flex">
        
            <SidebarAdmin setAuth={setAuth}  isActive={isActive}/>
       
        <div className="bg-trasparent my-4 p-3" style={{marginLeft:"250px"}}>
        <DownloadButton style={{width:"22px", height:"22px", margin:"0 0 15px 1000px" }} type="button" onClick={() => onclick()}/>
        
        <div className="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-4 g-3">
            <div className="col d-flex" style={{width:"100%", flexWrap:"wrap"}}>
            {data.length!=0?(
                  data.map((item, index) => (
                <div className="card shadow-sm" style={{borderRadius:"20px",width:"350px"}}> 
                    <img src={`${serverBaseURI}/images/${item.post_image}`} style={{objectFit:"contain"}} className="card-img-top" alt="..." />
                    <div className="card-body w-100">
                        <div className="d-flex">
                            <p className="card-title" style={{fontSize:"18px",fontWeight:"500"}}>{item.username} :</p>
                            <p className="card-title" style={{fontSize:"16px",fontWeight:"400", margin:"1px 10px"}}> {item.post_caption}</p>
                        </div>
                        <div className="clearfix mb-3"> 
                        
                            <span className="float-start" data-bs-toggle="modal" data-bs-target="#commentModal" style={{fontSize:"12px"}}>View Comments</span> 
                            <AdminCommentModal post_id={item.post_id}/>
                        </div>
                    </div>
                </div>
            ))):(
                <p style={{fontSize:"22px", fontWeight:"500"}}>No Posts Yet</p>
              )}
            
            </div>
        </div>
    </div>
    </div>
        
    </Fragment>


}

export default Posts;