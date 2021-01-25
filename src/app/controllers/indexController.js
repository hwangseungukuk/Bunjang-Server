const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const indexDao = require('../dao/indexDao');

exports.default = async function (req, res) {
    try {
        const connection = await pool.getConnection(async conn => conn);
        console.log('DB 연결 성공');
        try {
            const [rows] = await indexDao.defaultDao();
            console.log('쿼리 실행 성공');
            return res.json(rows);
        } catch (err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`여기서 에러 발생 example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};