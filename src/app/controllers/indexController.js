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
    //const accessToken = "O8GcAibhEbq3rt_pVO58572kZZ4zWi-v1Gbv3Qopb1UAAAF3Q3Sr5Q";

    console.log('토큰 >>', accessToken);
    //return res.json(accessToken);

    request.get({
        url: "https://kapi.kakao.com/v1/user/access_token_info",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }, async (res, body) => {
        try {
            console.log('유효성 결과 >>', JSON.parse(body.body));
            //res.send(body.body);
            request.get({
                url: "https://kapi.kakao.com/v2/user/me",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }, async (res, body) => {
                try {
                    console.log('사용자 정보 결과 >>', JSON.parse(body.body));
                    //res.send(body.body);
                } catch (err) {
                    console.log('사용자 정보 에러 >>', err);
                }
            });
        } catch (err) {
            console.log('유효성 에러 >>', err);
        }
    })

    // 사용자 중복 검사 (쿼리 사용)

    // 사용자 등록
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
            //return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        //return false;
    }


    res.json({"isSuccess":true, "code":100, "message":"성공"});

};

exports.login = async function (req, res) {

    

};