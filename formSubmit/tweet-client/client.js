/**
 * Created by v_songxiaodan on 2015/5/20.
 */
var http = require('http');
var qs = require('querystring');
function send(theName) {
    http.request({
        host: '127.0.0.1',
        port: 3000,
        url: '/',
        method: 'POST'
    }, function (res) {
        //var body = '';
        res.setEncoding('utf8');
        /*res.on('data', function (chunk) {
            body += chunk;
        });*/
        res.on('end', function () {
            console.log('\n We got: \033[90m   request complete!  \033[39m');
            //console.log('\n We got: \033[96m' + body + '\033[39m\n');
            process.stdout.write('\n your name: ');
        });
    }).end(qs.stringify({name: theName}));
}

process.stdout.write('\n your name: ');
process.stdin.resume();
process.stdin.setEncoding('ascii');
process.stdin.on('data', function (name) {
    name = name.replace('\r', '');
    name = name.replace('\n', '');
    send(name.replace('\n', ''));
});

