var express = require('express');
var router = express.Router();

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
            res.render('index', locals);
        }
    });

});

module.exports = router;
