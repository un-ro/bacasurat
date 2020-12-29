var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var upload = require('express-fileupload')
var fs = require('fs')

var d = new Date()

app.use(upload())
app.io = io

http.listen(7777, () => {
    console.log("Server listen @ http://localhost:7777")
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html')
})

app.post('/', (req, res) =>{
    io.emit('chat', req.files.userFile.name)
    io.emit('date', today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear())
    // fs.readFile(__dirname + '/' + req.files.userFile.name, (e, data) => {
    //     io.emit('chat', data)
    // })
    res.sendFile(__dirname + '/client.html')
})

app.get('/server', (req, res) => {
    res.sendFile(__dirname + '/server.html')
})

io.on('connection', (socket) => {
    console.log("New Connection")
    socket.on('chat', (msg) => {
        io.emit('chat', msg)
    })
})