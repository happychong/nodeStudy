/**
 * Created by v_songxiaodan on 2015/9/17.
 */
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'nodeblog'
});



exports.isUserExists = function (username, cb) {
    // 后端不要相信前端传来的数据，这里应该做校验
    pool.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
            return;
        }
        conn.query('select count(*) as c from user where username=?', [username], function (err, ret) {
            if (err) {
                console.error('L-23', err);
                cb && cb(err);
            } else {
                cb && cb(err, ret);
            }
            conn.release();
        })
    });
};
exports.addUser = function (user, cb) {
    pool.getConnection(function (err, conn) {
        conn.query('insert into user (username, password, signup_time, signin_time) values (?, ?, now(), now())', [user.username, user.password], function (err, ret) {
            if (err) {
                console.error('db - 34 --- insert false!', err);
                cb(err);
            } else {
                cb(err, ret);
            }
            conn.release();
        })
    })
};

exports.queryUserByUsernameAndPassword = function (user, cb) {
    pool.getConnection(function (err, conn) {
        conn.query('select id, username from user where username=? and password=?', [user.username, user.password], function (err, ret) {
            if (err) {
                console.error('db - 49 --- select false!', err);
                cb && cb(err);
            } else {
                cb && cb(err, ret);
            }
            conn.release();
        })
    })
};