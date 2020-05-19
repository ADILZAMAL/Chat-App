const socket = io()
const messageForm = document.querySelector('form')
const messageFormInput = document.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const shareLocationButton = document.querySelector('#share-location')

//option
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

messageForm.addEventListener('submit',(event)=>{
    event.preventDefault(true)
    messageFormButton.setAttribute('disabled', 'disabled')
    const message = event.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{
    messageFormButton.removeAttribute('disabled')
    messageFormInput.value = ''
    messageFormInput.focus()
        if(error)
        {
            console.log(error)
        }
        console.log('message delivered!')
    })
    
})



shareLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Please use modern browser')
    }
    shareLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            console.log('Location is shared')
            shareLocationButton.removeAttribute('disabled')    
        }) 
    } )
})



socket.on('message',(message)=>{
    const templateEl = document.querySelector('#message-template').content.cloneNode(true)
    const p1 = templateEl.querySelector('.message #p1')
    p1.querySelector('#user-name').textContent =  message.username
    p1.querySelector('#time-stamp').textContent = moment(message.createdAt).format('h:mm a')
    const p2 = templateEl.querySelector('.message #p2')
    p2.textContent = message.text
    document.querySelector('#message').appendChild(templateEl)
})

socket.on('locationMessage', (message)=>{
    const shareLocationTemplateEl = document.querySelector('#shareLocation-template').content.cloneNode(true)
    const p1 = shareLocationTemplateEl.querySelector('#p1')
    const a = shareLocationTemplateEl.querySelector('#p2 a')
    p1.querySelector('#user-name').textContent =message.username
    p1.querySelector('#time-stamp').textContent = moment(message.username.createdAt).format('h:mm a')
    a.textContent = 'My current location'
    a.setAttribute('href', message.text)
    document.querySelector('#message').appendChild(shareLocationTemplateEl)

})

socket.on('roomData', (({room , users})=>{
    const chatSidebar = document.querySelector('.chat__sidebar')
    const h3 = chatSidebar.querySelector('h3')
    const ul = chatSidebar.querySelector('ul')
    ul.innerHTML = ' ' 
    h3.textContent = room
    users.forEach((user)=>{
        const li = document.createElement('li')
        li.textContent = user.username
        ul.appendChild(li)
    })

})) 

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})