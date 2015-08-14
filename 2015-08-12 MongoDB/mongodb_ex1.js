/**
 * Created by v_songxiaodan on 2015/8/12.
 */
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
   var collection = db.collection('foo');
    collection.findOne(function (err, one) {
//        findOne 方法是异步的
        if (err) {
            console.log(err);
        } else {
            console.log(one);
        }
    });
});
