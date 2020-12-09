// var domain = 'http://124.71.179.72:8088';
var domain = 'http://47.98.141.137:8088';
export var createUser = domain + '/create/user';
export var loginUser = domain + '/login';

// 用户账号信息列表
export var getRelations = domain + '/api/get/account/relations';
// 录入账号
export var addAcconut = domain + '/api/create/account';
// 设置账号使用者上限
export var setLimit = domain + '/api/change/limit';
// 充值
export var recharge = domain + '/api/recharge';

// 用户共享账号信息展示
export let getShareAccount = domain + '/api/get/account/users'

// 关闭或开启共享
export let setShareStatus= domain + '/api/change/relation/status'
// 删除用户共享
export let deleteShareAccount= domain + '/api/disable/relation'

// 充值记录
export let getRechargeRecords = domain + '/api/get/account/rechargeRecords'

// 消费记录
export let getConsumeRecords = domain + '/api/get/account/consumeRecords'

// 刷新账号
export let refreshAccount = domain + '/api/refresh/account'


// 管理员查看用户信息列表
export let getUserList = domain + '/api/get/user/list';
// 验证邮箱
export let checkEmail = domain + '/api/verify/emailCode';
// 用户信息
export let userMsg = domain + '/api/get/user/info';


var createUser123123 = function () {

    $.ajax({
        type: "POST",
        url: domain + "/create/user",
        data: JSON.stringify({
            "password": "super1314q",
            "userName": "geekwangc"
        }),
        dataType: "json",
        contentType: "application/json",
        async: true,
        cache: true,
        timeout: 5000,
        success: function (data) { },
        error: function () { },
        complete: function () { }
    });
}

