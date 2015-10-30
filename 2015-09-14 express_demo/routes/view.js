/**
 * Created by v_songxiaodan on 2015/10/27.
 */
var express = require('express');
var router = express.Router();
var db =  require('../db');
var moment = require('moment');


router.param('article_id', function (req, res, next, id) {
    db.findArticleById(id, function (err, article) {
        if (err) {
            next(err);
        } else {
            if (article) {
                db.incrArticleReadNum(id, function (err, count) {
                    if (err) {
                        next(err);
                    } else {
                        article.read_cnt = count;
                        article.post_time = moment(article.post_time).format('YYYY-MM-DD HH:mm:ss')
                        res.locals.article = article;
                        res.locals.path = '/view';
                        next();
                    }
                })
            } else {
                res.send(404);
            }
        }
    })
});

router.get('/:article_id', function (req, res, next) {
    res.session.get('username', function (err, username) {
        if (err) {
            next(err);
        } else {
            res.locals.user = {username: username};
            res.render('article/view');
        }
    })
});

router.get('/page/:page', function (req, res, next) {
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
            var pageNo = req.params.page * 1;
            var curPage = isNaN(pageNo) ? 1 : pageNo;
            db.findArticlesByPage(curPage, 5, function (err, result) {
                if (err) {
                    next(err);
                } else {
                    for (var i = 0; i < result.articles.length; i++) {
                        result.articles[i].post_time = moment(result.articles[i].post_time).format('YYYY-MM-DD HH:mm:ss')
                    }

                    locals.articles = result.articles;
                    locals.articles.totalCount = result.totalCount;
                    locals.totalPage = result.totalPage;
                    locals.curPage = curPage;
                    res.render('index', locals);
                    //res.render('index');
                }
            });
        }
    });
});

module.exports = router;
