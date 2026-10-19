const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "0107",
  port: 5432,
});

module.exports = pool;
