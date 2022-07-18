const pool = require("../db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//registering

router.post("/register",validInfo, async(req,res) => {
    try{

        //1 destructure req.body

        const {email, username, password, firstname , middlename, lastname, phone} = req.body;

        //2.Check if user exists

        const user = await pool.query("SELECT * FROM tbl_login where user_name = $1", [email]);

        // res.json(user.rows);
        if(user.rows.length !== 0){
            return res.status(401).json("User already exists!");
        }
        
        const profile = await pool.query("SELECT * FROM tbl_profile where username = $1", [username]);


        //3. Bcrypt the password

        // const saltRound = 10;
        // const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, 10);

        //4. Enter the new user into the database
        
        let newUser = await pool.query("INSERT INTO tbl_login (user_name, user_type, user_password, user_status) VALUES ($1, 'Customer' , $2, 'Active') RETURNING *",[email, bcryptPassword]);
        let newCust = await pool.query("INSERT INTO tbl_customer (user_name, f_name, m_name, l_name, ph_no) VALUES ($1, $2, $3, $4, $5)", [email, firstname, middlename, lastname, phone]);

        let user1 = await pool.query("SELECT * FROM tbl_customer WHERE user_name = $1", [email]);
        const cust_id = user1.rows[0].cust_id;
        
        let user2 = await pool.query("SELECT * FROM tbl_login WHERE user_name = $1", [email]);
        let newProfile = await pool.query("INSERT INTO tbl_profile(cust_id ,username) VALUES ($1, $2)", [cust_id, username])

        //5. Generate JWT tokens

        const user_type = "Customer";
        const token = jwtGenerator(newUser.rows[0].user_id);
        const user_id = user2.rows[0].user_id;
        const user_name = email;
        res.json({ token, user_id, user_name,user_type });
        
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

//login route

router.post("/login" ,validInfo , async (req, res) => {
    try{

        //1.Destructure the req.body

        const { email, password } = req.body;

        //2.Check if the user doesn't exist (if not we throw error)

        const user = await pool.query("SELECT * FROM tbl_login WHERE user_name = $1" , [
            email
        ]);

        if(user.rows.length === 0 ){
            return res.status(401).json("Password or Email in incorrect");
        }

        //3. check if the incoming password is the same as the database password

            const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
           
            if(!validPassword) {
                return res.status(401).json("Password Incorrect");
            }
        
        //4. give them the jwt token
        const token = jwtGenerator(user.rows[0].user_id);
        const user_id = user.rows[0].user_id;
        const user_name = email;
        const user_type = user.rows[0].user_type;
        res.json({ token, user_id, user_name, user_type });
    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

//verify router

router.get("/is-verify", authorization , async (req, res) => {
    try {

        res.json(true);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;