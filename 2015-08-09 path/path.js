/**
 * Created by Administrator on 2015/8/9.
 */
/*
* path.sep --> seperator 分隔符 - 系统采用的分隔符，mac是/, windows是＼
* 主要拼接路径的时候，用当前系统的分隔符进行拼接
*
* path.extname(filename)
* 获取文件的扩展名
* */
var path = require('path');

console.log(path.sep);
console.log(path.extname('sxd.txt'));

