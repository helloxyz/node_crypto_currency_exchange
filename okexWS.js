const WebSocket = require('ws')

var SocksProxyAgent = require('socks-proxy-agent')
var proxy = 'socks://127.0.0.1:1080'
var agent = new SocksProxyAgent(proxy)
var ws
var callbackList = {}
var subscribedChannel = []
var waitingSubscribeChannel = []
var isSocketConnected = false
var pingTimer

initWebSocket()
function initWebSocket(isReconnect) {
    clearInterval(pingTimer)
    ws = new WebSocket('wss://real.okex.com:10440/websocket/okexapi', { agent: agent })
    ws.on('open', function () {
        console.log('Okex webSocket connected.')
        isSocketConnected = true
        if (isReconnect) {
            for (var channel of subscribedChannel) {
                ws.send(JSON.stringify({ 'event': 'addChannel', 'channel': channel }))
            }
        } else {
            for (var channel of waitingSubscribeChannel) {
                ws.send(JSON.stringify({ 'event': 'addChannel', 'channel': channel }))
            }
        }
        pingTimer = setInterval(() => {
            if (isSocketConnected) {
                ws.send(JSON.stringify({ 'event': 'ping' }))
            }
        }, 30 * 1000)
    })

    ws.on('close', () => {
        console.log('Okex webSocket disconnected.')
        isSocketConnected = false
        initWebSocket(true)
    })

    ws.on('error', (err) => {
        console.log('Okex webSocket emit error: ' + err)
        isSocketConnected = false
        initWebSocket(true)
    })

    ws.on('message', function (data) {
        if (!data) return
        try {
            parseData = JSON.parse(data)
            if (parseData.event == 'pong') return
            for (var record of parseData) {
                if (record.channel && record.data) {
                    var channel = record.channel
                    if (callbackList[channel]) {
                        for (var cb of callbackList[channel]) {
                            cb(record.data)
                        }
                    }
                }
            }
        } catch (error) {
            console.log('error: ' + error + '  unexpect data: ' + data)
        }
    })
}

function subscribe(channel, parameters, callback) {
    if (!channel || typeof callback != 'function') {
        throw new Error('invalid parameters')
    }

    callbackList[channel] = callback[channel] || []
    callbackList[channel].push(callback)

    if (subscribedChannel.indexOf(channel) < 0) {
        subscribedChannel.push(channel)
        if (isSocketConnected) {
            ws.send(JSON.stringify({ 'event': 'addChannel', 'channel': channel }))
        } else {
            if (waitingSubscribeChannel.indexOf(channel) < 0) {
                waitingSubscribeChannel.push(channel)
            }
        }
    }
}

exports.subscribe = subscribe