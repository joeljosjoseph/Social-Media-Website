const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {

  // Get token from header
  const token = req.header("token");

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token
    try{


        const payload = jwt.verify(token, process.env.jwtSecret);
        req.user = payload.user;
        next();
        

    } catch (err) {
        console.error(err.message);
        return res.status(401).json("Not Authorized ");
    }
}