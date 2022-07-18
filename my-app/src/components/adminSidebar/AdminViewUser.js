import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../style.css";
import SidebarAdmin from "./SidebarAdmin";
import AdminCommentModal from "../AdminCommentModal";
import NoDP from "../../images/noDp.png";
import NoPosts from "../../images/noPostsYet.svg";
import { useSearchParams } from "react-router-dom";

const AdminViewUser = (props) => {
  const serverBaseURI = "http://localhost:5000";
  const [isActive, setActive] = useState("usersAdmin");
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const image = NoDP;
  const image1 = NoPosts;

  const [cust, setCust] = useSearchParams();
  const cust_id = cust.get('cust_id');
  const user_name = "";



    async function getUserDet() {
      try {

        const response = await fetch(
          "http://localhost:5000/view/viewUserAdmin",
          {
            method: "GET",
            headers: { token: localStorage.token, cust_id: cust_id},
          }
        );

        const parseRes = await response.json();
        setData(parseRes);
      } catch (err) {
        console.log(err.message);
      }
    }
    async function getUserPosts() {
        try {
  
          const response = await fetch(
            "http://localhost:5000/view/viewUserAdminPosts",
            {
              method: "GET",
              headers: { token: localStorage.token, cust_id: cust_id},
            }
          );
  
          const parseRes = await response.json();
          setPosts(parseRes);
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
      <div className="d-flex">
        <SidebarAdmin setAuth={props.setAuth} isActive={isActive} />
        <div className="bg-trasparent my-4 p-3 w-75 py-5 " style={{marginLeft:"250px"}}>
          
          {data.map((item, index) => (
              <div>
          <div className="d-flex">
            <img
              className="profile_image"
              alt="friend_image"
              style={{ marginRight: "10px" }}
              src={
                item.profile_image
                  ? `${serverBaseURI}/images/${item.profile_image}`
                  : image
              }
            />
            <div>
              <h4 class="card-text mt-3" style={{ marginBottom: "0px" }}>
                {item.f_name}
              </h4>
              <h5 class="card-text mt-1" style={{ marginBottom: "0px" }}>
                {item.username}
              </h5>
              <h5 class="card-text mt-1" style={{ marginBottom: "0px" }}>
                Email : {item.user_name}
              </h5>
            </div>
          </div>
          </div>

          ))}
          {posts.length!=0?(posts.map((post, index) => (
          <div
            className="card shadow-sm mt-3"
            style={{ borderRadius: "20px", width: "350px" }}>
            <img
              src={`${serverBaseURI}/images/${post.post_image}`}
              style={{ objectFit: "contain" }}
              className="card-img-top"
              alt="..."
            />
            <div className="card-body w-100">
              <div className="d-flex">
                <p
                  className="card-title"
                  style={{ fontSize: "18px", fontWeight: "500" }}
                >
                  {post.username} :
                </p>
                <p
                  className="card-title"
                  style={{
                    fontSize: "16px",
                    fontWeight: "400",
                    margin: "1px 10px",
                  }}
                >
                  
                  {post.post_caption}
                </p>
              </div>
              <div className="clearfix mb-3">
                {/* <span className="float-start " style={{ fontSize: "12px" }}>
                  274 Likes <p></p>
                </span> */}
                <AdminCommentModal post_id={post.post_id}/>
                <span
                  className=""
                  data-bs-toggle="modal"
                  data-bs-target="#commentModal"
                  style={{ fontSize: "16px" }}
                >
                View Comments
                </span>
                
              </div>
            </div>
          </div>
          ))):(
            <p
            style={{
              fontSize: "16px",
              fontWeight: "400",
              margin: "1px 10px",
            }}
          >
            No Posts Yet
          </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default AdminViewUser;
