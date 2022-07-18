import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../style.css";
import SidebarAdmin from "./SidebarAdmin";
import NoDP from "../../images/noDp.png";
import { ReactComponent as DownloadButton } from "bootstrap-icons/icons/box-arrow-down.svg";


const UsersAdmin = (props) => {

  const Link = require("react-router-dom").Link;
  const serverBaseURI = 'http://localhost:5000'
  const [isActive, setActive] = useState("usersAdmin");
  const [data, setData] = useState([]);
  const image = NoDP;


  async function getUsers() {
    try {
      const response = await fetch(
        "http://localhost:5000/dashboard/usersAdmin",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

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
    getUsers();
  }, [0]);

  return (
    <Fragment>
      <div className="d-flex">
        <SidebarAdmin setAuth={props.setAuth} isActive={isActive} />
        <div className="bg-trasparent my-4 p-3 w-75 py-5" style={{marginLeft:"250px"}}>
        <DownloadButton style={{width:"22px", height:"22px", margin:"0 5px 15px 0", float:"right" }} type="button" onClick={() => onclick()}/>
          {data.map((item, index) => (
            <div class="card w-100 my-2">
              <div class="card-body d-flex justify-content-between">
                <div className="d-flex">
                  <img
                    className="friend_image"
                    alt="friend_image" style={{marginRight:"10px"}}
                    src={
                      item.profile_image
                        ? `${serverBaseURI}/images/${item.profile_image}`
                        : image
                    }
                  />
                  <div>
                    <h4 class="card-text" style={{ marginBottom: "0px" }}>
                      {item.f_name}
                    </h4>
                    <p class="card-text">{item.username}</p>
                  </div>
                </div>
                <p class="btn submit-button my-auto "><Link to={{pathname:"/viewUserAdmin", search: `?cust_id=${item.cust_id}` }}  className="text-decoration-none text-reset" cust_id={item.cust_id}> View</Link>
                 
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default UsersAdmin;
