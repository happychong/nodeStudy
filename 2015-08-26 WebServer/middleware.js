/**
 * Created by v_songxiaodan on 2015/9/1.
 */

function MiddleWare() {
    this._middleware = [];
}

MiddleWare.prototype.use = function (cb) {
    this._middleware.push(cb);
}
MiddleWare.prototype.run = function (req, res, cb) {
    var index = 0;
    var self = this;
    function next () {
        if (index < self._middleware.length) {
            self._middleware[index++](req, res, next);
        }
        else {
            cb(req, res);
        }
    }
    next();
}
module.exports = MiddleWare;