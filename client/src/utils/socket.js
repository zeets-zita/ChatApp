const io = require('socket.io-client')
export default function() {
    const serverLocalURL = 'http://localhost:'
    const port = 3001;
    const socket = io.connect(serverLocalURL+port)

    function registerHandler(onMessageReceived, onSomeoneIsTypingReceived) {
        socket.on('message', onMessageReceived)
        socket.on('someoneIsTyping', onSomeoneIsTypingReceived)
    }

    function unregisterHandler() {
        socket.off('message')
        socket.off('someoneIsTyping')
    }

    socket.on('error', (err) => {
        console.log('received socket error:', err);
    })

    function register(name, cb) {
        socket.emit('register', name, cb)
    }

    function join(chatroomName, cb) {
        socket.emit('join', chatroomName, cb)
    }

    function leave(chatroomName, cb) {
        socket.emit('leave', chatroomName, cb)
    }

    function message(chatroomName, msg, cb){
        socket.emit('message', {chatroomName, message: msg}, cb)
    }

    function isTyping(chatroomName, isTyping, cb){
        socket.emit('isTyping', {chatroomName, isTyping}, cb)
    }

    function getChatRooms(cb) {
        socket.emit('chatrooms', null, cb)
    }

    function getAvailableUsers(cb) {
        socket.emit('availableUsers', null, cb)
    }

    return {
        register,
        join,
        leave,
        message,
        isTyping,
        getChatRooms,
        getAvailableUsers,
        registerHandler,
        unregisterHandler,
    }
}
