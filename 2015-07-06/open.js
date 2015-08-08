/**
 * Created by Administrator on 2015/7/4.
 * 读取文件
 */
var fs = require('fs');
/*
 * fs.open(path, flags, mode, callback
 * path 路径
 *
 * fd 文件描述符
 **/
//fs.open('./msg.txt', 'r', function (err, fd) {
//    fs.close(fd);
//    console.log(err, fd);
//});



/*
* 如何分多次读取文件
* fs.read(fd, buffer, offset, length, position, function)
* fd 文件索引
* buffer 把文件内容读到哪个buffer里
* offset buffer的偏移量 从哪个字节开始写起
* length 从文件中读取的字节数
* position 文件中读取的开始位置
**/
// 异步
//fs.open('./msg.txt','r',function(err,fd){
//    var buff = new Buffer(9);
//    //先读 "墓笔"
//    fs.read(fd,buff,0,6,3,function(err,bytesRead){
//        console.log(bytesRead,buff.slice(0,bytesRead).toString());
//        fs.read(fd,buff,6,3,9,function(err,bytesRead){
//            console.log(bytesRead,buff.toString());
//        });
//    });
//});

var fd = fs.openSync('./msg.txt','r');
var buff = new Buffer(12);
var bytesRead = fs.readSync(fd, buff, 0, 6, 0);
console.log(buff.toString());
var bytesRead2 = fs.readSync(fd, buff, 6, 6, bytesRead);
// or  var bytesRead2 = fs.readSync(fd, buff, 0, 6, 6);
console.log(buff.toString());

//fs.open('./msg.txt','r',function(err,fd){
//    var buff = new Buffer(9);
//    //先读 "墓笔"
//    fs.read(fd,buff,0,6,3,function(err,bytesRead){
//        console.log(bytesRead,buff.slice(0,bytesRead).toString());
//        fs.read(fd,buff,6,3,9,function(err,bytesRead){
//            console.log(bytesRead,buff.toString());
//        });
//    });
//});