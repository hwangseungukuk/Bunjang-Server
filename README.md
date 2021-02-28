# 2021 번개장터 Clone Coding
<img src="../master/Img/01_카카오로그인_1.png" height="300"> <img src="../master/Img/03_메인피드_1.png" height="300"> <img src="../master/Img/04_카테고리.png" height="300">

<h3> ⚙ Tools/Environment </h3>
- Linux <br>
- Ubuntu 18.04.5 <br>
- Nginx 1.14.0 <br>
- Node 14.15.3 <br>
- Express 4.17.1 <br>
- MySQL 8.0.20 <br>
- AWS EC2, RDS, Route53 <br>
- Visual Studio Code <br>
- Datagrip <br>
- Postman

<br>
<h3>📅 Period</h3>
2021/01/25 ~ 2021/02/07
<br><br>
<h3>🗂 SQL Database</h3>
<img src="../master/SQL/bunjang.png" width="70%" height="70%">
<br>
<h3>📎 REST API</h3>

| Index | Method | URI | Description |
|:-:|:-:|:-|:-|
|1|POST|/valid-token|Access Token을 통한 유효성 검사 및 카카오 로그인(회원가입)|
|2|GET|/|유저 기반 메인 피드 보기|
|3|GET|/category/:categoryIndex|특정 카테고리 글 보기|
|4|GET|/subCategory/:subCategoryIndex|특정 서브 카테고리 글 보기|
|5|GET|/subsubCategory/:subsubCategoryIndex|특정 서브서브 카테고리 글 보기|
|6|GET|/post/:postIndex|세부 글 보기|
|7|POST|/jjim|게시글 찜/찜 해제 하기|
|8|POST|/follow|게시글 작성자 팔로우/언팔로우 하기|
|9|GET|/post|게시글 작성 전 유저 지역 불러오기|
|10|POST|/post|게시글 작성하기|
|11|GET|/follow-list|팔로잉 (내피드/팔로잉/추천) 항목 보기|
|12|GET|/jjim-list?sort=0|찜 목록 보기|

<br>
<h3> 📼 Explanation </h3>

[![2021 Clone Coding 번개장터팀 Server](http://img.youtube.com/vi/Lp-J59ACagA/0.jpg)](https://youtu.be/Lp-J59ACagA) <br>
https://www.youtube.com/watch?v=Lp-J59ACagA
