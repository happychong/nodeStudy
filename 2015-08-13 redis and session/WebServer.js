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
}

WebServer.prototype._showPage = function (res, fullpath) {
    res.writeHead(200, {"Content-Type":"text/html"});
    fs.createReadStream(fullpath).pipe(res);
};
WebServer.prototype.start = function (port, cb) {
    var self = this;
    http.createServer(function (req, res) {
        var urlObj = url.parse(req.url);
        //urlObj.pathname
        // /index.html
        var fullpath = path.join(self._basedir, urlObj.pathname?(urlObj.pathname.replace(/\.\./g,"")):"");
        fs.exists(fullpath, function (isExist) {
            if (isExist) {
                fs.stat(fullpath, function (err, stats) {
                    if (err) {
                        self._showErrPage(res, 500);
                    }
                    else if (stats.isDirectory()) {
                        fullpath = path.join(fullpath, self._deaultPage);
                        fs.exists(fullpath, function(isExist){
                            if(isExist){
                                self._showPage(res, fullpath);
                            }
                            else{
                                self._showErrPage(res, 404);
                            }
                        });
                    }
                    else if(stats.isFile()){
                        fs.exists(fullpath, function(isExist){
                            if(isExist){
                                self._showPage(res, fullpath);
                            }
                            else{
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
    })
        .listen(port, function () {
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

module.exports = WebServer;