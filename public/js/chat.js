const socket = io()

// Elements
const chatForm = document.querySelector('#message-form')
const chatFormInput = chatForm.querySelector('input')
const chatFormButton = chatForm.querySelector('button')
const locationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

const joinObject = { username, room }

const autoscroll = () => {
    // New message element
    const newMessage = messages.lastElementChild
    // Height of new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin
    // Visible height
    const visibleHeight = messages.offsetHeight
    // Height of messages container
    const containerHeight = messages.scrollHeight
    // Scroll length
    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }
}

socket.on('message', ({ text, username, createdAt }) => {
    // console.log(text)
    const html = Mustache.render(messageTemplate, { 
        message: text, username,
        createdAt: moment(createdAt).format('HH:mm')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', ({ url, username, createdAt }) => {
    // console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        mapsURL: url, username,
        createdAt: moment(createdAt).format('HH:mm')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room, users
    })
    document.querySelector('#sidebar').innerHTML = html
})

chatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    chatFormButton.setAttribute('disabled', 'disabled')
    const message = event.target.elements.message.value
    socket.emit('sendMessage', message, () => {
        chatFormButton.removeAttribute('disabled')
        chatFormInput.value = ''
        chatFormInput.focus()
        // console.log('Delivered!')
    })
})

locationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition(({ coords }) => {
        locationObject = {
            latitude: coords.latitude,
            longitude: coords.longitude
        }
        socket.emit('sendLocation', locationObject, () => {
            locationButton.removeAttribute('disabled')
            // console.log('Location shared!')
        })
    })
})

socket.emit('join', joinObject, (error, username) => {
    // if(username) return console.log(`${username} joined!`)
    if(error) {
        alert(error)
        location.href = '/'
    }
})
