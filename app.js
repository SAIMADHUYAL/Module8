const express = require('express');
const path = require('path');
//const http = require('http');
const port = process.env.PORT || 3000;

const app = express();
//app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

// const server = http.createServer(app).listen(app.get('port'), () => {
//     console.log("Express server listening on port " + app.get('port'));
// });
// const io = require('socket.io').listen(server);

const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = []

//chat box working
http.listen(port, (err) => {
	if (err)
		throw err;
	console.log(`Listening on port ${port}...`);
});
// connection event
// socket represents each client connected to our server
io.on('connection',  (socket) => {

    socket.on('connect', ()=>{
        console.log("New connection socket.id : ", socket.id)
    })

    socket.on('disconnect', ()=>{
        console.log("disconnect => nickname : ", socket.nickname)
        const updatedUsers = users.filter(user => user != socket.nickname)
        console.log("updatedUsers : ", updatedUsers)
        users = updatedUsers
        io.emit('userlist', users)
    })

    // nick event
    socket.on('nick', (nickname) => {
        console.log("nick => nickname : ", nickname)
        socket.nickname = nickname
        users.push(nickname)

        console.log("server : users : ", users)
        // emit userlist event to all connected sockets
        io.emit('userlist', users);
    });

    // chat event
    socket.on('chat', (data) => {
        console.log("chat => nickname : ", socket.nickname)
        const d = new Date()
        const ts = d.toLocaleString()
        console.log("ts : ", ts)
        const response = `${ts} : ${socket.nickname} : ${data.message}`
        console.log("rs : ", response)
        io.emit('chat', response)
    });
});