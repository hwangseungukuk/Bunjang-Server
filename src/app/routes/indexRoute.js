module.exports = function(app){
    console.log('indexRouter.js 실행 중');
    
    const index = require('../controllers/indexController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 테스트 API
    app.get("/test", index.default);

    // Access Token 유효성 검사
    app.get("/valid-token", index.valid);
    app.post('/valid-token', index.valid);
    
};
