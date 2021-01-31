const request = require('request');

const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const secret_config = require('../../../config/secret');

const indexDao = require('../dao/indexDao');

console.log('indexController.js 실행 중');

exports.valid = async function (req, res) {
    const accessToken = req.body.accessToken;

    //accessToken 값 확인
    console.log('토큰 >>', accessToken);

    //이미 가입한 회원인지
    let isDuplicated = 0;

    // 유저 인덱스
    let userIndex;
    let userName;

    const promise = new Promise((resolve, reject) => {

        const kakao = request.get({
            url: "https://kapi.kakao.com/v1/user/access_token_info",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }, async (res, body) => {
            try {
                console.log('유효성 결과 >>', JSON.parse(body.body));
    
                //사용자 정보 조회
                request.get({
                    url: "https://kapi.kakao.com/v2/user/me",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }, async (res, body) => {
                    try {
                        const kakaopkID = JSON.parse(body.body).id;
    
                        console.log('카카오 PK ID >>', kakaopkID);
                        console.log('사용자 정보 결과 >>', JSON.parse(body.body));
                        
                        try {
                            const connection = await pool.getConnection(async conn => conn);
                            try {
                                const [rows] = await indexDao.duplicateCheck(kakaopkID);
                                isDuplicated = rows.isDuplicated;
                                console.log('중복 검사 결과 >>', isDuplicated);
                                if (isDuplicated == 0) {
                                    // 유저 데이터 추가하고 userIndex 불러오기
                                    const rows = await indexDao.addUser(kakaopkID);
                                    console.log('유저 인덱스 >>', rows);
                                    userIndex = rows.insertId;
                                    console.log('데이터 추가>>', userIndex);
                                }
                                else if (isDuplicated == 1) {
                                    // userIndex 불러오기
                                    userIndex = rows.userIndex;
                                    console.log('유저 인덱스 >>', userIndex);
                                }

                                //userName 생성
                                let makeName = String(userIndex);
                                userName = makeName.length >= 8 ? makeName:new Array(8-makeName.padEnd.length+1).join('0')+makeName;
                                userName = '상점' + userName;

                                const userData = {
                                    userIndex: userIndex,
                                    isDuplicated: isDuplicated,
                                    userName: userName
                                };
                                resolve(userData); 

                            } catch (err) {
                                console.log(err);
                                connection.release();
                                return false;
                            }
    
                        } catch (err) {
                            console.log(err);
                            return false;
                        }
                    } catch (err) {
                        console.log('사용자 정보 에러 >>', err);
                        return false;
                    }
                });
            } catch (err) {
                console.log('유효성 에러 >>', err);
                return false;
            } 
        });
    });
    
    promise.then((value) => {
        userIndex = value.userIndex;
        isDuplicated = value.isDuplicated;
        userName = value.userName;
        console.log('결과 >>', userIndex, isDuplicated, userName);
        
        let token = jwt.sign({
            id: userIndex
        },

        secret_config.jwtsecret,
        {
            expiresIn: '365d',
            subject: 'userIndex',
        });

        if (isDuplicated == 1) {
            res.json({
                jwt: token,
                userName: userName,
                isSuccess:true,
                code:100,
                message:"사용자 중복 O"
            });
        } else if (isDuplicated == 0) {
            res.json({
                jwt: token,
                userName: userName,
                isSucces:true,
                code:101,
                message:"사용자 중복 X"
            });
        } else {
            res.json({
                isSuccess:false,
                code:201,
                message:"토큰 유효성 검증 실패"
            });
        }
    });
};

exports.main = async function (req, res) {
    const userIndex = req.verifiedToken.id;
    // 게시글 최신순으로 불러오기
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const rows = await indexDao.mainFeed(userIndex);
            console.log('rows >>', rows);
            return res.json(rows);
        } catch (err) {
            console.log(err);
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

exports.see1 = async function (req, res) {
    const userIndex = req.verifiedToken.id;
    const categoryIndex = req.params.categoryIndex;

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const rows = await indexDao.see1(userIndex, categoryIndex);
            console.log('rows >>', rows);
            return res.json(rows);
        } catch (err) {
            console.log(err);
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
}

exports.see2 = async function (req, res) {
    const userIndex = req.verifiedToken.id;
    const subCategoryIndex = req.params.subCategoryIndex;

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const rows = await indexDao.see2(userIndex, subCategoryIndex);
            console.log('rows >>', rows);
            return res.json(rows);
        } catch (err) {
            console.log(err);
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
}

exports.see3 = async function (req, res) {
    const userIndex = req.verifiedToken.id;
    const subsubCategoryIndex = req.params.subsubCategoryIndex;

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const rows = await indexDao.see3(userIndex, subsubCategoryIndex);
            console.log('rows >>', rows);
            return res.json(rows);
        } catch (err) {
            console.log(err);
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
}

exports.post = async function (req, res) {
    const userIndex = req.verifiedToken.id;
    const postIndex = req.params.postIndex;

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const rows = await indexDao.seePost(userIndex, postIndex);
            console.log('rows >>', rows);
            return res.json(rows);
        } catch (err) {
            console.log(err);
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
}