import React, { Fragment, useState, useEffect} from "react";
import UsersAdmin from "./adminSidebar/UsersAdmin";
import Profile from "./sidebar/Profile.js"


const Dashboard = ({ setAuth }) => {

    const [adminCheck, setAdminAuth] = useState(true);
    const adminAuth = boolean => {
        setAdminAuth(boolean);
      };


    async function getName() {
        try {
            const response = await fetch("http://localhost:5000/dashboard", {
            method: "GET",
            headers: { token: localStorage.token}}
            );

            const parseRes = await response.json();
            
            parseRes.f_name ? setAdminAuth(false) :
            setAdminAuth(true);
            

        } catch (err) {
            console.log(err.message);
        }
    }
    
        useEffect(() => {
            getName();
        }, [0]);

        

    return (
        <Fragment >
            
            { adminCheck ? (
                    <UsersAdmin setAuth = {setAuth} /> 
                    ) : (
                        <Profile setAuth = {setAuth}/>
                    )}
            

        </Fragment>
    );
};

export default Dashboard;