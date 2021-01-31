module.exports = function(app){
    console.log('indexRouter.js 실행 중');
    
    const index = require('../controllers/indexController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 테스트 API
    app.get('/test', index.default);

    // Access Token 전송
    app.post('/valid-token', index.valid);
    
    // Access Token 유효성 검사
    app.get('/valid-token', index.valid);

    // 메인 피드
    app.post('/', jwtMiddleware, index.main);
    //app.get('/', jwtMiddleware, index.main);

    // 특정 카테고리
    app.get('/:categoryIndex', jwtMiddleware, index.main);

    // 특정 카테고리 - 서브 카테고리
    app.get('/:categoryIndex/:subcategoryIndex', jwtMiddleware, index.main);

    // 특정 카테고리 - 서브 카테고리 - 서브서브 카테고리
    app.get('/:categoryIndex/:subcategoryIndex/:subsubcategoryIndex', jwtMiddleware, index.main);
    
};
