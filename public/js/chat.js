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

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, { message })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (mapsURL) => {
    console.log(mapsURL)
    const html = Mustache.render(locationMessageTemplate, { mapsURL })
    messages.insertAdjacentHTML('beforeend', html)
})

chatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    chatFormButton.setAttribute('disabled', 'disabled')
    const message = event.target.elements.message.value
    socket.emit('sendMessage', message, () => {
        chatFormButton.removeAttribute('disabled')
        chatFormInput.value = ''
        chatFormInput.focus()
        console.log('Delivered!')
    })
})

locationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition(({coords} = {}) => {
        locationObject = {
            latitude: coords.latitude,
            longitude: coords.longitude
        }
        socket.emit('sendLocation', locationObject, () => {
            locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})
