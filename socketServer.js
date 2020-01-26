
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var uuidv1 = require('uuid/v1');

io.on('connection', function (socket) {
    socket.on('add user', function (data) {

        socket.uuid = uuidv1();
        socket.username = data.userName;
        socket.photo = data.url;
        aUser = true;
        console.log('newuser:' + data.username);
    });
    socket.on('status', function (status) {
        io.emit('status', { 'userName': socket.username, 'photo': socket.photo, 'status': status });
        console.log('user:' + socket.username + ' status:' + socket.status);
    });
    socket.on('new message', function (message) {
        io.emit('new message', {'color': '','uuid': socket.uuid, 'userName': socket.username, 'photo': socket.photo, 'message': message });
    });
});
io.on('disconnect', () => {
    console.log('user disconnected')
});
http.listen(port, function () {
    console.log('listening on *:' + port);
});


