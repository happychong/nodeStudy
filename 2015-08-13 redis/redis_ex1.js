/**
 * Created by v_songxiaodan on 2015/8/13.
 */
var redis = require('redis');

var client = redis.createClient(6379, 'localhost');

client.set('course', 'node.js', function (err, ret) {
//    ret - redis数据库的返回值
    console.log('set: ', arguments);
    client.get('course', function (err, ret) {
        console.log(ret);
    });
//    退出
//    client.quit();
});

client.hset('zhufeng', 'course', 'nodejs', function (err, ret) {
    console.log('hset: ', arguments);
    client.hget('zhufeng', 'course', function (err, ret) {
        console.log('hget: ', ret);
    })
    client.hgetall('zhufeng', function (err, ret) {
        console.log('hgetall: ', ret);
    })
});

client.expire('course', 3);