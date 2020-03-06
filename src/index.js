const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessageObject, generateLocationMessageObject } = require('./utils/messages') 
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    // console.log('New WebSocket Connection')

    // Listen for user joining a room
    socket.on('join', ({ username, room }, callback) => {
        const {error, user} = addUser({ id: socket.id, username, room })
        if(error) return callback(error, undefined)

        socket.join(user.room)
        socket.emit('message', generateMessageObject('Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessageObject(`${user.username} joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room, users: getUsersInRoom(user.room)
         })
        callback(undefined, username)
    })

    // Listen for message from the client (form field)
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessageObject(message, user.username))
        callback()
    })
    
    // Listen for location from client
    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessageObject(
            `https://google.com/maps?q=${latitude},${longitude}`, user.username
        ))
        callback()
    })
    
    // Disconnect 
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMessageObject(`${user.username} left the room`))
            io.to(user.room).emit('roomData', {
                room: user.room, users: getUsersInRoom(user.room)
            })
        }
    })
})


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
