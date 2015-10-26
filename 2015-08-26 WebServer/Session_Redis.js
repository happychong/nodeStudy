/**
 * Created by v_songxiaodan on 2015/8/13.
 */
var redis = require('redis');
var cookie = require('cookie');
var uuid = require('uuid');
// uuid用法
// uuid.v4();




var SESSION_CREATE_TIME = '__create-_-time__';
var DEFAULT_REDIS_EXPTIME = 10;
var DEFAULT_REDIS_HOST = 'localhost';
var DEFAULT_REDIS_PORT = 6379;

/**
 * @param options
 * {
 *      redis-host,
 *      redis-port,
 *      sessionKey,
 *      expireTime
 * }
 * @constructor
 */
function RedisSession(options) {
    this._redis_host = options.redisHost || DEFAULT_REDIS_HOST;
    this._redis_port = options.redisPort || DEFAULT_REDIS_PORT;
    this._sess_key = options.sessionKey || 'sessionId';
    if (options.expireTime) {
        var expTime = parseInt(optons.expireTime);
        if (isNaN(expTime)) {
            this._exp_time = DEFAULT_REDIS_EXPTIME; // 10 minutes
        } else {
            this._exp_time = expTime > 0 ? expTime : DEFAULT_REDIS_EXPTIME;
        }
    } else {
        this._exp_time = DEFAULT_REDIS_EXPTIME;
    }

    this._redisClient = redis.createClient(this._redis_port, this._redis_host);
}
RedisSession.prototype.wrap = function (req, res, callback) {
    if (req.headers.cookie) {
        var cookieObj = cookie.parse(req.headers.cookie);
        if (cookieObj[this._sess_key]) {
            var sessionKey = cookieObj[this._sess_key];
            var self = this;
//            hexists 需要2级
            self._redisClient.hexists(sessionKey, SESSION_CREATE_TIME, function (err, ret) {
                if (ret === 1) {
                    // redis有
                    console.log("cookie has sid, redis has sid, old session ", sessionKey)
                    self._redisClient.hgetall(sessionKey, function (err, ret) {
                        var session = new Session(sessionKey, self._redisClient, self._exp_time);
                        session._add_all(ret);
                        res.session = session;
                        self._redisClient.expire(sessionKey, self._exp_time, function (err, ret) {
                            if (err) throw err;
                        });
                        callback && callback(req, res);
                    })

                } else {
                    // redis没有
                    console.log("cookie has sid, redis has sid, new session ")
                    self._new(req, res, callback);
                }
            });
        } else {
            console.log("redis has sid, new session ")
            self._new(req, res, callback);
        }
    } else {
        console.log("cookie is empty, new session ")
        this._new(req, res, callback);
    }
};
RedisSession.prototype.shutdown = function () {
    this._redisClient.quit();
};

/**
 * 创建新session对象
 */
RedisSession.prototype._new = function (req, res, callback) {
    var sessId = uuid.v4();
    var session = new Session(sessId, this._redisClient, this._exp_time);
    res.session = session;
    res.setHeader('set-Cookie', cookie.serialize(this._sess_key, sessId));
    callback && callback.call(this, req, res);
}


function Session(id, redisClient, expTime) {
    this._id = id;
    this._redis = redisClient;
    this._data = {};
    this._expTime = expTime;
    this.set(SESSION_CREATE_TIME, (new Date()).getTime())
}
Session.prototype.get = function (key, callback) {
    if (key) {
        var self = this;
        self._redis.hget(this._id, key, function (err, ret) {
            if (err) throw err;
            self._renew();
            callback && callback.call(this, ret);
        })
    }
}
Session.prototype.set = function (key, value) {
    if (key && value) {
        var self = this;
        self._data[key] = value;
        this._redis.hset(this._id, key, value, function (err, ret) {
            if (err) {
                throw err;
            }
            self._renew();
        });
    }
}
Session.prototype.remove = function (key) {
    if (key) {
        var self = this;
        this._redis.hdel(key, function (err) {
            if (err) throw err;
            self._renew();
        })
    }
}

Session.prototype._add_all = function (data) {
    this._data = data;
}

Session.prototype._renew = function () {
    this._redis.expire(this._id, this._expTime);
}

module.exports = RedisSession;


