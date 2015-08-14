/**
 * Created by v_songxiaodan on 2015/8/14.
 */
var http = require('http');
var url = require('url');
var Session_Redis = require('./Session_Redis')

var server_session = new Session_Redis();

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    if (urlObj.pathname === '/favicon.ico') {
        res.writeHead(404);
        res.end(http.STATUS_CODES[404]);
    } else {
        console.log(req);
        res.end('OK');
//        server_session.wrap(req, res, function () {
//            res.end('OK');
//        });
    }
}).listen(9999);