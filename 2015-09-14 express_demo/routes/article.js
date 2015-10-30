/**
 * Created by v_songxiaodan on 2015/10/26.
 */
var express = require('express');
var router = express.Router();
var db =  require('../db');
var moment = require('moment');

// 发布文章页面
router.get('/post', function (req, res, next) {
    var locals = {
        path: req.url,
        title: '首页'
    };
    res.session.get('username', function (err, username) {
        if (err) {
            next(err);
        } else {
            res.session.get('userId', function (err, userId) {
                if (err) {
                    next(err);
                } else if (username && userId) {
                    locals.user = {username: username, userId: userId};
                    locals.article = {};
                    res.render('article/post', locals);
                } else {
                    locals.user = {};
                    locals.article = {};
                    res.redirect('/');
                }
            })
        }
    });
});
// 提交发表文章表单
router.post('/post', function (req, res, next) {
    res.session.get('userId', function (err, userId) {
        db.postArticle({
            title: req.body.title,
            content: req.body.content,
            user_id: userId
        }, function (err, ret) {
            if (err) {
                next(err);
            } else {
                res.redirect('/view/' + ret.insertId);
            }
        })
    })
});

router.param('article_id', function (req, res, next, id) {
    db.findArticleById(id, function (err, article) {
        if (err) {
            next(err);
        } else {
            if (article) {
                article.post_time = moment(article.post_time).format('YYYY-MM-DD HH:mm:ss');
                res.locals.article = article;
                res.locals.path = '/edit';
                next();
            } else {
                res.send(404);
            }
        }
    })
});

router.get('/edit/:article_id', function (req, res, next) {
    res.session.get('username', function (err, username) {
        if (err) {
            next(err);
        } else {
            res.locals.user = {username: username};
            res.render('article/edit');
        }
    })
});

router.post('/edit/:article_id', function (req, res, next) {
    res.session.get('userId', function (err, userId) {
        if (err) {
            next(err);
        } else {
            db.updateArticleById({
                title: req.body.title,
                content: req.body.content,
                user_id: userId,
                id: req.params.article_id
            }, function (err, ret) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/view/' + req.params.article_id);
                }
            })
        }
    })
});


router.post('/delete', function (req, res, next) {
    res.session.get('userId', function (err, userId) {
        if (err) {
            next(err);
        } else {
            db.deleteArticleById({
                user_id: userId,
                id: req.body.data
            }, function (err, ret) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('/');
                }
            })
        }
    })
});

module.exports = router;
