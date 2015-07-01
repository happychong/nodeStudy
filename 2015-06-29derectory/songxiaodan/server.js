var http = require('http');
var fs = require('fs');
var path = require('path');

var bathURL = path.dirname(__filename);

http.createServer(function (req, res) {
    //当前文件所属的目录
    /**
     * normalize 将非标准的路径 转化为标准路径
     * 1.解析  . ..
     * 2.多个斜杠转化为一人
     * 3.正斜杠 和 反斜杠 转换
     * 4.如果以斜杠结尾，保留斜杠
     **/
    console.log(req.url);
    if (req.url !== '/favicon.ico' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html;charset=utf-8' });
        createCon('./', res);
    } else {
        res.end('404');
    }
}).listen(7777);

function createCon(url, res) {
    url = path.normalize(url);
    _createCon(url, res);

    setTimeout(function(){
        res.end('<b>成功了，请点击链接查看文件内容吧</b>', 'utf8');
    },1000);
    var i = 0;
    function _createCon(url, res) {
        ++i;
        fs.readdir(url, function (err, files) {
            if (err) {
                console.log('31- err');
            } else {
                res.write('<br><div>第' + i + '级目录</div>', 'utf8');
                files.forEach(function(file){
                    if (file[0] === '.') {
                        // 因为node中的forEach是回调函数，所以用return实现循环中continue功能
                        return;
                    }
                    fs.stat(path.join(url, file), function (err,stat) {
                        if (stat.isDirectory()){
                            // 是文件夹的话，显示文件夹，继续深究
                            res.write('<div>' + file + '</div>', 'utf8');
                            var deepUrl = url + '/' + file;
                            _createCon(deepUrl, res);
                        } else  {
    //                      是文件，显示文件
                            res.write('<a href="' + path.join(url, file) + '">' + file + '</a><br>', 'utf8');
                        }
                    });
                });
            }
        });
    }
}


//var out = fs.createReadStream();
//out.on('data');



//console.log(path.join(__dirname,'a','b','c'));
//__dirname/a/b/c



// basename获取一个路径 的文件名
//console.log(path.basename(__filename));
//console.log(path.basename(__filename,path.extname(__filename)));
//console.log(path.extname(__filename));
//console.log(path.seq);//文件分隔符
//console.log(path.delimiter);//环境变量分隔符 ; :

//获取一个文件的绝对路径
//fs.realpath(bathURL + url, function (err,path) {
//    console.log(path);
//});