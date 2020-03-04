const generateMessageObject = (text) => {
    const messageObject = {
        text,
        createdAt: new Date().getTime()
    }
    return messageObject
}

const generateLocationMessageObject = (url) => {
    const locationMessageObject = {
        url,
        createdAt: new Date().getTime()
    }
    return locationMessageObject
}

module.exports = {
    generateMessageObject, generateLocationMessageObject
}