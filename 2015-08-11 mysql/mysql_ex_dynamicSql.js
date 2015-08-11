/**
 * Created by v_songxiaodan on 2015/8/11.
 * 动态 数据库
 * 古代 ，黑客发现
 *  var userName = 'admin\' or 1=1 or 1=\'';
 *  利用这个漏洞，不管密码是否正确，都可以成功登陆
 *  解决办法就是用escape()把传来的字符串先转义一次单引号，不能把条件拆成几个了，避免参数注入引发的不安全
 */
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'flmusic'
});
var userName = 'admin';
var password = '123456\' or 1=1 or 1=\'';
var sql = 'select count(*) from user where user_name=' + conn.escape(userName) + ' and password=' + conn.escape(password);
console.log(sql);
conn.query(sql, function (err, rows) {
    console.log(rows);
    conn.destroy();
});

var queryUser = 'select * from user where user_name=? and password=?';
conn.query(queryUser, ['admin', '123456'], function (err, rows) {
    console.log('queryUser:', rows);
});