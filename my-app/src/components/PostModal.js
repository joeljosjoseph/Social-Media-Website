import React, { Fragment, useState } from "react";
import {toast} from "react-toastify";
import "../style.css";
import Image from "../images/imageimage.png";

const PostModal = () => {

      const serverBaseURI = 'http://localhost:5000'

      const [inputs, setInputs] = useState({
        post_image: [],
        image: Image
      });

      const [input, setInput] = useState({
        caption: ""
      })

      const {post_image, image} = inputs;

      const { caption } = input;

      const onChange = (e) => {
          setInput({...input,[e.target.name] : e.target.value});
      }

      // Image preview function
      const handleImg = (e) => {
        if(e.target.files[0]) {
            setInputs({
                image: URL.createObjectURL(e.target.files[0]),
                post_image: e.target.files[0],
            });
        }
      }

    const onSubmitForm = async(e) => {
      e.preventDefault();
      try {
          // const body = { post_image, caption };

          const formData = new FormData();

            formData.append('caption', input.caption);
            formData.append('post_image', inputs.post_image);

            console.log(inputs.post_image);
            console.log(formData.get("caption"));

          const response = await fetch("http://localhost:5000/dashboard/addPost", {
              method: "POST",
              headers: {user_name: localStorage.user_name },
              body: formData
          });

          const parseRes = await response.json();
          
          if(parseRes.cust_id){ 
              toast.success("Post Added Successfully");

            }else{
                toast.error(parseRes);
            }
          
      } catch (err) {
          console.log(err.message);
      }
  }

    return (
      <Fragment>
        <div
          class="modal fade "
          id="postModal"
          tabindex="-1"
          aria-labelledby="postModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-xl">
            <form onSubmit={onSubmitForm}>
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="postModalLabel">
                    Add new post
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <div className="mx-5">
                    <label
                      htmlFor="UploadImage"
                      className="form-label d-flex flex-column align-items-center"
                    >
                      <img className="add-post-image" src={image} />
                    </label>
                    <input
                      type="file"
                      className="form-control visually-hidden add-post-image"
                      name="post_image"
                      onChange={handleImg}
                      id="UploadImage"
                      accept=".jpg, .png, .jpeg"
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      maxLength="100"
                      onChange={onChange}
                      placeholder="Add Caption"
                      name="caption"
                      rows="2"
                    />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn submit-button" data-bs-dismiss="modal"
                    aria-label="Close">
                    Upload Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Fragment>
    );
}

export default PostModal;