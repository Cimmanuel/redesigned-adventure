const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessageObject, generateLocationMessageObject } = require('./utils/messages') 

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log('New WebSocket Connection')
    socket.emit('message', generateMessageObject('Welcome!'))
    socket.broadcast.emit('message', generateMessageObject('A new user joined the room!'))

    // Listen for message from the client (form field)
    socket.on('sendMessage', (message, callback) => {
        io.emit('message', generateMessageObject(message))
        callback()
    })
    
    // Listen for location from client
    socket.on('sendLocation', ({latitude, longitude} = {}, callback) => {
        io.emit('locationMessage', generateLocationMessageObject(
            `https://google.com/maps?q=${latitude},${longitude}`   
            ))
        callback()
    })
    
    // Disconnect 
    socket.on('disconnect', () => {
        io.emit('message', generateMessageObject('A user left the room'))
    })
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
