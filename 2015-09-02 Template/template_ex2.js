/**
 * Created by v_songxiaodan on 2015/9/2.
 */

var template = '姓名：<span><%user.name%></span>年龄：<span><%user.age%></span><ul><li></li></ul>';

var reg = /<%([a-zA-Z_0-9.]+)%>/g;

var data = {
    user: {
        name: 'laogeng',
        age: 18
    }
};

var match = null;
while (null != (match = reg.exec(template))) {
    var variables = match[1].split('.');
    var temp = data;
    for (var i = 0; i < variables.length; i++) {
        temp = temp[variables[i]];
    }
    template = template.replace(match[0], temp);
}

console.log(template);







