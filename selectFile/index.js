/**
 * Module dependencies.
*/

var fs = require('fs');
var stdin = process.stdin;
var stdout = process.stdout;

fs.readdir(process.cwd(), function (err, files) {
    // files会返回一个数组 ['.idea', 'node_modules', 'index.js', 'package.json']
    console.log('');
    // 如果diles数组为空，告知用户当前目录没有文件
    if (!files.length) {
        // \033[31m 类似文本表示颜色
        return console.log('    \033[31m 没有文件可展示！\033[39m\n');
    }
    // 如果有文件，显示如下提示性文字
    console.log('    选择你想看的文件或者文件夹：');
    var stats = [];
    function showFile(i) {
        var filename = files[i];
        // fs.stat 给出文件或者目录的元数据
        fs.stat(__dirname + '/' + filename, function (err, stat) {
            // 把stat保存在stats数组里
            stats[i] = stat;
            // isDirectory 路径所代表的是目录
            if (stat.isDirectory()) {
                console.log('    ' + i + '    \033[36m' + filename + '/\033[39m');
            } else {
                console.log('    ' + i + '    \033[90m' + filename + '\033[39m');
            }
            // 自加，为下一个文件或目录做准备
            i++;
            if (i == files.length) {
                read();
            } else {
                // 展示下一个目录或者文件
                showFile(i);
            }
        })
    }
    function read() {
        // 如果所有文件都处理完毕，提醒用户进行选择
        console.log('');
        // process.stdout.write 无需换行，让用户可以直接在提示语后进行输入
        stdout.write('    \033[33m输入你的选择：\033[39m');
        // 等待用户输入
        stdin.resume();
        // 设置流编码为utf-8，这样就能支持特殊字符了
        stdin.setEncoding('utf8');
        // 读取用户输入后，接下来要做的就是根据用户输入做相应处理。用户需要选择要读取的选项
        // 代码层面，我们设置了stdin的编码后，就开始监听其data事件
        stdin.on('data', option);
    }
    function option(data) {
        // 取到用户选择的文件
        var filename = files[Number(data)];
        // data 是用户输入的 选项
        // 检查用户输入是否匹配files数组中的下标，注意，我们将utf8编码的字符串类型data转化为Number类型来方便做检查
        if (!filename) {
            stdout.write('    \033[31m 输入你的选择：\033[39m');
        } else {
            // 将流暂停（回到默认状态）,以便于之后做完fs操作后，程序能够顺利退出
            stdin.pause();
            if (stats[Number(data)].isDirectory()) {
                fs.readdir(__dirname + '/' + filename, function (err, files) {
                    console.log('');
                    console.log('    (' + files.length + ' files)');
                    files.forEach(function (file) {
                        console.log('    -  ' + file);
                    });
                    console.log('');
                })
            } else {
                fs.readFile(__dirname + '/' + filename, 'utf8', function (err, data) {
                    console.log('');
                    // 正则表达式辅助添加一些缩进，将文件内容进行输出
                    console.log('\033[90m' + data.replace(/(.*)/g, '    $1') + '\033[39m');
                })
            }
        }
    }
    showFile(0);
});