const Pool = require('pg').Pool;
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "123",
    database: "socialMedia"
})

module.exports = pool;
