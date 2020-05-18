const socket = io()
const messageForm = document.querySelector('form')
const messageFormInput = document.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const shareLocationButton = document.querySelector('#share-location')

//option
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
console.log(username, room)

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
    p1.querySelector('#user-name').textContent =  'some user name'
    p1.querySelector('#time-stamp').textContent = moment(message.createdAt).format('h:mm a')
    const p2 = templateEl.querySelector('.message #p2')
    p2.textContent = message.text
    document.querySelector('#message').appendChild(templateEl)
})

socket.on('locationMessage', (url)=>{
    const shareLocationTemplateEl = document.querySelector('#shareLocation-template').content.cloneNode(true)
    const p1 = shareLocationTemplateEl.querySelector('#p1')
    const a = shareLocationTemplateEl.querySelector('#p2 a')
    p1.querySelector('#user-name').textContent = 'some user name'
    p1.querySelector('#time-stamp').textContent = moment(url.createdAt).format('h:mm a')
    a.textContent = 'My current location'
    a.setAttribute('href', url.text)
    document.querySelector('#message').appendChild(shareLocationTemplateEl)

})

socket.emit('join', {username, room})