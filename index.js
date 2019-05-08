var userName = document.getElementById('name');
// let socket = io('http://127.0.0.1:8081');
function getMsg(){
    socket = io.connect('http://localhost:8081');    
    $.ajax({
        type: 'post',
        url: 'http://127.0.0.1:8081/login',
        data: { name:$('#name').val(), pass:$('#passwd').val()},
        success: function (data) {
            console.log(data);
            //设置cookie
            var exp = new Date();
            exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24); //这里表示保存24小时
            // console.log($('#name').val());
            document.cookie = "userName=" + $('#name').val() + ";expires=" + exp.toGMTString();
            // socket.emit("add",$('#name').val());
            window.location.href = './chat.html';
        },
        error: function (err) {
            console.log(err);
        }
    })
}


