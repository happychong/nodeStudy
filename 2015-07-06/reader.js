/**
 * Created by Administrator on 2015/7/4.
 * 按行 读取文件内容
 */
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
//var os = reuqire('os');
//var RETURN_FLAG = os.EOL;
var RETURN = 0x0d; // ascii \r 十六进制中的d代表十进制中的13 回车 reutrn
var NEWLINE = 0x0a; // ascii \n 十六进制中的a代表十进制中的10

function LineReader(path){
    this._rs = fs.createReadStream(path,'r');
}

util.inherits(LineReader,EventEmitter);
LineReader.prototype.on('newListener', function(eventName){
    if(eventName == 'newLine'){
        var line = [];//声明临时数组
        var self = this;//保存this指针
        this._rs.on('readable',function(){
            var ch;
            while(null != (ch = this.read(1))){
                // \r
                if(ch[0] == RETURN){
                    this.read(1); // \n
                    self.emit('newLine',Buffer.concat(line).toString());
                    line=[];
                }else{
                    line.push(ch);
                }
            }
        });
        this._rs.on('end',function(){
            self.emit('newLine',Buffer.concat(line).toString());
            self.emit('end');
        });
    }
});

var a = new LineReader('src');
a.on('newLine', function (buff) {
    console.log(buff);
});


