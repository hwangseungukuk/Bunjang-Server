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
  const countpkIDQuery = `SELECT COUNT(*) AS isDuplicated, userIndex, userName FROM User WHERE kakaopkID = ${kakaopkID}`;
  const [rows] = await connection.query(countpkIDQuery)
  connection.release();
  return rows;
}

// 사용자 등록
async function addUser(kakaopkID) {
  const connection = await pool.getConnection(async (conn) => conn);
  const addUserQuery = `INSERT INTO User (profileImgURL, userName, kakaopkID)
  SELECT 'default.png', CONCAT('상점', (SELECT LPAD(COUNT(*) + 1, 8, '0') FROM User)), ${kakaopkID}`;
  const [rows] = await connection.query(addUserQuery)
  connection.release();
  //return rows.insertId;
  return rows;
}

// 메인 피드 - 제품사진, 제품명, 제품가격, 판매자 프로필 이미지, 판매지 이름, 등록 시간
async function mainFeed(userIndex) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mainFeedQuery = `SELECT p.postIndex, p.productName, p.price, pi.postImgURL, u.userName, u.profileImgURL,
    (CASE
        WHEN TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()), '분 전')
        WHEN TIMESTAMPDIFF(HOUR, p.createdAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.createdAt, NOW()), '시간 전')
        WHEN TIMESTAMPDIFF(DAY, p.createdAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, createdAt, NOW()), '일 전')
        WHEN TIMESTAMPDIFF(MONTH, p.createdAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, createdAt, NOW()), '달 전')
        ELSE CONCAT(TIMESTAMPDIFF(YEAR, createdAt, NOW()), '년 전')
    END) AS uploadDate
  FROM Post p LEFT JOIN User u ON p.userIndex = u.userIndex
  LEFT JOIN postImg pi ON pi.postIndex = p.postIndex AND pi.isFirst = 1
  WHERE (p.onlyMyPlace = 0 OR (p.onlyMyPlace = 1 AND p.place = (SELECT u1.place FROM User u1 WHERE u1.userIndex = ${userIndex})));`;

  const [rows] = await connection.query(mainFeedQuery);
  connection.release();
  return rows;
}


// async function getIIIIII(userIndex) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const countpkIDQuery = `SELECT userName FROM User WHERE userIndex = ${userIndex}`;
//   const [rows] = await connection.query(countpkIDQuery)
//   connection.release();
//   return rows;
// }


module.exports = {
  defaultDao,
  duplicateCheck,
  addUser,
  mainFeed
};
