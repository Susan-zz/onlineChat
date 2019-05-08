var userName = document.getElementById('userName');
var client = $('#online_client');
var send = $('#send');
var text = $('#text');
var room = $('#topR');
var title = $('#title');
var middle = $('#middle');
var sign = $('#signOut');
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

function sendMsg(){
    var msg = text.val();
    console.log(msg);
    socket.send(msg,tempText);
}

$(function(){
    var content = text.val();
    //建立websocket连接
    socket = io.connect('http://localhost:8081');
    //收到server的连接确认
    socket.on('login',function(users){
        var str="";
        for(var i=0;i<users.length;i++){
            str += '<p class="user" id="user_' + i + '">' + users[i] + '</p>';
        }
        client[0].innerHTML=str;
        socket.emit('new user',uname);
    })
    socket.on('all',function(text){
        var p = '<p>' + text + '</p>';
        middle.append(p);
    });
    client.on('click','.user',function(){
        middle[0].innerHTML = "";
        var index = $(this).index();
        tempText = $(this).text();
        title[0].innerHTML = tempText;        
        console.log($(this).text());
        
    })
    socket.on('receive',function(rname,sname){
        if(rname == uname){
            middle[0].innerHTML = "";
            title[0].innerHTML = sname;
        }
        console.log(rname,sname,uname);
    })
    // 监听中途的成员离开
	socket.on('user left', function (data) {
		console.log(data+'离开');
		
    });
    sign.click(function(){
        socket.emit('disconnect');
    })
})