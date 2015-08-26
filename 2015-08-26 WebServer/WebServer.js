/**
 * Created by jnduan on 14/11/23.
 */

var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    util = require('util'),
    path = require('path');

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
        var urlObj = url.parse(req.url);
        if (self._route_handler[urlObj.pathname]) {
            self._route_handler[urlObj.pathname](req, res);
        } else {
            self._showStaticResouce(req, res);
        }
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
WebServer.prototype.route = function (path, cb) {
    var paramRegex = /{(\S+?)}/g;
    var isHaveParam = false;
    var match;
    while(null != (match = paramRegex.exec(path))) {
//        有参数  /movie/23456543
        isHaveParam = true;
        path.replace(match[0], '(\\S+)');
    }
    if (isHaveParam) {
        var pathReg = new RegExp('^' + path.replace(/\//g. '\\/') + '$', );
    } else {

    }
    this._route_handler[path] = cb;
}
module.exports = WebServer;