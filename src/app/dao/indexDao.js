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
  SELECT 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbQAAAG0CAYAAABaNNJGAAAAAXNSR0IArs4c6QAAHX1JREFUeAHt3Q1T28YWBmBD8wnT//87Ow2hJbS9OeTaCWCzli3Je84+mmFCkC3vPmfDG0nr9dXDw8N/GxsBAgQIEEgucJ28/ZpPgAABAgSeBASagUCAAAECJQQEWoky6gQBAgQICDRjgAABAgRKCAi0EmXUCQIECBAQaMYAAQIECJQQEGglyqgTBAgQICDQjAECBAgQKCEg0EqUUScIECBAQKAZAwQIECBQQkCglSijThAgQICAQDMGCBAgQKCEgEArUUadIECAAAGBZgwQIECAQAkBgVaijDpBgAABAgLNGCBAgACBEgICrUQZdYIAAQIEBJoxQIAAAQIlBARaiTLqBAECBAgINGOAAAECBEoICLQSZdQJAgQIEBBoxgABAgQIlBAQaCXKqBMECBAgINCMAQIECBAoISDQSpRRJwgQIEBAoBkDBAgQIFBCQKCVKKNOECBAgIBAMwYIECBAoISAQCtRRp0gQIAAAYFmDBAgQIBACQGBVqKMOkGAAAECAs0YIECAAIESAgKtRBl1ggABAgQEmjFAgAABAiUEBFqJMuoEAQIECAg0Y4AAAQIESggItBJl1AkCBAgQEGjGAAECBAiUEBBoJcqoEwQIECAg0IwBAgQIECghINBKlFEnCBAgQECgGQMECBAgUEJAoJUoo04QIECAgEAzBggQIECghIBAK1FGnSBAgAABgWYMECBAgEAJAYFWoow6QYAAAQICzRggQIAAgRICAq1EGXWCAAECBASaMUCAAAECJQQEWoky6gQBAgQICDRjgAABAgRKCAi0EmXUCQIECBAQaMYAAQIECJQQEGglyqgTBAgQICDQjAECBAgQKCEg0EqUUScIECBAQKAZAwQIECBQQkCglSijThAgQICAQDMGCBAgQKCEgEArUUadIECAAAGBZgwQIECAQAkBgVaijDpBgAABAgLNGCBAgACBEgICrUQZdYIAAQIEBJoxQIAAAQIlBARaiTLqBAECBAgINGOAAAECBEoICLQSZdQJAgQIEBBoxgABAgQIlBAQaCXKqBMECBAgINCMAQIECBAoISDQSpRRJwgQIEBAoBkDBAgQIFBCQKCVKKNOECBAgIBAMwYIECBAoISAQCtRRp0gQIAAAYFmDBAg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', CONCAT('상점', (SELECT LPAD(COUNT(*) + 1, 8, '0') FROM User)), ${kakaopkID}`;
  const [rows] = await connection.query(addUserQuery)
  connection.release();
  return rows;
}

// 메인 피드 - 제품사진, 제품명, 제품가격, 판매자 프로필 이미지, 판매자 이름, 등록 시간, 찜 수
async function mainFeed(userIndex) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mainFeedQuery = `SELECT p.postIndex, p.productName, p.price, pi.postImgURL, u.userName, u.profileImgURL,
    (CASE
        WHEN TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()), '분 전')
        WHEN TIMESTAMPDIFF(HOUR, p.createdAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.createdAt, NOW()), '시간 전')
        WHEN TIMESTAMPDIFF(DAY, p.createdAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, createdAt, NOW()), '일 전')
        WHEN TIMESTAMPDIFF(MONTH, p.createdAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, createdAt, NOW()), '달 전')
        ELSE CONCAT(TIMESTAMPDIFF(YEAR, createdAt, NOW()), '년 전')
    END) AS uploadDate,
    (SELECT COUNT(*) FROM Jjim j WHERE j.postIndex = p.postIndex) AS jjim
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
  connection.release();
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
  connection.release();
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
  connection.release();
  return rows;
}

// 세부 글 보기
async function seePost(userIndex, clickedJjim, clickedFollow, postIndex) {
  const connection = await pool.getConnection(async (conn) => conn);

  const updateWatchedQuery = `
  UPDATE Watched w
  SET w.watched = w.watched + 1
  WHERE w.watchedIndex = ${postIndex};
  `

  await connection.query(updateWatchedQuery);

  const seePostQuery = `
  SELECT p.postIndex, GROUP_CONCAT(pi.postImgURL) AS postImgURL, p.productName, p.price,
  (CASE
       WHEN TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.createdAt, NOW()), '분 전')
       WHEN TIMESTAMPDIFF(HOUR, p.createdAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.createdAt, NOW()), '시간 전')
       WHEN TIMESTAMPDIFF(DAY, p.createdAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, p.createdAt, NOW()), '일 전')
       WHEN TIMESTAMPDIFF(MONTH, p.createdAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, p.createdAt, NOW()), '달 전')
       ELSE CONCAT(TIMESTAMPDIFF(YEAR, p.createdAt, NOW()), '년 전')
   END) AS uploadDate,
  (SELECT w.watched FROM Watched w WHERE w.watchedIndex = ?) AS watched,
  (SELECT COUNT(*) FROM Jjim j WHERE j.postIndex = p.postIndex) AS jjim,
  (SELECT COUNT(*) FROM Jjim j WHERE j.postIndex = ? AND j.userIndex = ?) AS didJjim,
  p.productCondition, p.freeDelievery, p.canExchange, p.supplies, p.content, p.place, p.categoryIndex,
  (SELECT COUNT(*) FROM postQuestion pq WHERE pq.postIndex = p.postIndex) AS postQuestion,
  u.userIndex, u.userName, u.profileImgURL,
  (CONCAT('+', TIMESTAMPDIFF(DAY, u.createAt, NOW()))) AS userOpenDate,
  (SELECT COUNT(*) FROM Following f WHERE f.followIndex = u.userIndex) AS follower,
  (SELECT COUNT(*) FROM Following f WHERE f.userIndex = ? AND f.followIndex = (SELECT p2.userIndex FROM Post p2 WHERE p2.postIndex = ?)) AS didFollow,
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

  var params = [postIndex, postIndex, userIndex, userIndex, postIndex, postIndex, postIndex];
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

  // 찜 하기
  const didJjim = (JSON.parse(JSON.stringify(result)).postData)[0].didJjim;

  const addJjimQuery = `
  INSERT INTO Jjim (postIndex, userIndex)
  VALUES (?, ?);
  `
  const deleteJjimQuery = `
  DELETE FROM Jjim
  WHERE postIndex = ? AND userIndex = ?;
  `

  if (clickedJjim == 1) {
    var jjimParams = [postIndex, userIndex];
    if (didJjim == 0) {
      const [rows4] = await connection.query(
        addJjimQuery,
        jjimParams
      );
      console.log('찜합니다~');
    }
    else if (didJjim == 1) {
      const [rows4] = await connection.query(
        deleteJjimQuery,
        jjimParams
      );
      console.log('찜 풉니다~');
    } 
  }

  // 팔로우 하기
  const didFollow = (JSON.parse(JSON.stringify(result)).postData)[0].didFollow;
  const followIndex = (JSON.parse(JSON.stringify(result)).postData)[0].userIndex;

  const followQuery = `
  INSERT INTO Following (userIndex, followIndex)
  VALUES (?, ?);
  `
  const unfollowQuery = `
  DELETE FROM Following
  WHERE userIndex = ? AND followIndex = ?;
  `

  if (clickedFollow == 1) {
    var followParams = [userIndex, followIndex];
    if (didFollow == 0) {
      const [rows5] = await connection.query(
        followQuery,
        followParams
      );
      console.log('팔로합니다~');
    }
    else if (didFollow == 1) {
      const [rows5] = await connection.query(
        unfollowQuery,
        followParams
      );
      console.log('언팔합니다~');
    }
  }
  connection.release();
  return result;
}

// 유저 지역 불러오기
async function getPlace(userIndex) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getPlaceQuery = `
  SELECT u.place FROM User u
  WHERE u.userIndex = ${userIndex};
  `
  const [rows] = await connection.query(getPlaceQuery);
  connection.release();
  return rows;
}

// 글 등록하기
async function addPost(data) {
  
  const connection = await pool.getConnection(async (conn) => conn);

  const totalTags = data.tags.length;

  // 게시글 등록
  const addPostQuery = `
  INSERT INTO Post (userIndex, productName, categoryIndex, price, changePrice, freeDelievery, place, onlyMyPlace, content, supplies, productCondition, canExchange)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `
  var params = [data.userIndex, data.productName, data.categoryIndex, data.price, data.changePrice, data.freeDelievery, data.place, data.onlyMyPlace, data.content, data.supplies, data.productCondition, data.canExchange];

  const [rows] = await connection.query(
    addPostQuery,
    params
  );

  const getPostIndexQuery = `
  SELECT MAX(postIndex) AS postIndex FROM Post;
  `
  const [index] = await connection.query(getPostIndexQuery);
  const postIndex = JSON.parse(JSON.stringify(index))[0].postIndex
  console.log('postIndex >>', postIndex);

  // 게시글 이미지 등록 (최대 12장)
  const addImgQuery = `
  
  `

  // 게시글 태그 등록 (최대 5개)
  const addTagQuery = `
  INSERT INTO postTag (postIndex, tag)
  VALUES (?, ?);
  `
  let value = 0;
  while (value < totalTags) {
    var params2 = [postIndex, data.tags[value]];
    const [rows2] = await connection.query(
      addTagQuery,
      params3
    );
    console.log(params2);
    value++;
  }
  connection.release();
  return rows;
}

module.exports = {
  duplicateCheck,
  addUser,
  mainFeed,
  seeCategoryPost,
  seeSubCategoryPost,
  seeSubsubCategoryPost,
  seePost,
  getPlace,
  //addPost
};
