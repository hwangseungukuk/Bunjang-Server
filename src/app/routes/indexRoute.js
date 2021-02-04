module.exports = function(app){
    console.log('indexRouter.js 실행 중');
    
    const index = require('../controllers/indexController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // Access Token 전송
    app.post('/valid-token', index.valid);
    
    // Access Token 유효성 검사
    app.get('/valid-token', index.valid);

    // 메인 피드
    app.post('/', jwtMiddleware, index.main);
    app.get('/', jwtMiddleware, index.main);

    // 특정 카테고리 글 보기
    app.get('/category/:categoryIndex', jwtMiddleware, index.seeCategoryPost);
    app.post('/category/:categoryIndex', jwtMiddleware, index.seeCategoryPost);
    
    // 특정 서브 카테고리 글 보기
    app.get('/subCategory/:subCategoryIndex', jwtMiddleware, index.seeSubCategoryPost);
    app.post('/subCategory/:subCategoryIndex', jwtMiddleware, index.seeSubCategoryPost);

    // 특정 서브서브 카테고리 글 보기
    app.get('/subsubCategory/:subsubCategoryIndex', jwtMiddleware, index.seeSubsubCategoryPost);
    app.post('/subsubCategory/:subsubCategoryIndex', jwtMiddleware, index.seeSubsubCategoryPost);

    // 세부 글 보기
    app.get('/post/:postIndex', jwtMiddleware, index.seePost);
    app.post('/post/:postIndex', jwtMiddleware, index.seePost);
    
    // 게시글 찜하기
    app.post('/jjim', jwtMiddleware, index.doJjim);

    // 유저 팔로우하기
    app.post('/follow', jwtMiddleware, index.doFollow);

    // 글 작성하기
    app.get('/post', jwtMiddleware, index.getPlace); // 위치 불러오기
    app.post('/post', jwtMiddleware, index.addPost); // 글 작성하기

    


};
