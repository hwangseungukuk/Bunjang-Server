const { pool } = require("../../../config/database");

// index
async function defaultDao() {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserQuery = `SELECT * FROM User`;
  //SELECT * FROM places

  const [rows] = await connection.query(selectUserQuery)
  connection.release();

  return rows;
}

module.exports = {
  defaultDao,
};
