/**
 * Created by v_songxiaodan on 2015/5/29.
 */
var exec = require('child_process').exec;
function start(response) {
    console.log('Request hanler "start" was called.');
    exec(
        'find /',
        {timeout:10000, maxBuffer: 20000*1024},
        function (error, stdout, stderr) {
        // response.writeHead 发送一个HTTP状态200和HTTP头的内容类型（content-type）
        response.writeHead(200, {'Content-Type': 'text/plain'});
        // response.write() 函数在HTTP相应主体中发送文本“Hello World"
        response.write(stdout);
        // response.end() 完成响应
        response.end();
    });
}
function upload(response) {
    console.log('Request hanler "upload" was called.');
    // response.writeHead 发送一个HTTP状态200和HTTP头的内容类型（content-type）
    response.writeHead(200, {'Content-Type': 'text/plain'});
    // response.write() 函数在HTTP相应主体中发送文本“Hello World"
    response.write("Hello Upload");
    // response.end() 完成响应
    response.end();
}

exports.start = start;
exports.upload = upload;