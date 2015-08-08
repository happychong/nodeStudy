
/**
 * Created by Administrator on 2015/7/4.
 * 通过流 向文件里写入数据
 */

var fs = require('fs');
var rs = fs.createWriteStream('target');
rs.write('hello ');
rs.end('over');

function copyStream(src, desc) {
    var fdsrc = fs.createReadStream(src);
    var fddesc = fs.createWriteStream(desc);
    fdsrc.on('data', function (data) {
        fddesc.write(data);
    });
    fdsrc.on('end', function (data) {
        fddesc.end();
    });
}
copyStream('target', 'newTarget.txt');