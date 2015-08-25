/**
 * Created by v_songxiaodan on 2015/8/13.
 */
var http = require('http');
var RedisSession = require('./Redis_Session');
var url = require('url');
var formidable = require('formidable');
var fs = require('fs');
var mysql = require('mysql');
var crypto = require('crypto');

var redisSession = new RedisSession({});

var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'test'
});

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    if ('/favicon.ico' === urlObj.pathname) {
        res.writeHead(404);
        res.end(http.STATUS_CODES[404]);
    } else {
        redisSession.wrap(req, res, function (req, res) {
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
//            res.end('OK');
            var path = urlObj.pathname;
            console.log(path);
            if (path === '/') {
                path = '/index.html';
                fs.createReadStream('.' + path).pipe(res);
            } else if (/^\/.*\.html$/.test(path)) {
                fs.createReadStream('.' + path).pipe(res);
            } else if (path === '/signup') {
                var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        res.writeHead(500);
                        res.end(http.STATUS_CODES[500]);
                    }

                    console.log(fields);
                    pool.getConnection(function (err, conn) {
                        conn.query('select count(*) as c from user where username=?',[fields.username], function (err, rows) {
                            if (rows[0].c == 0) {
                                var passHex = crypto.createHash('md5').update(fields.password).digest('hex');
                                conn.query('insert into user (username, password) values (?, ?)', [fields.username, passHex], function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                    res.end('注册成功，欢迎你: ' + fields.username);
                                });
                            } else {
                                res.end('用户已存在');
                            }
                        });
                    });
//                    res.end('OK!')
                });
            } else if (path === '/signin') {
                var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        res.writeHead(500);
                        res.end(http.STATUS_CODES[500]);
                    }
                    pool.getConnection(function (err, conn) {
                        conn.query('select password from user where username=?;',[fields.username], function (err, password) {
                            if (err) {
                                res.writeHead(500);
                                res.end(http.STATUS_CODES[500]);
                            }
                            console.log('line 75');
                            console.log(password[0]);
                            var passHex = crypto.createHash('md5').update(fields.password).digest('hex');
                            if (password && password[0].password === passHex) {
                                res.end('登录成功！');
                            } else {
                                res.end('密码不正确！');
                            }
//                            if (rows[0].c == 0) {
//                                conn.query('insert into user (username, password) values (?, ?)', [fields.username, fields.password], function (err) {
//                                    if (err) {
//                                        throw err;
//                                    }
//                                    res.end('注册成功，欢迎你: ' + fields.username);
//                                });
//                            } else {
//                                res.end('用户已存在');
//                            }
                        })
                    });
                })
            } else {
                fs.createReadStream('./index.html').pipe(res);
            }
        });
    }
}).listen(8888);