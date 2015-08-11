/**
 * Created by v_songxiaodan on 2015/8/11.
 */
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root'
});
pool.getConnection(function (err, conn) {
    conn.query('select * from test.course', function (err, rows, feilds) {
        console.log(rows);
//        把借来的连接还回去
        conn.release();
    })
})