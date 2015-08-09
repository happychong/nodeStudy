/**
 * Created by Administrator on 2015/8/8.
 * 文件相关操作
 */
// fileSystem 简称fs 文件操作
var fs = require('fs');
/*
* 功能：读取文件内容 - 异步
* 返回方式：通过回调的data参数
* 用法：fs.readFile(filePath, options, callback)
* 参数：filePath 要读取的文件的路径
*      options 编码格式
*      callback 回调函数 有err（错误信息）和data 参数
* */
fs.readFile('sum.js', 'utf-8', function (err, data) {
    if (err) {
        console.log(err);
    } else {
//        不指定编码为utf-8的话，data 是 Buffer 格式
//        Buffer - node的全局对象 缓冲区 一系列数据的输入
//        Buffer 对象调用toString方法，会直接转换成可读文本，默认转成了十进制
        console.log(data);
    }
});

/*
* 功能：读取文件内容 - 同步
* 返回方式：通过返回的变量返回内容
* 用法：fs.readFileSync(filePath, options)
* 参数：filePath 要读取的文件的路径
*      options 编码格式
* */
var data = fs.readFileSync('a.txt', 'utf-8');
console.log(data);

//同步 - 异步 比较
//异步读取文件内容，是操作系统在后台进行代码的读取，不会阻塞后面代码的执行
//同步读取文件内容，会阻塞进行，等文件读取完成之后再执行下面的操作