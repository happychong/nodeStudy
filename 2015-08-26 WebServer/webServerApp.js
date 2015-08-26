/**
 * Created by v_songxiaodan on 2015/8/26.
 */

var WS = require('./WebServer.js');

var options = {
    baseDir:'../2015-08-13 redis and session',
    defaultPage: 'index.html'
};

var server = new WS(options);
server.route('/signin', function (req, res) {
    console.log('user access /signin');
    res.end('signin');
})
server.route('/signup', function (req, res) {
    console.log('user access /signup');
    res.end('signup');
})




server.start(8088, function () {
    console.log('server started at 8088');
})









