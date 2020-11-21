var domain = 'http://124.71.179.72:8088';
export var createUser = domain + '/create/user';
export var loginUser = domain + '/login';

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

