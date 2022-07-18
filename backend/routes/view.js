const router = require("express").Router();
const pool =  require("../db");
const authorization = require("../middleware/authorization");

router.get("/suggFriend",authorization , async(req,res) => {
    try {
        // res.json(req.user);
        let user_name = '';
        user_name = req.header("user_name");
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id3 = cust_id_raw.rows[0].cust_id;

        const user = await pool.query("SELECT * FROM tbl_customer c WHERE c.cust_id NOT IN ( SELECT receiver_id FROM tbl_friends WHERE sender_id = $1 AND receiver_id = c.cust_id AND (status='Friends' OR status='Pending')) AND c.cust_id NOT IN ( SELECT sender_id FROM tbl_friends WHERE sender_id = c.cust_id AND receiver_id = $1 AND (status='Friends' OR status='Pending')) AND c.cust_id!=$1", [cust_id3]);
        res.json(user.rows);

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.post("/addFriend",authorization , async(req,res) => {
    try {
        
        const { cust_id } = req.body;
        const user_name = req.header("user_name");
        const cust_id_fetch = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name = $1", [user_name]);
        const cust_id1 = cust_id_fetch.rows[0].cust_id;
        const cust_id2 = cust_id;
        

        const sendFriendRequest = await pool.query("INSERT INTO tbl_friends (sender_id, receiver_id, status) VALUES ($1, $2, 'Pending')", [cust_id1, cust_id2]);
        
        if(!sendFriendRequest) {
            return res.status(401).json("Unable to send Friend Request");
        } else {
            res.json({cust_id1});
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/friendReqs",authorization , async(req,res) => {
    try {
        // res.json(req.user);
        let user_name = '';
        user_name = req.header("user_name");
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id3 = cust_id_raw.rows[0].cust_id;

        const user = await pool.query("SELECT * FROM tbl_customer a, tbl_profile b WHERE a.cust_id IN (SELECT sender_id FROM tbl_friends c WHERE c.receiver_id = $1 AND c.status='Pending') AND b.cust_id = a.cust_id", [cust_id3]);
        res.json(user.rows);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.post("/acceptFriend",authorization , async(req,res) => {
    try {
        
        const { cust_id } = req.body;
        const user_name = req.header("user_name");
        const cust_id_fetch = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name = $1", [user_name]);
        const cust_id1 = cust_id_fetch.rows[0].cust_id;
        const cust_id2 = cust_id;
        

        const acceptFriendRequest = await pool.query("UPDATE tbl_friends SET status = 'Friends' WHERE sender_id = $1 AND receiver_id = $2", [cust_id2, cust_id1]);
        
        if(!acceptFriendRequest) {
            return res.status(401).json("Unable to accept Friend Request");
        } else {
            res.json({cust_id1});
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/friends",authorization , async(req,res) => {
    try {
        // res.json(req.user);
        let user_name = '';
        user_name = req.header("user_name");
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id3 = cust_id_raw.rows[0].cust_id;

        const user = await pool.query("SELECT * FROM tbl_customer a, tbl_profile b WHERE (a.cust_id IN (SELECT sender_id FROM tbl_friends c WHERE c.receiver_id = $1 AND c.status='Friends') OR a.cust_id IN (SELECT receiver_id FROM tbl_friends c WHERE c.sender_id = $1 AND c.status='Friends')) AND b.cust_id = a.cust_id", [cust_id3]);
        res.json(user.rows);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/homePosts",authorization , async(req,res) => {
    try {
        // res.json(req.user);
        let user_name = '';
        user_name = req.header("user_name");
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id3 = cust_id_raw.rows[0].cust_id;

        const user = await pool.query("SELECT * FROM tbl_post a, tbl_profile b WHERE (a.cust_id IN (SELECT sender_id FROM tbl_friends c WHERE c.receiver_id = $1 AND c.status='Friends') OR a.cust_id IN (SELECT receiver_id FROM tbl_friends c WHERE c.sender_id = $1 AND c.status='Friends')) AND b.cust_id = a.cust_id AND a.status='Active'", [cust_id3]);
        res.json(user.rows);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/checkIfLiked",authorization , async(req,res) => {
    try {
        // res.json(req.user);
        let user_name = '';
        let post_id = '';
        user_name = req.header("user_name");
        post_id = req.header("post_id");
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id = cust_id_raw.rows[0].cust_id;

        const user = await pool.query("SELECT * FROM tbl_like WHERE cust_id = $1 AND post_id = $2", [cust_id, post_id]);
        if (user.rows[0]) {
            res.json({post_id});
        }
        
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/postComments",authorization , async(req,res) => {
    try {

        // res.json(req.user);

        let post_id = '';
        post_id = req.header("post_id");

        const user = await pool.query("SELECT * FROM tbl_comment a, tbl_profile b WHERE post_id = $1 AND b.cust_id = a.cust_id", [post_id]);
        console.log(post_id);
        res.json(user.rows);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});


router.get("/myPosts",authorization , async(req,res) => {
    try {
        // res.json(req.user);
        let user_name = '';
        user_name = req.header("user_name");
        console.log(user_name);
        
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id = cust_id_raw.rows[0].cust_id;

        const user = await pool.query("SELECT * FROM tbl_post WHERE cust_id = $1 AND status='Active'", [cust_id]);
        res.json(user.rows);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/adminPosts",authorization , async(req,res) => {
    try {
        // res.json(req.user);

        const user = await pool.query("SELECT * FROM tbl_post a, tbl_profile b WHERE a.status='Active' AND b.cust_id = a.cust_id AND a.status='Active'");
        res.json(user.rows);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/viewUserAdmin", authorization, async(req,res) => {
    try {


        let cust_id = '';
        cust_id = req.header("cust_id");
        // console.log(cust_id);

        // res.json(req.user);
        const user = await pool.query("SELECT * FROM tbl_customer a, tbl_profile b WHERE b.cust_id = a.cust_id AND a.cust_id = $1", [cust_id]);
  
        res.json(user.rows);

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/chatFriends",authorization , async(req,res) => {
    try {
        // res.json(req.user);
        let user_name = '';
        user_name = req.header("user_name");
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id3 = cust_id_raw.rows[0].cust_id;

        const user = await pool.query("SELECT * FROM tbl_customer a, tbl_profile b WHERE (a.cust_id IN (SELECT sender_id FROM tbl_friends c WHERE c.receiver_id = $1 AND c.status='Friends') OR a.cust_id IN (SELECT receiver_id FROM tbl_friends c WHERE c.sender_id = $1 AND c.status='Friends')) AND b.cust_id = a.cust_id", [cust_id3]);
        res.json(user.rows);
        
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/viewUserAdminPosts", authorization, async(req,res) => {
    try {


        let cust_id = '';
        cust_id = req.header("cust_id");
        // console.log(cust_id);

        // res.json(req.user);
        const posts = await pool.query("SELECT * FROM tbl_post a, tbl_profile b WHERE a.cust_id = $1 AND b.cust_id = a.cust_id", [cust_id]);
        res.json(posts.rows);

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/viewUser", authorization, async(req,res) => {
    try {


        let cust_id = '';
        cust_id = req.header("cust_id");
        // console.log(cust_id);

        // res.json(req.user);
        const user = await pool.query("SELECT * FROM tbl_customer a, tbl_profile b WHERE b.cust_id = a.cust_id AND a.cust_id = $1", [cust_id]);
        res.json(user.rows);
        console.log(user.rows);

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/viewUserPosts", authorization, async(req,res) => {
    try {


        let cust_id = '';
        cust_id = req.header("cust_id");
        // console.log(cust_id);

        // res.json(req.user);
        const posts = await pool.query("SELECT * FROM tbl_post a, tbl_profile b WHERE a.cust_id = $1 AND b.cust_id = a.cust_id", [cust_id]);
        res.json(posts.rows);

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/chatDetails", authorization, async(req,res) => {
    try {

        let cust_id = '';
        
        cust_id = req.header("cust_id");
        let user_name = '';
        user_name = req.header("user_name");
        const cust_id_raw = await pool.query("SELECT cust_id FROM tbl_customer WHERE user_name=$1",[user_name]);
        const cust_id1 = cust_id_raw.rows[0].cust_id;


        const chat = await pool.query("SELECT * FROM tbl_chat a, tbl_profile b WHERE ((a.c_from = $1 AND a.c_to = $2 AND b.cust_id = $1) OR (a.c_from = $2 AND a.c_to = $1 AND b.cust_id = $2))", [cust_id, cust_id1]);
        res.json(chat.rows);
        console.log(chat.rows[0]);

    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;