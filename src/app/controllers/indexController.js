const request = require('request');

const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const indexDao = require('../dao/indexDao');

console.log('indexController.js 실행 중');

exports.default = async function (req, res) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await indexDao.defaultDao();
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

exports.valid = async function (req, res) {

    const accessToken = req.body.accessToken;

    //accessToken 값 확인
    console.log('토큰 >>', accessToken);

    //이미 가입한 회원인지
    let isDuplicated = 0;

    //accessToken 유효성 검사
    request.get({
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
                                await indexDao.addUser(kakaopkID); // 유저 데이터 추가
                            }
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
    
    if (isDuplicated == 1 && kakaopkID != null) {
        res.json({"isSuccess":true, "code":100, "message":"사용자 중복 X"});
    } else if (isDuplicated == 0 && kakaopkID != null) {
        res.json({"isSuccess":true, "code":101, "message":"사용자 중복 O"});
    } else {
        res.json({"isSuccess":false, "code":201, "message":"토큰 유효성 검증 실패"});
    }

};

exports.login = async function (req, res) {

    

};