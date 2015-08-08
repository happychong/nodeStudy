/**
 * Created by v_songxiaodan on 2015/8/4.
 */
var express = require('express');
// 解析 url
var url = require('url');
// 解析表体数据 ， 需要npm install body-parser安装
var bodyParser = require('body-parser');
// 用于 上传的头像 ， 需要npm install multer安装
var multer = require('multer');
// 把任何类型的对象，转成字符串
var util = require('util');
var app = express();
var fs = require('fs');

// 用中间件的方式 使用，对请求和相应数据做处理
// 如果客户端发来请求，就会在dirname下找对应资源，没有再请求下面路径
app.use(express.static(__dirname));
// 上传到dest目录下
app.use(multer({dest: './'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 注册页面
app.get('/', function (req, res) {
    res.sendfile('./index.html');
})
// 对应表单的 get 请求，测试需要index的method对应
//app.get('/reg', function (req, res) {
//    var urlObj = url.parse(req.url, true);
//    res.end(JSON.stringify(urlObj.query));
//})
// 对应表单的post请求，测试需要index的method对应
app.post('/reg', function (req, res) {
    fs.createReadStream(req.files.picture.path).pipe(res);
//    res.send(util.inspect(req.files)
//        + '|' + JSON.stringify(req.body)
//    );
})

// 政府补贴农民 100 块钱
app.use('/money', function (req, res, next) {
    res.money = 100;
    next();
});
// 发送给省政府 克扣 10
app.use('/money', function (req, res, next) {
    res.money = res.money - 10;
    next();
});
// 发放到镇政府 克扣 20
app.use('/money', function (req, res, next) {
    res.money = res.money - 20;
    next();
});
// 发放到农民手里 不再执行next，直接返回了
app.use('/money', function (req, res, next) {
    res.send('我拿到了' + res.money + '元')
});

app.listen(8888);