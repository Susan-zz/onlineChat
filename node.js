const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
var users = new Array();
var usocket = {};
var username;

app.use(express.static('./'));
app.use('*',function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
    res.header('Content-Type','application/json;charset=utf-8');
    if (req.method == 'OPTIONS') {
      res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
    }
    else {
      next();
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 

app.get('/', function (req, res) {
  res.send('hello world');
});
app.post('/login',function(req,res){
  username = req.body.name;
  users.push(username);
  console.log(users.length);
  console.log(req.body.name);
  res.send(req.body);
});


//WebSocket连接监听
io.on('connection', function (socket) {

  socket.emit("login",users);//通知发出请求的该客户端
  socket.broadcast.emit("login",users);//广播所有客户端
  socket.on('new user', (username) => {//添加用户对应socketid
		if(!(username in usocket)) {
			socket.username = username;
			usocket[username] = socket;
    }
	})

  //监听发送的信息
  socket.on('message',function(msg,uname){
    
    if(uname in usocket){
      usocket[uname].emit('receive',uname,username);  
      usocket[uname].emit('all',msg);
      socket.emit('all',msg);  
    }else{
      io.sockets.emit('all',msg);
    }
    })

    //退出
    socket.on('disconnect', function(){
      if(socket.username in usocket){
        delete(usocket[socket.username]);
        users.splice(users.indexOf(socket.username), 1);
      }
      console.log(users);
      socket.emit("login",users);//通知发出请求的该客户端
      socket.broadcast.emit("login",users);//广播所有客户端
      socket.broadcast.emit('user left',socket.username)
    })
  
});

httpServer.listen(8081, function () {
 
  console.log("server start");
 
});
