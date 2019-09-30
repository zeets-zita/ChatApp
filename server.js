const server = require('http').createServer()
const io = require('socket.io')(server)

const ClientManager = require('./server/clientManager')
const ChatroomManager = require('./server/chatroomManager')
const makeHandlers = require('./server/handlers')

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()

const port = 3001;

io.on('connection', function (client) {
  const {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleIsTyping,
    handleGetChatrooms,
    handleGetAvailableUsers,
    handleDisconnect
  } = makeHandlers(client, clientManager, chatroomManager)

  console.log('client connected...', client.id)
  clientManager.addClient(client)

  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('leave', handleLeave)

  client.on('message', handleMessage)

  client.on('isTyping', handleIsTyping)

  client.on('chatrooms', handleGetChatrooms)

  client.on('availableUsers', handleGetAvailableUsers)

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
    handleDisconnect()
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

server.listen(port, function (err) {
  if (err) throw err
  console.log('listening on port ' + port)
})
