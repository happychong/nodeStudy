var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
    var locals = {
        path: req.url,
        title: '首页'
    };
    res.session.get('username', function (err, value) {
        if (err) {
            next(err);
        } else {
            if (value) {
                locals.user = {username: value};
            } else {
                locals.user = {};
            }
            db.findArticlesByPage(1, 5, function (err, result) {
                if (err) {
                    next(err);
                } else {
                    for (var i = 0; i < result.articles.length; i++) {
                        result.articles[i].post_time = moment(result.articles[i].post_time).format('YYYY-MM-DD HH:mm:ss')
                    }
                    locals.curPage = 1;
                    locals.articles = result.articles;
                    locals.articles.totalCount = result.totalCount;
                    locals.totalPage = result.totalPage;
                    res.render('index', locals);
                    //res.render('index');
                }
            });
        }
    });
});

module.exports = router;
