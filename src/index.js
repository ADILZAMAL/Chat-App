const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { genrateMessage }= require('../src/utils/message')
const { addUsers, removeUser, getUser, getUserInRoom } = require('./utils/user')

const app = express()
const server = require('http').createServer(app)
const io = socketio(server);

io.on('connection', (socket)=>{
 

    socket.on('join', ({username, room}, callback)=>{
        const {error, user} = addUsers({id: socket.id, username, room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        io.to(user.room).emit('roomData', {
            room : user.room,
            users: getUserInRoom(user.id)
        })
        io.to(user.room).emit('roomData', {
            room : user.room,
            users: getUserInRoom(user.room)
        })
        socket.emit('message', genrateMessage('Admin', 'Welcome'))
        socket.broadcast.to(user.room).emit('message', genrateMessage(user.username,`${user.username} has joined`));

        callback()
    })

    socket.on('sendMessage',(message, callback)=>{
        const filter = new Filter()
        const { error, user }=getUser(socket.id) 
        if(error){
            return callback(error)
        }
         message = genrateMessage(user.username,message)
        if(filter.isProfane(message.text))
        {
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message', message)
        callback()
    })

    socket.on('sendLocation',(coords, callback)=>{
        const { error, user} = getUser(socket.id)
        if(error){
            callback(error)
        }
        io.to(user.room).emit('locationMessage', genrateMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        
        if(user){
            io.to(user.room).emit('message', genrateMessage(user.username,`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users: getUserInRoom(user.room)
            })
        }

    })
})

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`)
})