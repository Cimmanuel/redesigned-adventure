const socket = io()

const chatForm = document.querySelector('#message-form')
const messageContent = document.querySelector('input')

socket.on('message', (message) => {
    console.log(message)
})

chatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const message = event.target.elements.message.value
    socket.emit('sendMessage', message)
})
