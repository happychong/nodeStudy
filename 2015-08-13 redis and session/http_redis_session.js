/**
 * Created by v_songxiaodan on 2015/8/13.
 */
var http = require('http');
var RedisSession = require('./Redis_Session');
var url = require('url');
var formidable = require('formidable');

var redisSession = new RedisSession({});

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    if ('/favicon.ico' === urlObj.pathname) {
        res.writeHead(404);
        res.end(http.STATUS_CODES[404]);
    } else {
        redisSession.wrap(req, res, function (req, res) {
//            res.end('OK');
            if (urlObj.pathname === '/') {
                var path = urlObj.pathname;
                fs.createReadStream(path).pipe(res);
            } else if (urlObj.pathname === '/singup') {
//                注册

            }
        });
    }
}).listen(8888);