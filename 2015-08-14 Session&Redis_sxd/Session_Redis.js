/**
 * Created by v_songxiaodan on 2015/8/14.
 */
var redis = require('redis');
var uuid = require('uuid');
var cookie = require('cookie');
// 过期时间
var EXPTIME = 30;
//redis连接的host
var REDISHOST = 'localhost';
//redis连接的port
var REDISPORT = 6379;

/**
 * 公共服务器端对象
 *   主要作用保存redisClient对象
 * @param options
 *     redisHost   redis连接的host
 *     redisPort   redis连接的port
 *     expTime     redis的过期时间
 * @constructor
 */
function SessionRedis(options) {
    options = options || {};
    this._redisHost = options.redisHost || REDISHOST;
    this._redisPort = options.redisPort || REDISPORT;
    this._expTime = options.expTime || EXPTIME;
    this._redisClient = redis.createClient(this._redisPort, this._redisHost);
}
SessionRedis.prototype.wrap = function (req, res, callback) {
    if (req.headers.cookie) {
        // cookie 存在
        var cookieObj = cookie.parse(req.headers.cookie);
        var self = this;
        var sessId = cookieObj['__create-_-time__'];
        this._redisClient.hgetall(cookieObj['__create-_-time__'], function (err, ret) {
            err && console.log(err);
            console.log('Ret', ret);
            if (ret) {
                // redis中 有数据，找到了session信息，继续延期
                res.write('OK!请继续！已为您设置延期');
                self._redisClient.expire(sessId, EXPTIME);
                callback && callback.call(this);
            } else {
                // redis中 没数据，过期了，重新分配session
                self.newSession(req, res);
                res.write('过期了，重新为您分配session！');
                callback && callback.call(this);
            }
        });
    } else {
        // cookie 不存在
        this.newSession(req, res);
        callback && callback.call(this);
    }
};
SessionRedis.prototype.newSession = function (req, res) {
    var sessId = uuid.v4();
    res.setHeader('set-Cookie', '__create-_-time__=' + sessId);
    this._redisClient.hset(sessId, '__create-_-time__', new Date().getTime(), function () {
        console.log('redis set Ok!')
    });
    this._redisClient.expire(sessId, EXPTIME);
};





module.exports = SessionRedis;