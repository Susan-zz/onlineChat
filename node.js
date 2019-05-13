const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
var users = new Array();
var usocket = {};
var username;

//设置静态文件路径
app.use(express.static('./'));
//跨域问题
app.use('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});
//解析中间件，解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//登录接口
app.post('/login', function (req, res) {
  username = req.body.name;
  users.push(username);
  console.log(users.length);
  console.log(req.body.name);
  res.send(req.body);
});


//WebSocket连接监听
io.on('connection', function (socket) {

  //触发事件，传递在线列表
  socket.emit("login", users);
  //广播在线列表给所有客户端
  socket.broadcast.emit("login", users);
  //添加用户对应socketid，用于一对一通信
  socket.on('new user', (username) => {
    if (!(username in usocket)) {
      socket.username = username;
      usocket[username] = socket;
    }
  })

  //监听客户端发送的信息
  socket.on('message', function (msg, uname) {

    if (uname in usocket) {
      usocket[uname].emit('receive', username, msg);
      socket.emit('private', msg);
    } else {
      io.sockets.emit('all', msg,username);
    }
  })

  //退出
  socket.on('disconnect', function () {
    if (socket.username in usocket) {
      delete (usocket[socket.username]);
      users.splice(users.indexOf(socket.username), 1);
    }
    console.log(users);
    socket.emit("login", users);//通知发出请求的该客户端
    socket.broadcast.emit("login", users);//广播所有客户端
    socket.broadcast.emit('user left', socket.username);
  })

});

httpServer.listen(8081, function () {

  console.log("server start");

});
