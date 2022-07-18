import React, { Fragment, useState, useEffect} from "react";
import {toast} from "react-toastify";
import NoDP from "../images/noDp.png";

const CommentModal = (post_id) => {

  const serverBaseURI = 'http://localhost:5000'
  console.log(post_id);
    const [data, setData] = useState([]);

    const [inputs, setInputs] = useState({
        comm: "",
        image: NoDP
      });
      const {comm , image} = inputs;

      const onChange = (e) => {
        setInputs({...inputs,[e.target.name] : e.target.value});
    }


    async function viewComments(){
        
        
        try {
            const response = await fetch("http://localhost:5000/view/postComments",{
            method:"GET",
            headers: { token: localStorage.token , user_name: localStorage.user_name , post_id: post_id.post_id  }
          });
    
          const parseRes = await response.json();
          setData(parseRes);
       
        } catch (err) {
            console.log(err.message);
        }
    }

    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {
            const body = { comm };

            const response = await fetch("http://localhost:5000/dashboard/addComment", {
                method: "POST",
                headers: {"Content-Type" : "application/json", token: localStorage.token, user_name: localStorage.user_name, post_id: post_id.post_id  },
                body: JSON.stringify(body)
            });
            

            const parseRes = await response.json();
            
            if(parseRes.post_id){ 
                toast.success("Commented Successfully")
      
              }else{
                  toast.error(parseRes);
    
              }

            
        } catch (err) {
            console.log(err.message);
        }
    }


    useEffect(() => {
    viewComments();
    }, [0]);

    return (
      <Fragment>
        <div
          class="modal fade "
          id="commentModal"
          tabindex="-1"
          aria-labelledby="commentModalLabel"
          aria-hidden="true"
        >
          
          <div class=" modal-lg modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="commentModalLabel">
                  Comments
                  {post_id[0]}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
              {data.length!=0?(
                  data.map((item, index) => (
                    <div className="d-flex">
                    <img
                        src={item.profile_image?(
                          `${serverBaseURI}/images/${item.profile_image}`
                          ):(
                              image
                      )} alt="friend_image"
                        className="comment-modal-pfp"
                    />
                    <p style={{ padding: "2px" }}>
                        <b> {item.username}: </b>
                    </p>
                    <p style={{ padding: "2px" }}>
                        {item.comment_m}
                    </p>
                    </div>
                ))):(
                  <p style={{fontSize:"18px", fontWeight:"400"}}>No Comments Yet</p>
                )}
              </div>
              <div class="modal-footer">
                <form className=" w-100" onSubmit={onSubmitForm}>
                  <div className="d-flex">
                    <input
                      name="comm"
                      className="form-control"
                      placeholder="Enter Comment"
                      onChange={e => onChange(e)}
                    />
                    <button
                      type="submit"
                      class="btn submit-button"
                      style={{ width: "10%" }}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
}

export default CommentModal;