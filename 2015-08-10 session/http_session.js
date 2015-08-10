/**
 * Created by Administrator on 2015/8/10.
 */
var http = require('http');
var url = require('url');
var cookie = require('./cookie-util/cookie-util.js');

var session = {};
var SESSION_KEY = 'zfsessid';
var EXPIRE_TIME = 60 * 1000;
/*
* 1. 判断cookie中是否有session的值 --- sessionId/sessId/jsessionId/...
* 2. 如果有，证明是已经访问过的
*   2.1 session是否过期，如果过期，分配新sessionId
*   2.2 没过期，ok，有效期延长
* 3. 如果没有，生成一个sessionId
* */
http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    if ('/favicon.ico' === urlObj.pathname) {
        res.writeHead(40, {
            'Content-Type': 'text/html;charset=utf-8'
        });
        res.end(http.STATUS_CODES[404]);
    } else {
        var cookieObj = cookie.parse(req.headers.cookie);
        console.log(cookieObj);
        var now = new Date().getTime();
        if (cookieObj[SESSION_KEY]) {
            //2
            var sessionId = cookieObj[SESSION_KEY];
            if (session[sessionId]) {
                var sessionObj = session[sessionId];
                if (sessionObj.expTime.getTime() < now) {
                    //过期了 expired
                    var newSessionObj = {};
                    newSessionObj.expTime = new Date(now + EXPIRE_TIME);
                    var newSessionId = now + '_' + Math.random();
                    session[newSessionId] = newSessionObj;
                    delete session[sessionId];
                    res.writeHead(200, {
                        'Set-Cookie':cookie.serialize(SESSION_KEY, newSessionId),
                        'Content-Type': 'text/html;charset=utf-8'
                    });
                    res.end('欢迎老朋友，你的id是：' + newSessionId);
                } else {
                    //没过期
                    sessionObj.expTime = new Date(now + EXPIRE_TIME);
                    res.writeHead(200, {
                        'Content-Type': 'text/html;charset=utf-8'
                    });
                    res.end('欢迎老朋友，你的session有效期延长到：' + sessionObj.expTime.toString());
                }
            } else {
                var newSessionObj = {};
                newSessionObj.expTime = new Date(now + EXPIRE_TIME);
                var newSessionId = now + '_' + Math.random();
                session[newSessionId] = newSessionObj;
                delete session[sessionId];
                res.writeHead(200, {
                    'Set-Cookie':cookie.serialize(SESSION_KEY, newSessionId),
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.end('欢迎回来，找不到您的id信息，为您分配新的id：' + newSessionId);
            }
        } else {
            //3
            var sessionObj = {};
            sessionObj.expTime = new Date(now + EXPIRE_TIME);
            var sessionId = now + '_' + Math.random();
            session[sessionId] = sessionObj;
            res.writeHead(200, {'Set-Cookie':cookie.serialize(SESSION_KEY, sessionId), 'Content-Type':'text/html;charset=utf-8'});
            res.end('欢迎新朋友，你的id是：' + sessionId);
        }
    }
}).listen(8888);