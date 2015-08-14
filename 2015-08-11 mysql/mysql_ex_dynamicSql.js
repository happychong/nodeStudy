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
    database: 'test'
});


// 古代 拼字符串 写法
var userName = 'zhangsan';
var password = '1598232123\' or 1=1 or 1=\'';
var sql = 'select count(*) from userInfo where user_name=' + conn.escape(userName) + ' and passwork=' + conn.escape(password);
// connection.escape()    pool.escape()   connection 和 pool 都有escape方法
conn.query(sql, function (err, rows) {
    console.log(rows);
//    conn.destroy();
});


// 参数注入写法 - 用?做占位符
//??  --  实体的名字，表名 字段名   被以下['id', 'user_name']替换
//？  --  参数的名字     被以下'admin', '123456'替换
var queryUser = 'select ?? from userInfo where user_name=? and passwork=?';
var params = [['id', 'user_name'], 'zhangsan', '1598232123'];
// mysql.format 方便开发的时候 查看语句
console.log(mysql.format(queryUser, params));
conn.query(queryUser, params, function (err, rows) {
    console.log('queryUser:', rows);
    conn.destroy();
});

/*
数据库建表 添加代码
DROP TABLE IF EXISTS `userInfo`;
CREATE TABLE `userInfo` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_name` varchar(20) NOT NULL,
    `passwork`  varchar(30),
	`joinDate`  date,
	PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

 INSERT INTO userInfo (user_name,passwork,joinDate) values('zhangsan','1598232123',now());

*/
