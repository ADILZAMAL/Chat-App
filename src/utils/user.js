const users = []

const addUsers = ({id, username, room}) =>{
    username = username.trim().toLowerCase()
    room    = username.trim().toLowerCase()

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
    const index = users.findIndex(users=> users.id===id)
    if(index !==-1)
    {
        return users.splice(index,1).[0]
    }
}