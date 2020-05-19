const users = []

const addUsers = ({id, username, room}) =>{
    username = username.trim().toLowerCase()
    room    = room.trim().toLowerCase()

    //validate the data
    if(!username || !room)
    {
        return {
            error: 'Username and room are required'
        }
    }

    const exitstingUser = users.find(user=> user.room === room && user.username === username)
    if(exitstingUser){
        return {
            error:'Username already exist please choose another username'
        }
    }
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{ return user.id == id})
    if(index !==-1)
    {
        const user = users.splice(index,1)
        //console.log('HEF' ,user[0])
        return user[0]
    }
}

const getUser = (id) =>{
    const user = users.find(user=>user.id === id)
    if(!user)
        return {
            error: 'User not found'
        }
    return user    
}

const getUserInRoom = (room) =>{
    room = room.trim().toLowerCase()
    const userInRoom = users.filter(user=> user.room === room)
    return userInRoom
}

module.exports = {
    addUsers,
    removeUser,
    getUser,
    getUserInRoom
}