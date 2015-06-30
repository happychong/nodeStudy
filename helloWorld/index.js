/**
 * Created by v_songxiaodan on 2015/5/4.
 */
var net = require('net');
// 添加计数器
var count = 0;
// createServer指定一个回调函数，该函数在每次有新的链接建立时都会被执行
// createServer回调函数会接受一个Node中常见的实例对象(conn)：Stream-流，这里传递的是net.Stream,通常可读可写
var server = net.createServer(function (conn) {
    conn.write(
        '\n' +
        '> 欢迎光临 \033[92mnode-chat\033[39m!\n' +
        '> ' + count + ' 人在同时连接中。\n' +
        '> 请输入你的名字然后按回车键：'
    );
    // 当客户端请求关闭链接时，计数器变量递减
    conn.on('close', function () {
        // 当底层套接字关闭时，Node.js会触发close事件
        // Node中有2个和链接终止相关的事件，close和end。
        // end是当客户端显示关闭TCP连接时触发。比如当客户关闭telnet时，它会发送一个名为‘FIN’的包给服务器，意味着要结束连接
        // 当连接发生错误时（触发error事件），end事件不会触发，但是这2种情况，close事件都会被触发
        count--;
    });
    count++;
    // console.log('\033[90m    新的链接！\033[39m');
});
// 将服务器绑定3000端口上
server.listen(3000, function () {
    console.log('\033[96m server listening on *:3000\033[39m');
});