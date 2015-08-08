/**
 * Created by v_songxiaodan on 2015/7/27.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie.js');
var port = process.env.PORT || 3000;
var app = express();
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');
//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.listen(port);
console.log('imooc started on port ' + port);

//index page
app.get('/', function(req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        })
    })

    /*res.render('index', {
        title: 'imooc 首页',
        movies: [
            {
                title: '机械战警1',
                _id: 1,
                poster: 'http://www.baidu.com'
            },
            {
                title: '机械战警2',
                _id: 2,
                poster: 'http://www.baidu.com'
            },
            {
                title: '机械战警3',
                _id: 3,
                poster: 'http://www.baidu.com'
            },
            {
                title: '机械战警4',
                _id: 4,
                poster: 'http://www.baidu.com'
            },
            {
                title: '机械战警5',
                _id: 5,
                poster: 'http://www.baidu.com'
            },
            {
                title: '机械战警6',
                _id: 6,
                poster: 'http://www.baidu.com'
            }
        ]
    })*/
});

// detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        })
    })
    /*res.render('detail', {
        title: 'imooc 详情页',
        movie: {
            doctor: '赵薇',
            country: '中国',
            title: 'ji写战警',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: '很多很多很多的介绍！'
        }
    })*/
});

// 后台录入页
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

//admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie){
                if (err){
                    console.log(err);
                }
                res.redirect('/movie/' + movie.id);
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
        });
        _movie.save(function (err, movie) {
            if (err){
                console.log(err);
            }
            res.redirect('/movie/' + movie.id);
        })
    }
})

// list page
app.get('/admin/list', function(req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })

    /*res.render('list', {
        title: 'imooc 列表页',
        movies: [
            {
                title: 'jiexie战警',
                _id: 1,
                doctor: 'zhaowei',
                country: '美国',
                year: 2014,
                poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
                language: '英语',
                flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
                summary: ' 还是很多很多的讲解'
            }
        ]
    })*/
});