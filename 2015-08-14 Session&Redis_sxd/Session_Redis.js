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

    var cookieObj = cookie.parse(req.headers.cookie);
}
module.exports = SessionRedis;