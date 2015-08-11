/**
 * Created by v_songxiaodan on 2015/8/11.
 * mysql帮助文档，gitHub上搜node-mysql ---   https://gitHub.com/felixge/node-mysql
 */
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
//    端口没设置默认是3306
    port: '3306',
    user: 'root',
//    没设置密码，所以不写password了
    database: 'test',
    charset: 'utf-8'
//    还可以有charset、timeZone、connectTimeout、stringifyObjects、typeCast、dateStrings、debug
//             编码      时区
});

conn.query('select * from course', function (err, rows, fields) {
// 这里好像因为没安装mysql软件，所以报错
    console.log(arguments);
//    关闭连接
    conn.destroy();
});


