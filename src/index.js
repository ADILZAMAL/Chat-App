const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { genrateMessage }= require('../src/utils/message')

const app = express()
const server = require('http').createServer(app)
const io = socketio(server);

io.on('connection', (socket)=>{
    socket.emit('message', genrateMessage('Welcome'))

    socket.broadcast.emit('message', genrateMessage('A new user has joined'));

    socket.on('sendMessage',(message, callback)=>{
        const filter = new Filter() 
         message = genrateMessage(message)
        if(filter.isProfane(message.text))
        {
            return callback('Profanity is not allowed!')
        }
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation',(coords, callback)=>{
        io.emit('locationMessage', genrateMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect', ()=>{
        io.emit('message', genrateMessage('A user has left chat room'))
    })
})

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`)
})