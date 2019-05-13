var userName = document.getElementById('name');

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
            exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24); 
            document.cookie = "userName=" + $('#name').val() + ";expires=" + exp.toGMTString();
            window.location.href = './chat.html';
        },
        error: function (err) {
            console.log(err);
        }
    })
}


