var userName = document.getElementById('userName');
var client = $('#online_client');
var send = $('#send');
var text = $('#text');
var room = $('#topR');
var title = $('#title');
var middle = $('#middle');
var sign = $('#signOut');
var backroom = $('#backroom');
var tempText = '聊天室';

//根据cookie获取当前用户名
function getCookie(name) {
    var strCookie = document.cookie;
    console.log(strCookie);
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return "";
}

var uname = getCookie('userName');
console.log(uname);
userName.innerHTML = uname;

//点击发送，触发事件
function sendMsg() {
    var msg = text.val();
    console.log(msg);
    socket.send(msg, tempText);
}

$(function () {
    //建立websocket连接
    socket = io.connect('http://localhost:8081');
    
    //监听‘login’事件
    socket.on('login', function (users) {
        //动态添加在线用户
        var str = "";
        for (var i = 0; i < users.length; i++) {
            str += '<div style="background-color:#7B7B7B" class="user" id="user_' + i + '">' + users[i] + '</div>';
        }
        client[0].innerHTML = str;
        socket.emit('new user', uname);
    })
    //动态显示信息
    socket.on('all', function (text) {
        var p = '<p>' + text + '</p>';
        middle.append(p);
    });
    //点击某个在线用户时，获取到被点击的该元素
    client.on('click', '.user', function () {
        middle[0].innerHTML = "";
        var index = $(this).index();
        tempText = $(this).text();
        title[0].innerHTML = tempText;
        console.log($(this).text());

    })
    //监听收到信息
    socket.on('receive', function (rname, sname, msg) {
        console.log(rname, sname, uname);
        var tip = '<div id="sender" style="background-color:blue;">点我：' + sname + '给你发消息啦</div>';
        room.append(tip);
        room.on('click', '#sender', function () {
            tempText = sname;
            $(this).hide();
            title[0].innerHTML = sname;
            var p = '<p>' + msg + '</p>';
            middle.append(p);
        })
    })
    //点击聊天室时返回
    backroom.click(function () {
        title[0].innerHTML = '聊天室';
        tempText = '聊天室';
    })
    // 监听中途的成员离开
    socket.on('user left', function (data) {
        console.log(data + '离开');

    });
    //点击退出
    sign.click(function () {
        socket.emit('disconnect');
    })
})