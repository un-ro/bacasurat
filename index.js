var app = require('express')(),
    upload = require('express-fileupload')

var http = require('http').createServer(app)
var io = require('socket.io')(http)
var fs = require('fs')

app.use(upload())

http.listen(7777, () => {
    console.log("Server listen @ http://localhost:7777")
})

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/public/html/client.html')
})

app.post('/', (req, res) =>{

    var uploadedFile = req.files.userFile
    // Move file to folder
    uploadedFile.mv(__dirname+'/public/userText/'+uploadedFile.name)

    // Brodcast file properties to socket
    io.emit('chat', uploadedFile.name)
    io.emit('date', new Date().toString())

    // Read txt file and brodcast it.
    fs.readFile(__dirname + '/public/userText/' + uploadedFile.name, (_e, data) => {
        io.emit('content', data.toString())
    })

    // After Broadcast send client to submit again.
    res.sendFile(__dirname + '/public/html/client.html')
})

// Server route can only accessed by server
app.get('/server', (req, res) => {
    var trustedIps = ['::1']; // Only Server can Access
    var requestIP = req.connection.remoteAddress;
    if(trustedIps.indexOf(requestIP) >= 0) {
        res.sendFile(__dirname + '/public/html/server.html')
    } else {
        res.sendFile(__dirname + '/public/html/noaccess.html')
    }
})