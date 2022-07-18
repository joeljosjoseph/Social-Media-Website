import React, { Fragment, useState, useEffect, Profiler} from "react";
import {toast} from "react-toastify";
import "../../style.css";
import SidebarCust from "./SidebarCust";

const Posts = ({ setAuth }) => {

    const [isActive,setActive] = useState("account");

    const [inputs, setInputs] = useState({
        fn: "",
        ln: "",
        mn: "",
        phn: "",
        em: "",
      });
      const {fn,ln,mn,phn,em} = inputs;

      const onChange = (e) => {
        setInputs({...inputs,[e.target.name] : e.target.value});
    }


    async function getDetails() {
        try {
            const response = await fetch("http://localhost:5000/dashboard", {
            method: "GET",
            headers: { token: localStorage.token}}
            );

        const parseRes = await response.json();
        
        setInputs({...inputs, 
            fn: parseRes.f_name,
            mn: parseRes.m_name, 
            ln: parseRes.l_name, 
            em: parseRes.user_name,
            phn: parseRes.ph_no, 
            })



        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        getDetails();
    }, []);

    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {
            const body = { fn, mn, ln, phn, em };

            const response = await fetch("http://localhost:5000/dashboard/updateAccount", {
                method: "POST",
                headers: {"Content-Type" : "application/json", token: localStorage.token },
                body: JSON.stringify(body)
            });
            

            const parseRes = await response.json();
            
            if(parseRes.firstname){ 
                toast.success("Updated Succesfully")
      
              }else{
                  toast.error(parseRes);
    
              }

            console.log(parseRes);
            
        } catch (err) {
            console.log(err.message);
        }
    }

    return <Fragment>
        <div className="d-flex">
            <SidebarCust setAuth={setAuth} isActive={isActive}/>
        
            
        
            <div class="container">
                <form onSubmit={onSubmitForm} class="form-horizontal cust-profile-form">
                <h2 className="py-4" style={{color:"#26215b"}}>Account Management</h2>
                <div class="form-group">
                    <label for="firstName" class="col-sm-3 control-label">First Name</label>
                    <div class="col-sm-9 custProfile-form-input">
                        <input type="text" name="fn" placeholder="First Name" value={inputs.fn} onChange={e => onChange(e)} class="form-control" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="firstName" class="col-sm-3 control-label">Middle Name</label>
                    <div class="col-sm-9 custProfile-form-input">
                        <input type="text" name="mn" placeholder="Middle Name" value={inputs.mn} onChange={e => onChange(e)} class="form-control" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="lastName" class="col-sm-3 control-label">Last Name</label>
                    <div class="col-sm-9 custProfile-form-input">
                        <input type="text" name="ln" placeholder="Last Name" value={inputs.ln} onChange={e => onChange(e)} class="form-control" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="email" class="col-sm-3 control-label">Email* </label>
                    <div class="col-sm-9 custProfile-form-input">
                        <input type="email" name="em" placeholder="Email" value={inputs.em} disabled class="form-control" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="phoneNumber" class="col-sm-3 control-label">Phone number </label>
                    <div class="col-sm-9 custProfile-form-input">
                        <input type="phoneNumber" name="phn" placeholder="Phone number" value={inputs.phn} onChange={e => onChange(e)} class="form-control" />
                    </div>
                </div>
                
                <button type="submit" class="btn submit-button-2 ml-auto">Save Changes</button>
            </form> 
            </div> 
            </div>
    </Fragment>


}

export default Posts;