/**
 * Created by jnduan on 14/11/23.
 */

var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    util = require('util'),
    path = require('path'),
    PathUtil = require('./pathUtil'),
    MiddleWare = require('./middleware');

function WebServer(options) {
    if (!options || !options.baseDir) {
        throw new Error("Illegal arguments error");
    }
    var path = options.baseDir;
    if (!fs.existsSync(path)) {
        throw new Error(util.format("path \"%s\" doesn't exist error.", path));
    }
    else {
        var stats = fs.statSync(path);
        if (!stats.isDirectory()) {
            throw new Error(util.format("path \"%s\" must be a directory.", path));
        }
        else {
            this._basedir = path;
            this._deaultPage = options.defaultPage || 'index.html';
        }
    }
    this._route_handler = {};
    this._regexp_router_handler = [];
    this._middleware = new MiddleWare();
}

WebServer.prototype._showPage = function (res, fullpath) {
    res.writeHead(200, {"Content-Type":"text/html"});
    fs.createReadStream(fullpath).pipe(res);
};
WebServer.prototype._showStaticResouce = function (req, res) {
    var self = this;
    var urlObj = url.parse(req.url);
    //urlObj.pathname
    // /index.html
    var fullpath = path.join(self._basedir, urlObj.pathname ? (urlObj.pathname.replace(/\.\./g, "")) : "");
    fs.exists(fullpath, function (isExist) {
        if (isExist) {
            fs.stat(fullpath, function (err, stats) {
                if (err) {
                    self._showErrPage(res, 500);
                }
                else if (stats.isDirectory()) {
                    fullpath = path.join(fullpath, self._deaultPage);
                    fs.exists(fullpath, function (isExist) {
                        if (isExist) {
                            self._showPage(res, fullpath);
                        }
                        else {
                            self._showErrPage(res, 404);
                        }
                    });
                }
                else if (stats.isFile()) {
                    fs.exists(fullpath, function (isExist) {
                        if (isExist) {
                            self._showPage(res, fullpath);
                        }
                        else {
                            self._showErrPage(res, 404);
                        }
                    });
                }
            });
        }
        else {
            self._showErrPage(res, 404);
        }
    });
}
WebServer.prototype.start = function (port, cb) {
    var self = this;
    http.createServer(function (req, res) {
        res.setTimeout(30000);
        ///////处理session
        self._middleware.run(req, res, function () {
            var urlObj = url.parse(req.url);
            var isUrlMatchRegexp = false;
            for (var i = 0; i < self._regexp_router_handler.length; i++) {
                var match;
                self._regexp_router_handler[i].path.lastIndex = 0;
                if (null !== (match = self._regexp_router_handler[i].path.exec(urlObj.pathname))) {
                    if (!self._regexp_router_handler[i].method || self._regexp_router_handler[i].method == req.method) {
                        isUrlMatchRegexp = true;
                        var params = self._regexp_router_handler[i].params;
                        var pathParams = {};
                        for (var j = 0; j < params.length; j++) {
                            pathParams[params[j]] = match[j + 1];
                        }
                        req.pathParams = pathParams;
                        process.nextTick(function () {
                            self._regexp_router_handler[i].cb(req, res);
                        });
                        break;
                    } else {
                        res.writeHead(403);
                        res.end(http.STATUS_CODES[403]);
                    }
                }
            }
            if (!isUrlMatchRegexp) {
                if (self._route_handler[urlObj.pathname]) {
                    if (self._route_handler[urlObj.pathname].method == req.method) {
                        self._route_handler[urlObj.pathname].cb(req, res);
                    } else {
                        res.writeHead(403);
                        res.end(http.STATUS_CODES[403]);
                    }
                } else {
                    self._showStaticResouce(req, res);
                }
            }
        });
    }).listen(port, function () {
        cb.call();
    });
};

WebServer.prototype.shutdown = function () {
    process.exit(0);
};

WebServer.prototype._showErrPage = function (res, statusCode) {
    res.writeHead(statusCode, {"Content-Type": "text/html"});
    res.end(http.STATUS_CODES[statusCode]);
}
WebServer.prototype.route = function (path, cb, method) {
    var pathObj = PathUtil.parse(path);
    if (pathObj.path instanceof RegExp) {
        pathObj.cb = cb;
        if (method) {
            pathObj.method = method;
        }
        this._regexp_router_handler.push(pathObj);
    } else {
        this._route_handler[path] = {
            cb: cb
        };
        if (method) {
            this._route_handler[path].method = method;
        }
    }
}
WebServer.prototype.get = function (path, cb) {
    this.route(path, cb, 'GET');
}

WebServer.prototype.post = function (path, cb) {
    this.route(path, cb, 'POST');
}

WebServer.prototype.use = function (cb) {
    this._middleware.use(cb);
}

module.exports = WebServer;