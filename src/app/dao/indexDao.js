const { pool } = require("../../../config/database");

// index (예시)
async function defaultDao() {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserQuery = `SELECT * FROM User`;

  const [rows] = await connection.query(selectUserQuery)
  connection.release();
  return rows;
}

// 사용자 중복 검사
async function duplicateCheck(kakaopkID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const countpkID = `SELECT COUNT(*) AS isDuplicated FROM User WHERE kakaopkID = ${kakaopkID}`;
  const [rows] = await connection.query(countpkID)
  connection.release();
  return rows;
}

// 사용자 등록
async function addUser(kakaopkID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const addUserDB = `INSERT INTO User (profileImgURL, userName, kakaopkID)
  SELECT 'default.png', CONCAT('상점', (SELECT LPAD(COUNT(*) + 1, 8, '0') FROM User)), ${kakaopkID}`;
  const [rows] = await connection.query(addUserDB)
  connection.release();
  return rows;
}

module.exports = {
  defaultDao,
  duplicateCheck,
  addUser
};
