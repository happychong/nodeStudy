/**
 * Created by v_songxiaodan on 2015/5/29.
 */
function route(handle, pathname, response) {
    console.log('About to route a request for ' + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response);
    } else {
        console.log('No request handler found for ' + pathname);
        // response.writeHead 发送一个HTTP状态200和HTTP头的内容类型（content-type）
        response.writeHead(404, {'Content-Type': 'text/plain'});

        // response.write() 函数在HTTP相应主体中发送文本“Hello World"
        response.write('404 Not found');
        // response.end() 完成响应
        response.end();
    }
}
exports.route = route;