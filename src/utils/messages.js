const generateMessageObject = (text, username='Admin') => {
    const messageObject = {
        text, username,
        createdAt: new Date().getTime()
    }
    return messageObject
}

const generateLocationMessageObject = (url, username='Admin') => {
    const locationMessageObject = {
        url, username,
        createdAt: new Date().getTime()
    }
    return locationMessageObject
}

module.exports = {
    generateMessageObject, generateLocationMessageObject
}
