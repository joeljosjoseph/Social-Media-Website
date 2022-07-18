const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require('path')
const fileUpload = require('express-fileupload');


app.use(fileUpload());

//middleware
app.use(cors());
app.use(express.json());    //req.body

//register and login routes
app.use("/auth" , require("./routes/jwtAuth"))

//dashboard router

app.use("/dashboard", require("./routes/dashboard"));

//view router 

app.use("/view", require("./routes/view"));




app.listen(5000, () => {
    console.log("server has started on port 5000");
})

//item image static route
app.use('/images', express.static(path.join(__dirname, '/images')));