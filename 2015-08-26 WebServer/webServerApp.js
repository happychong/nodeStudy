/**
 * Created by v_songxiaodan on 2015/8/26.
 */

var WS = require('./WebServer.js');
var RedisSession = require('./Session_Redis');

var options = {
    baseDir:'../2015-08-13 redis and session',
    defaultPage: 'index.html'
};

var server = new WS(options);
var redisSession = new RedisSession({});

server.get('/signin', function (req, res) {
    console.log('user access /signin');
    res.session.set('course', 'node.js');
    res.end('signin');
})
server.post('/signup', function (req, res) {
    console.log('user access /signup');
    res.end('signup');
})

server.route('/movie/{movieId}', function (req, res) {
    res.session.get('course', function (data) {
        res.end(JSON.stringify(req.pathParams) +  ', session : ' + data);
        res.end('user access /movie with pathparam : ' + req.pathParams.movieId + ',session: ' + data);
    })

})

server.route('/mv/{mvId}/acount/{aId}', function (req, res) {
    res.end(JSON.stringify(req.pathParams));
})
server.use(function(req, res, next) {
    console.log('~~~~~~~~~~~~~~~!@#$%^&*()~~~~~~~~~~~~~~~~~~~~');
    redisSession.wrap(req, res, next);
});

server.start(8088, function () {
    console.log('server started at 8088');
})









