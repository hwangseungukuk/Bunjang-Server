const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');

var cors = require('cors');

module.exports = function () {

    console.log('express.js 실행 중');

    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    require('../src/app/routes/indexRoute')(app);
    require('../src/app/routes/userRoute')(app);

    return app;
};