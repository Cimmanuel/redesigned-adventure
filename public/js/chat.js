const socket = io()

const chatForm = document.querySelector('#message-form')
const messageContent = document.querySelector('input')
const locationButton = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
})

chatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const message = event.target.elements.message.value
    socket.emit('sendMessage', message)
})

locationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition(({coords} = {}) => {
        locationObject = {
            latitude: coords.latitude,
            longitude: coords.longitude
        }
        socket.emit('sendLocation', locationObject)
    })
})