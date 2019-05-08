var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static('./'));
app.listen(3000, function() {
    console.log('web start');
});