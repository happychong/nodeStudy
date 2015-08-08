/**
 * Created by Administrator on 2015/7/4.
 * 将文件完整的读入缓存区
 */
/*
* read 读取时不断将文件的一小块读入缓存区，然后从缓存区
* 1. 比较麻烦
* 2. 接收客户端数据的时候无法知道数据的大小，以及数据
**/

/*
* 有些时候我们不关心文件的内容，以及文件的大小
* 我们只需要关注是否读到的数据，以及督导数据应该如何处理
* 流 ： 一组有序的，有起点和终点的字节传输手段
**/

var fs = require('fs');
//var rs = fs.createReadStream('./msg.txt');
//rs.on('open', function () {
//    console.log('文件打开了。');
//});
//
//rs.on('data', function (data) {
//    console.log('读到了数据：', data.toString());
//});
//rs.on('end', function () {
//    console.log('文件关闭');
//});

var rs = fs.createReadStream('./msg.txt');
var arr = [];
rs.on('readable', function () {
    console.log('readalbe');
    while(null != (data = rs.read(1024*65))) {
        arr.push(data);
    }
//    console.log(rs.read(64*1024).length);
});
rs.on('end', function () {
    console.log(arr);
});