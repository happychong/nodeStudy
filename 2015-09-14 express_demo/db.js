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
var redis = require('redis');
var redisClient = redis.createClient(6379, 'localhost');


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

exports.postArticle = function (article, cb) {
    pool.getConnection(function (err, conn) {
        conn.query('insert into article (title, content, post_time, edit_time, user_id) values (?, ?, now(), now(), ?)', [article.title, article.content, article.user_id], function (err, ret) {
            if (err) {
                console.error(err);
                cb(err);
            } else {
                cb(err, ret);
            }
           conn.release();
        })
    });
    //MongoClient.connect('mongodb://localhost:27017/nblog', function (err, db) {
    //    //获得操作集合对象
    //    var collection = db.collection('article');
    //    // collection下查找一条记录
    //    collection.save(article, function (err) {
    //        cb(err);
    //    });
    //});
};
exports.updateArticleById = function (article, cb) {
    pool.getConnection(function (err, conn) {
        conn.query('update article set title=?, content=?, edit_time=now() where id=? and user_id=?', [article.title, article.content, article.id, article.user_id], function (err, rows, fields) {
            if (err) {
                cb(err);
            } else {
                cb(err, rows, fields);
            }
            conn.release();
        })
    });
};
exports.deleteArticleById = function (article, cb) {
    pool.getConnection(function (err, conn) {
        conn.query('delete from article where id=? and user_id=?', [article.id, article.user_id], function (err, rows, fields) {
            if (err) {
                cb(err);
            } else {
                cb(err, rows, fields);
            }
            conn.release();
        })
    });
};

exports.findArticleById = function (id, cb) {
    pool.getConnection(function (err, conn) {
        conn.query('select a.id,a.title,a.content,a.post_time,a.user_id,u.username from article a inner join user u on a.user_id=u.id where a.id=?', [id], function (err, ret) {
            if (err) {
                cb(err);
            } else {
                cb(err, ret[0]);
            }
            conn.release();
        })
    })
};

exports.findArticlesByPage = function (pageNo, pageSize, cb) {
    pool.getConnection(function (err, conn) {
        conn.query('select count(*) as c from article', function (err, ret) {
            if (err) {
                cb(err);
            } else {
                var totalCount = ret[0].c;
                var totalPage = Math.ceil(totalCount / pageSize);
                if (pageNo > totalPage) {
                    pageNo = totalPage;
                }
                    var offset = (pageNo - 1) * pageSize;
                    conn.query('select a.id,a.title,a.content,a.post_time,a.user_id,u.username from article a inner join user u on a.user_id=u.id order by edit_time desc limit ?,?', [offset, pageSize], function (err, rows) {

                        cb(err,{
                            totalCount: totalCount,
                            totalPage: totalPage,
                            articles: rows
                        });

                    })
            }
            conn.release();
        });
    });
};

exports.incrArticleReadNum = function (id, cb) {
    redisClient.incr('article_' + id + '_read', cb);
};