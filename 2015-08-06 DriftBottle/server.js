/**
 * Created by v_songxiaodan on 2015/8/6.
 * 漂流瓶
 */
var express = require('express');
var app = express();
var util = require('util');
// 解析表体
var bodyParser = require('body-parser');
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.post('/reg', function (req, res) {
    console.log(util.inspect(req.body));
    res.end('reg success');
});
app.post('/throw', function (req, res) {
    console.log(util.inspect(req.body));
    res.end('throw success');
});
app.post('/pick', function (req, res) {
    console.log(util.inspect(req.body));
    res.end('pick success');
});
app.post('/view', function (req, res) {
    console.log(util.inspect(req.body));
    res.end('view success');
});
app.listen(9999);