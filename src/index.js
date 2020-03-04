const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

const message = 'Welcome!'
io.on('connection', (socket) => {
    console.log('New WebSocket Connection')
    socket.emit('message', message)
    socket.broadcast.emit('message', 'A new user joined the room')

    // Listen for message from the client (form field)
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
    
    // Listen for location from client
    socket.on('sendLocation', ({latitude, longitude} = {}) => {
        io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`)
    })
    
    // Disconnect 
    socket.on('disconnect', () => {
        io.emit('message', 'A user left the room')
    })
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
