const Chatroom = require('./chatroom')
const chatroomDB = require('../db/chatrooms')

module.exports = function () {
  const chatrooms = new Map(
    chatroomDB.map(c => [
      c.name,
      Chatroom(c)
    ])
  )

  function removeClient(client) {
    chatrooms.forEach(c => c.removeUser(client))
  }

  function getChatroomByName(chatroomName) {
    return chatrooms.get(chatroomName)
  }

  function serializeChatrooms() {
    return Array.from(chatrooms.values()).map(c => c.serialize())
  }

  return {
    removeClient,
    getChatroomByName,
    serializeChatrooms
  }
}
