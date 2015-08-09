/**
 * Created by Administrator on 2015/8/9.
 */
var http = require('http');
var fs = require('fs');
// url 模块 解析url用
var url = require('url');
/*
* createServer(callback)方法 - 创建 server 对象
* 参数：callback - 回调方法 ，有req 和 res 参数
* 每当浏览器有一个请求发过来的时候callback就会被执行，浏览器的请求就会封装成 request参数 传递进来，
* 同时我们可以调用传递进来的 response 对象，进行对浏览器的一些响应的工作
* */
var server = http.createServer(function (request, response) {
    /*
    * parse(str) - 解析url字符串
    * request.url - 请求的url字符串
    * urlObj 解析后的url对象
    *       {
    *        protocol: null,
             slashes: null,
             auth: null,
             host: null,
             port: null,
             hostname: null,
             hash: null,
             search: '?a=1',            - get请求所附加的参数
             query: 'a=1',              - get请求的参数及参数值
             pathname: '/query.html',   - 请求的具体资源
             path: '/query.html?a=1',   - 请求的包含参数的具体内容
             href: '/query.html?a=1'
            }
    * */
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    if (pathname === '/') {
        readFileAndResponse('/index.html', response);
    } else if (pathname === '/ajax') {
        response.end('{"msg": "This is a json response."}')
    } else {
        readFileAndResponse(pathname, response);
    }

});
/*
 * listen(port, ip) - 监听端口号 和 ip 地址， 启动 server 的时候，我们还需要监听ip地址，或者端口
 * port - 监听的端口 - 在服务器的硬件（操作系统）中运行的一个程序
 *       80 - 默认端口  ，端口最大65535 最小1
 *       两个程序不可以同时监听同1个端口，会冲突，当有请求的时候，操作系统就不知道让哪个程序进行响应了
 * ip - ip地址，在自己的机器上，完全可以不填，直接通过localhost，或者127.0.0.1访问就可以了
 * */
server.listen(8080);


// 公用的读取文件并响应的方法
function readFileAndResponse(pathname, response) {
    fs.readFile(pathname.substr(1), 'utf-8', function (err, data) {
        if (err) {
            /*
             * response.writeHead() - 给浏览器返回响应的时候，写入一些头部信息
             * */
            response.writeHead(404);
            response.end('file is not found!');
        } else {
            // 不写状态码，node自动写入200成功的状态码
            response.end(data);
        }
    });
}
