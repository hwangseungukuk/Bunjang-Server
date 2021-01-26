const { pool } = require("../../../config/database");

// index (예시)
async function defaultDao() {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserQuery = `SELECT * FROM User`;

  const [rows] = await connection.query(selectUserQuery)
  connection.release();
  return rows;
}

module.exports = {
  defaultDao,
};
