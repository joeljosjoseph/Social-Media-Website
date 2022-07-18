import React, { Fragment, useState, useEffect} from "react";
import {toast} from "react-toastify";

const AdminCommentModal = (post_id) => {

    
    const [data, setData] = useState([]);

    async function viewComments(){
        
        
        try {
            const response = await fetch("http://localhost:5000/view/postComments",{
            method:"GET",
            headers: { token: localStorage.token , post_id: post_id.post_id  }
          });
    
          const parseRes = await response.json();
          setData(parseRes);
       
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
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                {data.map((item, index) => (
                    <div className="d-flex">
                    <img
                        src="https://us.123rf.com/450wm/yupiramos/yupiramos1905/yupiramos190513800/122011151-young-man-avatar-character-vector-illustration-design.jpg?ver=6"
                        alt="friend_image"
                        className="comment-modal-pfp"
                    />
                    <p style={{ padding: "2px" }}>
                        <b> username: </b>
                    </p>
                    <p style={{ padding: "2px" }}>
                        {item.comment_m}
                    </p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
}

export default AdminCommentModal;