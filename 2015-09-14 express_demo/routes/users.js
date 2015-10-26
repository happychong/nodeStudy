var express = require('express');
var router = express.Router();

var db = require('../db.js');
var crypto = require('crypto');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
// 登录
router.get('/signin', function (req, res) {
    var locals = {
        path: req.url,
        title: '首页'
    };
    if (res.session.user_id) {
        locals.user = {username: 'test'};
    } else {
        locals.user = {};
    }
    res.render('user/signin', locals);
});

router.post('/signin', function (req, res) {
    db.isUserExists(req.body.username, function (err, yes) {
        if (err) {
            next(err);
        } else {
            if (yes[0].c === 1) {
                db.queryUserByUsernameAndPassword(
                    {
                        username: req.body.username,
                        password: req.body.password
                    },
                    function (err, ret) {
                        if (err) {
                            next(err);
                        } else {
                            if (ret && ret.length == 1) {
                                res.session.set('username', ret[0].username, function (err) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        res.session.set('userId', ret[0].id, function (err) {
                                            if (err) {
                                                next(err);
                                            } else {
                                                var locals = {
                                                    path: '/',
                                                    title: '首页',
                                                    user: {
                                                        username: ret[0].username
                                                    }
                                                };
                                                res.render('index', locals);
                                            }
                                        });
                                    }
                                });
                                //res.session.set('userId', ret[0].id);
                                //res.locals = {
                                //    path: '/',
                                //    title: '首页',
                                //    user: {
                                //        username: ret[0].username
                                //    }
                                //};

                            } else {
                                res.send('密码错误。');
                            }

                        }
                    }
                );
            } else {
                res.send('用户不存在.');
            }
        }
    });

    //var locals = {
    //    path: req.url,
    //    title: '首页'
    //};
    //if (res.session.user_id) {
    //    locals.user = {username: 'test'};
    //} else {
    //    locals.user = {};
    //}
    //res.render('user/signin', locals);
});
// 注册
router.get('/signup', function (req, res) {
    var locals = {
        path: req.url,
        title: '首页'
    };
    if (res.session.user_id) {
        locals.user = {username: 'test'};
    } else {
        locals.user = {};
    }
    res.render('user/signup', locals);
});

router.post('/signup', function (req, res, next) {
    db.isUserExists(req.body.username, function (err, yes) {
        if (err) {
            console.error(err);
            next(err);
        } else {
            if (Number(yes[0].c) === 0) {
                db.addUser(
                    {
                        username: req.body.username,
                        //password: crypto.createHash('md5').updata(req.body.password)
                        password: req.body.password
                    },
                    function (err, ret) {
                        if (err) {
                            console.error(err);
                            next(err);
                        } else {
                            //    登录 update session
                            res.session.set('username', req.body.username, function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                    res.session.set('userId', ret.insertId, function (err) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            res.redirect('/');
                                        }
                                    })
                                }
                            });
                            //res.session.set('username', req.body.username);
                            //res.session.set('userId', ret.insertId);
                            //res.locals = {
                            //    user: {
                            //        username: req.body.username
                            //    },
                            //    path: '/'
                            //};
                            //var locals = {
                            //    user: {
                            //        username: req.body.username
                            //    },
                            //    path: '/',
                            //    title: '首页'
                            //};
                            //res.render('index',locals);
                        }
                    }
                );
            } else {
                //    用户已存在
                res.send('用户已存在。')
            }
        }
    });
});
// 退出登录
router.get('/logout', function (req, res) {
    var locals = {
        path: '/',
        title: '首页',
        user: {}
    };
    console.error('Line----------173');
    res.session.remove('username', function (err) {
        if (err) {
            next(err);
        } else {
            console.error('Line----------177');
            res.render('index', locals);
        }
    });
});


module.exports = router;
