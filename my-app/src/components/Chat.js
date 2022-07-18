import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ReactComponent as AddFriendIcon } from "bootstrap-icons/icons/person-plus-fill.svg";
import { useSearchParams } from "react-router-dom";
import SC from "../images/startChat.svg";
import NoDP from "../images/noDp.png";

const Chat = (setAuth) => {
  const serverBaseURI = "http://localhost:5000";
  const [cust, setCust] = useSearchParams();
  const cust_id = cust.get("cust_id");
  
  const f_name = cust.get("f_name");
  const dp = cust.get("image");
  const nodp = NoDP;
  const [data, setData] = useState([]);
  const image = SC;

  const [inputs, setInputs] = useState({
    chat: "",
  });

  const { chat } = inputs;

  async function getChat() {
    try {
      const response = await fetch("http://localhost:5000/view/chatDetails", {
        method: "GET",
        headers: {
          token: localStorage.token,
          cust_id: cust_id,
          user_name: localStorage.user_name,
        },
      });

      const parseRes = await response.json();
      setData(parseRes);
      console.log(parseRes);
    } catch (err) {
      console.log(err.message);
    }
  }

  const onchange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { chat };
      const response = await fetch("http://localhost:5000/dashboard/sendChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          receiver_id: cust_id,
          user_name: localStorage.user_name,
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.sender_id) {
        window.location.reload(true);
      } else {
        toast.error(parseRes);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (cust_id) {
      getChat();
    }
  }, [0]);

  return (
    <Fragment>
      <div className="d-flex w-100">
        <div class="card chatbox-card">
          <div class="card-header msg_head" style={{backgroundColor:"#EAEAEA"}}>
            <div class="d-flex bd-highlight">
              <div class="img_cont">{
				  cust_id?(
					<img
					src={dp != "null"? `${serverBaseURI}/images/${dp}` : nodp}
					class="rounded-circle user_img"
				  />
				  ):(<div></div>)
			  }
                
              </div>
              <div class="user_info">
                <span>{f_name}</span>
              </div>
            </div>
          </div>
          <div class="card-body msg_card_body">
            {data.length != 0 ? (
              data.map((item, index) => (
                <div>
                  {item.c_from == cust_id ? (
                    <div class="d-flex justify-content-start mb-4">
                      <div class="img_cont_msg">
                        <img
                          src={item.profile_image?(
							`${serverBaseURI}/images/${item.profile_image}`
							):(
								NoDP
						)} class="rounded-circle user_img_msg"
                        />
                      </div>
                      <div class="msg_container">{item.message}</div>
                    </div>
                  ) : (
                    <div class="d-flex justify-content-end mb-4">
                      <div class="msg_container_send">
					  {item.message}
                      </div>
                      <div class="img_cont_msg">
                        <img
                          src={nodp}	
						  alt="friend_image"
						  class="rounded-circle user_img_msg"
                          style={{ borderRadius: "50%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="d-flex flex-column">
                <p
                  className="mx-auto"
                  style={{ fontSize: "20px", fontWeight: "500" }}
                >
                  Start Chatting Now
                </p>
                <img
                  src={image}
                  className="mx-auto"
                  style={{ height: "40%", width: "40%" }}
                ></img>
              </div>
            )}
          </div>
          <div class="card-footer">
            <form onSubmit={onSubmitForm}>
              <div class="input-group">
                <input
                  name="chat"
                  class="form-control"
                  onChange={(e) => onchange(e)}
                  placeholder="Type your message..."
                ></input>
                <div class="input-group-append">
                  <button class="input-group-text send_btn" type="submit">
                    <i class="fas fa-location-arrow"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Chat;
