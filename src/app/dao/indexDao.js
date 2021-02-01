const { pool } = require("../../../config/database");

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
  return rows;
}

// 메인 피드 - 제품사진, 제품명, 제품가격, 판매자 프로필 이미지, 판매자 이름, 등록 시간
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

// 특정 카테고리 글 보기 - 제품사진, 제품명, 제품가격
async function seeCategoryPost(userIndex, categoryIndex) {
  const connection = await pool.getConnection(async (conn) => conn);
  const see1Query = `
    SELECT p.postIndex, p.productName, p.price, pi.postImgURL
    FROM Post p LEFT JOIN User u ON p.userIndex = u.userIndex
    LEFT JOIN postImg pi ON pi.postIndex = p.postIndex AND pi.isFirst = 1
    WHERE ((p.onlyMyPlace = 0 OR (p.onlyMyPlace = 1 AND p.place = (SELECT u1.place FROM User u1 WHERE u1.userIndex = ?))) AND ((p.categoryIndex - 1) DIV 4) + 1 = ?);
  `;
  
  var params = [userIndex, categoryIndex];

  const [rows] = await connection.query(
    see1Query,
    params
  );

  console.log('params >>', params);
  return rows;
}

// 특정 서브 카테고리 글 보기 - 제품사진, 제품명, 제품가격
async function seeSubCategoryPost(userIndex, subCategoryIndex) {
  const connection = await pool.getConnection(async (conn) => conn);
  const see2Query = `
    SELECT p.postIndex, p.productName, p.price, pi.postImgURL
    FROM Post p LEFT JOIN User u ON p.userIndex = u.userIndex
    LEFT JOIN postImg pi ON pi.postIndex = p.postIndex AND pi.isFirst = 1
    WHERE ((p.onlyMyPlace = 0 OR (p.onlyMyPlace = 1 AND p.place = (SELECT u1.place FROM User u1 WHERE u1.userIndex = ?))) AND ((p.categoryIndex - 1) DIV 2) + 1 = ?);
  `;
  
  var params = [userIndex, subCategoryIndex];

  const [rows] = await connection.query(
    see2Query,
    params
  );
  
  console.log('params >>', params);
  return rows;
}


// 특정 서브서브 카테고리 글 보기 - 제품사진, 제품명, 제품가격
async function seeSubsubCategoryPost(userIndex, subsubCategoryIndex) {
  const connection = await pool.getConnection(async (conn) => conn);
  const see3Query = `
    SELECT p.postIndex, p.productName, p.price, pi.postImgURL
    FROM Post p LEFT JOIN User u ON p.userIndex = u.userIndex
    LEFT JOIN postImg pi ON pi.postIndex = p.postIndex AND pi.isFirst = 1
    WHERE ((p.onlyMyPlace = 0 OR (p.onlyMyPlace = 1 AND p.place = (SELECT u1.place FROM User u1 WHERE u1.userIndex = ?))) AND (p.categoryIndex = ?));
  `;
  
  var params = [userIndex, subsubCategoryIndex];

  const [rows] = await connection.query(
    see3Query,
    params
  );
  
  console.log('params >>', params);
  return rows;
}

// 세부 글 보기
async function seePost(postIndex) {
  const connection = await pool.getConnection(async (conn) => conn);

  const updateWatched = `
  UPDATE Watched w
  SET w.watched = w.watched + 1
  WHERE w.postIndex = ${postIndex};
  `

  await connection.query(updateWatched);

  const seePostQuery = `
  SELECT p.postIndex, GROUP_CONCAT(pi.postImgURL) AS postImgURL, p.productName, p.price,
  (CASE
       WHEN TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()), '분 전')
       WHEN TIMESTAMPDIFF(HOUR, p.createdAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.createdAt, NOW()), '시간 전')
       WHEN TIMESTAMPDIFF(DAY, p.createdAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, p.createdAt, NOW()), '일 전')
       WHEN TIMESTAMPDIFF(MONTH, p.createdAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, p.createdAt, NOW()), '달 전')
       ELSE CONCAT(TIMESTAMPDIFF(YEAR, p.createdAt, NOW()), '년 전')
   END) AS uploadDate,
  (SELECT w.watched FROM Watched w WHERE w.postIndex = ?) AS watched,
  (SELECT COUNT(*) FROM Jjim j WHERE j.postIndex = p.postIndex) AS jjim,
  p.productCondition, p.freeDelievery, p.content, p.place, p.categoryIndex,
  (SELECT COUNT(*) FROM postQuestion pq WHERE pq.postIndex = p.postIndex) AS postQuestion,
  u.userIndex, u.userName, u.profileImgURL,
  (CONCAT('+', TIMESTAMPDIFF(DAY, u.createAt, NOW()))) AS userOpenDate,
  (SELECT COUNT(*) FROM Following f WHERE f.followIndex = u.userIndex) AS follower,
  (SELECT COUNT(*) FROM Post p1 WHERE p1.userIndex = (SELECT p.userIndex FROM Post p WHERE p.postIndex = ?)) AS totalPost,
  (SELECT COUNT(*) FROM Review r WHERE r.userIndex = p.userIndex) AS totalReview,
  (SELECT SUM(r.star)/COUNT(*) FROM Review r WHERE r.userIndex = p.userIndex) AS averageStar
  FROM Post p LEFT JOIN User u ON p.userIndex = u.userIndex
  LEFT JOIN postImg pi ON pi.postIndex = p.postIndex
  WHERE p.postIndex = ?;
  `;

  const seeOtherPostQuery = `
  SELECT p1.postIndex,
       (SELECT pi.postImgURL FROM postImg pi WHERE pi.isFirst = 1 AND p1.postIndex = pi.postIndex) AS postImg,
       p1.price
  FROM Post p1 WHERE p1.userIndex = (SELECT p.userIndex FROM Post p WHERE p.postIndex = ?) AND p1.postIndex != ?
  ORDER BY p1.createdAt DESC LIMIT 3;
  `

  const seeReviewQuery = `
  SELECT r.reviewerIndex,
       (SELECT u.profileImgURL FROM User u WHERE u.userIndex = r.reviewerIndex) AS reviewerProfileImg,
       r.content, r.star,
       (CASE
            WHEN TIMESTAMPDIFF(MINUTE, r.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, r.createdAt, NOW()), '분 전')
            WHEN TIMESTAMPDIFF(HOUR, r.createdAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, r.createdAt, NOW()), '시간 전')
            WHEN TIMESTAMPDIFF(DAY, r.createdAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, r.createdAt, NOW()), '일 전')
            WHEN TIMESTAMPDIFF(MONTH, r.createdAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, r.createdAt, NOW()), '달 전')
            ELSE CONCAT(TIMESTAMPDIFF(YEAR, r.createdAt, NOW()), '년 전')
        END) AS createdAt
  FROM Review r INNER JOIN Post p ON r.userIndex = p.userIndex WHERE p.postIndex = ${postIndex}
  ORDER BY r.createdAt DESC LIMIT 2;
  `;

  var params = [postIndex, postIndex, postIndex];
  var params2 = [postIndex, postIndex];

  const [rows] = await connection.query(
    seePostQuery,
    params
  );

  const [rows2] = await connection.query(
    seeOtherPostQuery,
    params2
  );

  const [rows3] = await connection.query(seeReviewQuery)

  const result = {
    postData: rows,
    otherPost: rows2,
    review: rows3
  };

  return result;
}



module.exports = {
  duplicateCheck,
  addUser,
  mainFeed,
  seeCategoryPost,
  seeSubCategoryPost,
  seeSubsubCategoryPost,
  seePost
};
