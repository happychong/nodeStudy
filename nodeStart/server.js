/**
 * Created by v_songxiaodan on 2015/5/29.
 */
// 请求（require）Node.js自带的 http 模块，并且把它赋值给 http 变量
var http = require('http');

var url = require('url');

// 功能：创建http服务
function start(route, handle) {
    // 服务器收到一个HTTP请求的时候 的 回调方法 无论何时我们的服务器收到一个请求，这个函数就会被调用
    function onRequest(request, response) {
        // request  ---  请求信息的对象
        // response ---  响应信息的对象
        var pathname = url.parse(request.url).pathname;
        console.log('Request for ' + pathname + ' received.');

        route(handle, pathname, response);

    }

    // 调用http模块提供的函数： createServer 创建一个http服务 这个函数会返回一个对象
    http.createServer(onRequest).listen(8888);
    // createServer 返回的对象有一个叫做 listen 的方法，这个方法有一个数值参数，指定这个HTTP服务器监听的端口号
    console.log('Server has started.');
}
exports.start = start;