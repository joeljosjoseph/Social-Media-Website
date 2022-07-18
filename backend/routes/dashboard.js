const router = require("express").Router();
const pool =  require("../db");
const authorization = require("../middleware/authorization");
const multer  = require('multer');
const upload = multer();

router.get("/", authorization, async (req, res) => {
    try {

        //req.user has the payload
        // res.json(req.user);

        const user1 = await pool.query("SELECT user_name FROM tbl_login WHERE user_id = $1", [req.user.id]);
        const username = user1.rows[0].user_name;
        if(username == "admin@admin.com"){
            res.json(username);
        } else{

            const user = await pool.query("SELECT * FROM tbl_customer a, tbl_profile b WHERE a.user_name = $1 AND b.cust_id = a.cust_id", [username]);
            const firstname = user.rows[0];
            res.json(firstname);
        }
        

    } catch (err) {

        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

router.post("/updateAccount", authorization, async (req, res) => {
    try {

        const { fn, mn, ln, phn, em} = req.body;
        const updateAcc = await pool.query("UPDATE tbl_customer SET f_name=$1, m_name=$2, l_name=$3, ph_no=$4 WHERE user_name=$5", [fn, mn, ln, phn, em]);
        
        if(!updateAcc){
            return res.status(401).json("Updation Failed");
        } else{

            const user = await pool.query("SELECT * FROM tbl_customer WHERE user_name = $1", [em]);
            const firstname = user.rows[0];
            console.log(firstname);
            res.json({firstname});
        }
        

    } catch (err) {

        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

router.get("/usersAdmin", async(req,res) => {
    try {
        // res.json(req.user);
        const user = await pool.query("SELECT * FROM tbl_customer a, tbl_profile b WHERE b.cust_id = a.cust_id");
        //const user = await pool.query("SELECT * FROM tbl_staff");
        //console.log(user.rows);
        res.json(user.rows);

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.post("/addPost", async (req, res) => {
    try{
        console.log(req.files);
        console.log(req.body);
        if (!req.files || Object.keys(req.files).length === 0) {
            //res.json("not uploaded");
            return res.status(401).json("Couldn't Add Post!");
        }
        else {
                console.log("abc");
                //1.Destructure the req.body
                let user_name = '';
                user_name = req.header("user_name");
                let imgFile = req.files.post_image;
                let uploadPath = "./images/"+imgFile.name;

                const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
                const cust_id = cust_id_raw.rows[0].cust_id;
                const { caption } = req.body;

                imgFile.mv(uploadPath, async function(err){
                    if(err){
                        return console.log(err);
                    }
                    else{
                        let addPost = await pool.query("INSERT INTO tbl_post(cust_id, post_image, post_caption, status)VALUES ($1, $2, $3, 'Active') RETURNING *",
                        [cust_id, imgFile.name, caption]);
                        if(!addPost) {
                            return res.status(401).json("Unable to add Post");
                        } else {
                            res.json({cust_id});
                        }
                    }
                })
                
        }
        
    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


router.post("/likePost", authorization, async (req, res) => {
    try {

        let user_name = '';
        user_name = req.header("user_name");
        const { post_id } = req.body;

        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id = cust_id_raw.rows[0].cust_id;

        const checkLike = await pool.query("SELECT * FROM tbl_like WHERE cust_id = $1 AND post_id = $2",[cust_id, post_id]);
        if(checkLike.rows[0]){
            return res.status(401).json("Already Liked Post");
        } else{
            
            const likePost = await pool.query("INSERT INTO tbl_like (cust_id, post_id ) VALUES ($1, $2)", [cust_id, post_id]);
            
            if(!likePost){
                return res.status(401).json("Failed to Like Post");
            } else{
                return res.json({post_id});
            }
        }


    } catch (err) {

        console.error(err.message);
        res.status(500).json("Server Error");
    }
})


router.post("/addComment", authorization, async (req, res) => {
    try {

        
        let user_name = '';
        let post_id = '';
        user_name = req.header("user_name");
        post_id = req.header("post_id");


        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id = cust_id_raw.rows[0].cust_id;
        const { comm } = req.body;

        
        const addComment = await pool.query("INSERT INTO tbl_comment (cust_id, post_id, comment_m ) VALUES ($1, $2, $3)", [cust_id, post_id, comm]);
        
            if(!addComment){
                return res.status(401).json("Failed to add Comment");
            } else{
                return res.json({post_id});
            }

    } catch (err) {

        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

router.post("/removeFriend",authorization , async(req,res) => {
    try {
        
        const { cust_id } = req.body;
        const user_name = req.header("user_name");
        const cust_id_fetch = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name = $1", [user_name]);
        const cust_id1 = cust_id_fetch.rows[0].cust_id;
        const cust_id2 = cust_id;
        

        const sendFriendRequest = await pool.query("UPDATE tbl_friends SET status = 'Removed' WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)", [cust_id1, cust_id2]);
        
        if(!sendFriendRequest) {
            return res.status(401).json("Unable to Remove Friend");
        } else {
            res.json({cust_id1});
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.post("/addProfilePic", async (req, res) => {
    try{
        console.log(req.files);
        console.log(req.body);

        let user_name = '';
        user_name = req.header("user_name");
        

        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id = cust_id_raw.rows[0].cust_id;
        const { bio } = req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
            if(bio === 'undefined') {
                return res.status(401).json("Couldn't Update!");
            } else {
                let addPost = await pool.query("UPDATE tbl_profile SET bio = $1 WHERE cust_id = $2 RETURNING *",
                        [bio, cust_id]);
                        if(addPost){
                            res.json({cust_id});
                        }
                        else {
                            return res.status(401).json("Couldn't Add Bio!");  
                        }
            }
        }
        else {

                //1.Destructure the req.body
                let imgFile = req.files.post_image;
                let uploadPath = "./images/"+imgFile.name;

                const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
                const cust_id = cust_id_raw.rows[0].cust_id;
                const { bio } = req.body;

                imgFile.mv(uploadPath, async function(err){
                    if(err){
                        return console.log(err);
                    }
                    else{
                        if(bio === 'undefined') {
                            let addDP = await pool.query("UPDATE tbl_profile SET profile_image = $1 WHERE cust_id = $2 RETURNING *",
                            [ imgFile.name, cust_id]);
                            if(!addDP) {
                                return res.status(401).json("Unable to Add Profile Pic");
                            } else {
                                res.json({cust_id});
                            }
                        } else {
                            let addPost = await pool.query("UPDATE tbl_profile SET bio = $1, profile_image = $2 RETURNING WHERE cust_id = $3*",
                        [bio, imgFile.name, cust_id]);
                        if(!addPost) {
                            return res.status(401).json("Unable to Update Profile");
                        } else {
                            res.json({cust_id});
                        }
                        }
                        
                    }
                })
                
        }
        
    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


router.post("/sendChat", async (req, res) => {
    try {

        
        let user_name = '';
        let receiver_id = '';
        user_name = req.header("user_name");
        receiver_id = req.header("receiver_id");


        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const sender_id = cust_id_raw.rows[0].cust_id;
        const { chat } = req.body;

        console.log(chat);
        const addChat = await pool.query("INSERT INTO tbl_chat (c_from, c_to, message ) VALUES ($1, $2, $3)", [sender_id, receiver_id, chat]);
        
            if(!addChat){
                return res.status(401).json("Failed to send Message");
            } else{
                return res.json({sender_id});
            }

    } catch (err) {

        console.error(err.message);
        res.status(500).json("Server Error");
    }
})


router.post("/deletePost",authorization , async(req,res) => {
    try {
        
        const { post_id } = req.body;
        const user_name = req.header("user_name");
        const cust_id_fetch = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name = $1", [user_name]);
        const cust_id1 = cust_id_fetch.rows[0].cust_id;
        

        const deleteP = await pool.query("UPDATE tbl_post SET status = 'Removed' WHERE (post_id = $1 AND cust_id = $2)", [post_id, cust_id1]);
        
        if(!deleteP) {
            return res.status(401).json("Unable to Remove Post");
        } else {
            res.json({cust_id1});
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});


module.exports = router;