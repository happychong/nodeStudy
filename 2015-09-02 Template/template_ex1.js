/**
 * Created by v_songxiaodan on 2015/9/2.
 */

var template = '姓名：<span><%name%></span>年龄：<span><%age%></span>';
var data = {};
data.name = 'laogeng';
data.age = '654';

console.log(template.replace(/<%([a-zA-Z_0-9]+)%>/g, function (all, part1) {
    return data[part1];
}));














