/**
 * Created by v_songxiaodan on 2015/10/26.
 */
// ����url��ʱ�򣬹���һ�£���-���ģ�����-��¼ҳ
var url = require('url');

module.exports = function (opt) {
    var protectUrlArr = opt.protectedUrl || [];
    var redirectUrl = opt.redirectUrl || '/user/signin';

    return function (req, res, next) {
        var originalUrl = req.originalUrl;
        var urlObj = url.parse(originalUrl);
        function isNeedProtected(pathname) {
            for (var i = 0; i < protectUrlArr.length; i++) {
                if (pathname.indexOf(protectUrlArr[i]) == 0) {
                    return true;
                }
            }
            return false;
        }
        if (isNeedProtected(urlObj.pathname)) {
            res.session.get('username', function (err, username) {
                if (err) {
                    next(err);
                } else {
                    if (username) {
                        next();
                    } else {
                        res.redirect(redirectUrl);
                    }
                }
            })
        } else {
            //var url = req.originalUrl;
            next();
        }
    }
};