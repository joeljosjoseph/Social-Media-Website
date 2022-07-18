import React, { Fragment, useState, useEffect, Profiler} from "react";
import {toast} from "react-toastify";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
  
const LikeButton = (post_id) => {


  const [checked, setChecked] = useState();

  async function checkIfLiked(){
    
    try {
        const response = await fetch("http://localhost:5000/view/checkIfLiked",{
        method:"GET",
        headers: { token: localStorage.token , user_name: localStorage.user_name , post_id: post_id.post_id  }
      });

      const parseRes = await response.json();
      
      if(parseRes.post_id){

        return true;
      } else {

        return false;
      }
   
    } catch (err) {
        console.log(err.message);
    }
}

  async function onclick (post_id) {
    try {

        const body = { post_id };

        const response = await fetch("http://localhost:5000/dashboard/likePost", {
            method: "POST",
            headers: {"Content-Type" : "application/json", token: localStorage.token, user_name: localStorage.user_name },
            body: JSON.stringify(body)
        });


        const parseRes = await response.json();
        
        if(parseRes.post_id){ 
            toast.success("Liked Post")
  
          }else{
              toast.error(parseRes);

          }

    } catch (err) {
        console.log(err.message);
    }
}
// useEffect(() => {
//   checkIfLiked();
// }, [0]);

let val = checkIfLiked();
val.then(function(result){
  if (result) {
    setChecked(result);
    
  } else {
    setChecked(result);
  }
})
  return (
    <div >
      {
      checked == true?
      (
        <FormControlLabel
        control={<Checkbox icon={<FavoriteBorder />} 
                  checkedIcon={<Favorite />}
          name="checkedH" 
          checked={true}
          onClick={() => onclick(post_id.post_id)}
          
          />}
      />
      ):(

      <FormControlLabel
        control={<Checkbox icon={<FavoriteBorder />} 
                  checkedIcon={<Favorite />}
          name="checkedH" 
          onClick={() => onclick(post_id.post_id)}
          checked={false}
          />}
      />
      )}
    </div>
  );
}
  
export default LikeButton;