module.exports = function(app){
    console.log('indexRouter.js 실행 중');
    
    const index = require('../controllers/indexController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 테스트 API
    app.get("/test", index.default);

    // 회원가입 (카카오 로그인)
    app.get("/join", index.join);
    
};
