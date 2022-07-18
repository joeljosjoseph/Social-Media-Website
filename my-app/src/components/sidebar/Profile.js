import React, { Fragment, useState, useEffect, Profiler } from "react";
import { toast } from "react-toastify";
import "../../style.css";
import SidebarCust from "./SidebarCust.js";
import NoPosts from "../../images/profileImage.svg";

const Profile = ({ setAuth }) => {

  const serverBaseURI = 'http://localhost:5000'
  const [isActive, setActive] = useState("profile");

  const [inputs, setInputs] = useState({
    username: "",
    bio: "",
    profile_image: [],
    image: NoPosts
  });


  const { username, bio, image, profile_image } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Image preview function
  const handleImg = (e) => {
    if(e.target.files[0]) {
        setInputs({
            image: URL.createObjectURL(e.target.files[0]),
            profile_image: e.target.files[0],
        });
    }
  }

  async function getDetails() {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      setInputs({
        ...inputs,
        username: parseRes.username,
        bio: parseRes.bio,
        profile_image: parseRes.profile_image,
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  const onSubmitForm = async(e) => {
    e.preventDefault();
    try {
        // const body = { post_image, caption };

        const formData = new FormData();

          formData.append('bio', inputs.bio);
          formData.append('post_image', inputs.profile_image);

          console.log(inputs.post_image);
          console.log(formData.get("bio"));

        const response = await fetch("http://localhost:5000/dashboard/addProfilePic", {
            method: "POST",
            headers: {user_name: localStorage.user_name },
            body: formData
        });

        const parseRes = await response.json();
        
        if(parseRes.cust_id){ 
            toast.success("Updated Successfully");

          }else{
              toast.error(parseRes);
          }
        
    } catch (err) {
        console.log(err.message);
    }
}

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <Fragment>
      <div className="d-flex">
        <SidebarCust setAuth={setAuth} isActive={isActive} />

        <div class="container">
          <form class="form-horizontal cust-profile-form" onSubmit={onSubmitForm}>
            <h2 className="py-4" style={{ color: "#26215b" }}>
              Profile Management
            </h2>
            <div className="d-flex">
                <label
                htmlFor="UploadImage"
                className="form-label d-flex flex-column"
                > <p style={{fontSize:"18px", fontWeight:"400"}}>Update Profile Picture </p>
                <img className="add-post-image mb-4 mt-4" src={profile_image?(
                    `${serverBaseURI}/images/${profile_image}`
                    ):(
                        image
                )} />
                
                </label>
            </div>
            <input
              type="file"
              className="form-control visually-hidden add-post-image"
              name="post_image"
              onChange={handleImg}
              id="UploadImage"
              accept=".jpg, .png, .jpeg"
            />

            <div class="form-group">
              <label for="firstName" class="col-sm-3 control-label">
                User Name
              </label>
              <div class="col-sm-9 custProfile-form-input">
                <input
                  type="text"
                  id="username"
                  value={inputs.username}
                  onChange={(e) => onChange(e)}
                  class="form-control"
                  disabled
                />
              </div>
            </div>
            <div class="form-group">
              <label for="lastName" class="col-sm-3 control-label">
                Biography
              </label>
              <div class="col-sm-9 custProfile-form-input">
                <input
                  type="text"
                  id="lastName"
                  name="bio"
                  placeholder="Add Bio"
                  value={inputs.bio}
                  onChange={(e) => onChange(e)}
                  class="form-control"
                />
              </div>
            </div>

            <button type="submit" class="btn submit-button-2 ml-auto">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
