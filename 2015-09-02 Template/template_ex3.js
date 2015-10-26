/**
 * Created by v_songxiaodan on 2015/9/6.
 */

/**
 * 渲染模板
 * tag: <%    %>
 * @param template 模板的字符串
 */
function parse(template) {
    var leftTag = '<%';
    var rightTag = '%>';
    var leftTagPos = template.indexOf(leftTag);
    var rightTagPos = template.indexOf(rightTag);
    var result = '';
    // 用户名：<%user.name%>
    /*if (leftTagPos >= 0 && rightTagPos >= 0 && leftTagPos + 2 < rightTagPos) {
        // 确保标签是左右完整，顺序正确，不为空
        result = result + '"' + escape(template.slice(0, leftTagPos)) + '"';
        result = result + ' + ';
        result = result + template.slice(leftTagPos + 2, rightTagPos);
        result = result + ' + ';
        result = result + '"' +  escape(template.slice(rightTagPos + 2)) + '"';
    }*/
    while (leftTagPos >= 0 && rightTagPos >= 0 && leftTagPos + 2 < rightTagPos) {
        template
            =  '"' + escape(template.slice(0, leftTagPos)) + '"'
            + ' + '
            + template.slice(leftTagPos + 2, rightTagPos)
            + ' + '
            + '"' +  escape(template.slice(rightTagPos + 2)) + '"';


        // 把原来的  <%   或    %>    替换掉
        leftTagPos = template.indexOf(leftTag);
        rightTagPos = template.indexOf(rightTag);
    }
    return template;
}

function escape(temp) {
    return temp.replace('\"', '\\\"');
}

function render(template, data) {
    var temp =  parse(template);
    var html;
    with (data) {
        html = eval(temp);
    }
    return html;
}
exports.render = render;
console.log(
    render('用\"户：<%user.name%>,你好. 今天是：<%date%>', {user: {name: 'laogeng'},date:'6'})
)