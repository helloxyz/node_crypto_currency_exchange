const WebSocket = require('ws')
const crypto = require('crypto')

var SocksProxyAgent = require('socks-proxy-agent')
var proxy = 'socks://127.0.0.1:1080'
var agent = new SocksProxyAgent(proxy)
var ws
var callbackList = {}
var subscribedChannel = []
var waitingSubscribeChannel = []
var isSocketConnected = false
var pingTimer

function initWebSocket(isReconnect, onOpen, auth) {
    clearInterval(pingTimer)
    ws = new WebSocket('wss://www.bitmex.com/realtime', {
        agent: agent
    })
    ws.on('open', function () {
        // console.log('Bitmex webSocket connected.')
        let nonce = (new Date).getTime()
        let signature = crypto.createHmac('sha256', auth.apiSecret).update('GET' + '/realtime' + nonce + '').digest('hex')
        ws.send(JSON.stringify({
            op: 'authKey',
            args: [auth.apiKey, nonce, signature]
        }))
        isSocketConnected = true
        if (isReconnect) {
            if (subscribedChannel && subscribedChannel.length > 0) {
                ws.send(JSON.stringify({
                    op: 'subscribe',
                    args: subscribedChannel
                }))
            }
        } else {
            if (waitingSubscribeChannel && waitingSubscribeChannel.length > 0) {
                ws.send(JSON.stringify({
                    op: 'subscribe',
                    args: waitingSubscribeChannel
                }))
                // ws.send('help')
            }
        }
        pingTimer = setInterval(() => {
            if (isSocketConnected) {
                ws.send('ping')
            }
        }, 30 * 1000)
        if (typeof onOpen === 'function') {
            onOpen()
        }
    })

    ws.on('close', () => {
        // console.log('Bitmex webSocket disconnected.')
        isSocketConnected = false
        initWebSocket(true)
    })

    ws.on('error', (err) => {
        // console.log('Bitmex webSocket emit error: ' + err)
        isSocketConnected = false
        initWebSocket(true)
    })

    ws.on('message', function (data) {
        if (!data) return
        try {
            if (data === 'pong') return
            parseData = JSON.parse(data)
            if (parseData && parseData.data && Array.isArray(parseData.data) && parseData.data.length > 0 && parseData.table) {
                var channel = parseData.table
                var symbol = parseData.data[0].symbol
                if (callbackList[channel]) {
                    for (var cb of callbackList[channel]) {
                        cb(parseData.data)
                    }
                }
                var name = channel + ':' + symbol
                if (callbackList[name]) {
                    for (var cb of callbackList[name]) {
                        cb(parseData.data)
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
            ws.send(JSON.stringify({
                op: 'subscribe',
                args: [channel]
            }))
        } else {
            if (waitingSubscribeChannel.indexOf(channel) < 0) {
                waitingSubscribeChannel.push(channel)
            }
        }
    }
}

exports.initialize = initWebSocket
exports.subscribe = subscribe