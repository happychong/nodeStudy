/**
 * Created by Administrator on 2015/7/4.
 * 拷贝文件
 */
var fs = require('fs');
var BUFFER_SIZE = 3;
function copy(src, desc) {
//      读到的位置  来源fd  目标fd   实际读到的字节数
    var readSoFar, fdsrc, fddest, read;
    var buff = new Buffer(BUFFER_SIZE);
    fdsrc = fs.openSync(src, 'r');
    fddest = fs.openSync(desc, 'w');

    readSoFar = 0;
    var counter = 0;
    do {
        /*
         * fs.readSync(fd, buffer, offset, length, position)
         * fd 文件索引
         * buffer 把文件内容读到哪个buffer里
         * offset buffer的偏移量 从哪个字节开始写起
         * length 从文件中读取的字节数
         * position 文件中读取的开始位置
         **/
        read = fs.readSync(fdsrc, buff, 0, BUFFER_SIZE, readSoFar);
        /*
        * fs.writeSync(fd, buffer, offset, length, position)
        * fd 文件描述符 ，要写入的文件
        * buffer 从某个缓存区开始读
        * offset 从缓存区里面读的开始位置
        * length 要读的字符数
        * position 写入文件的开始位置
        **/
        fs.writeSync(fddest, buff, 0, read);
        readSoFar += read;
        console.log(counter++);
    } while (read == BUFFER_SIZE);
    fs.closeSync(fdsrc);
    fs.closeSync(fddest);
}
copy('src', 'dest');