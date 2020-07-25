const http = require('http')
const express = require('express')
const cors = require('cors')
const colyseus = require('colyseus')
const monitor = require('@colyseus/monitor').monitor
const socialRoutes = require("@colyseus/social/express").default;

const ChatRoom = require('./ChatRoom')

const port = process.env.PORT || 2567
const app = express()

app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const gameServer = new colyseus.Server({
  server: server,
})

// Expose the "lobby" room.
gameServer.define('lobby', colyseus.LobbyRoom)
// register your room handlers
gameServer.define('chat', ChatRoom).filterBy(['channel', 'id', 'piece_sets'])
app.use(express.static('../dist'))

app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)
