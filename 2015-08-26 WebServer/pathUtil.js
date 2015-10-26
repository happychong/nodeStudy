/**
 * Created by v_songxiaodan on 2015/8/27.
 */

function parse(path) {
    var paramRegex = /{(\S+?)}/g;
    var isHaveParam = false;
    var match;
    var params = [];
    while(null != (match = paramRegex.exec(path))) {
//        有参数  /movie/23456543
        isHaveParam = true;
//    match = [ '{id}', 'id', index: 7, input: '/movie/{id}/ovie/{mid}' ]
        path = path.replace(match[0], '(\\S+?)');
//    path = /movie/(\S+?)/ovie/(\S+?)
        params.push(match[1]);
    }
    if (isHaveParam) {
//      生成正则，同时，转义好/
        return {
            params: params,
            path: new RegExp('^' + path.replace(/\//g, '\\/') + '$', 'g')
        };
    } else {
        return {
            path: path
        };
    }
}
exports.parse = parse;