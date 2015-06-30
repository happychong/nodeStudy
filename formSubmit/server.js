/**
 * Created by v_songxiaodan on 2015/5/20.
 */
var querystring = require('querystring');
require('http').createServer(function (req, res) {
    /*if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end([
            '<form method="POST" action="/url">',
            '<h1>My form</h1>',
            '<fieldset>',
            '<label>Personal information</label>',
            '<p>What is your name?</p>',
            '<input type="text" name="name"/>',
            '<p><button>Submit</button></p>',
            '</form>'
        ].join(''));
    } else if (req.url === '/url' && req.method === 'POST') {*/
        var body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            res.writeHead(200);
            res.end('Done');
            // res.end('<p>Your name is <b>' + querystring.parse(body).name + '</b></p>');
            console.log('\n got name \033[96m' + querystring.parse(body).name + '\033[39m\n');
        });
    /*} else {
        res.writeHead(404);
        res.end('Not Found!')
    }*/
}).listen(3000);