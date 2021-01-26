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
    const accessToken = req.body;
    console.log('콘솔 >>', accessToken);
    return res.json(accessToken);
};