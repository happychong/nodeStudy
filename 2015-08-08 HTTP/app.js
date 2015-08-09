/**
 * Created by Administrator on 2015/8/8.
 *
 * 1 - 用户可以看到上传页面
 * 2 - 可以上传一张图片
 * 3 - 上传完成后，可以显示在浏览器中
 */
// http 服务
var http = require('http');
// 解析url
var url = require('url');
var fs = require('fs');
// 帮助解析 文件 内容
var formidable = require('formidable');
var app = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url);
    var pathname = urlObj.pathname;
    if (pathname == '/') {
        fs.createReadStream('./upload.html').pipe(res)
    } else if ( pathname == '/image') {
        new formidable.IncomingForm().parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
            } else {
                fs.createReadStream(files.avatar.path).pipe(res);
            }
        });
    } else {
        res.end('welcome')
    }
});
app.listen(8888);