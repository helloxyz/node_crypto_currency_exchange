const request = require('request')
var SocksProxyAgent = require('socks-proxy-agent')
var proxy = 'socks://127.0.0.1:1080'
var agent = new SocksProxyAgent(proxy)

exports.GetOrderDepth = GetOrderDepth

function GetOrderDepth(symbol, contract_type, size, merge, callback) {
    symbol = symbol || 'btc_usd'
    contract_type = contract_type || 'quarter',
        size = size || 200
    merge = merge || 0
    var url = 'https://www.okex.com/api/v1/future_depth.do?symbol=' + symbol + '&contract_type=' + contract_type + '&size=' + size + '&merge=' + merge
    request.get({
        url: url,
        agent: agent
    }, function (err, res, body) {
        if (!err && res.statusCode == 200 && body) {
            try {
                var data = JSON.parse(body)
                callback(null, data)
            } catch (error) {
                return callback(error)
            }
        }
        callback(err)
    })
}

function GetOrderDepth(symbol, depth, callback) {
    symbol = symbol || 'BTCUSD'
    depth = depth || 200
    var url = 'https://www.bitmex.com/api/v1/orderBook/L2?symbol=' + symbol + '&depth=' + depth
    request.get({
        url: url,
        agent: agent
    }, function (err, res, body) {
        if (!err && res.statusCode == 200 && body) {
            try {
                var data = JSON.parse(body)
                var result = {
                    bids: [],
                    asks: []
                }
                for (var item of data) {
                    if (item.side == 'Sell') {
                        result.asks.push([item.price, item.size])
                    } else if (item.side == 'Buy') {
                        result.bids.push([item.price, item.size])
                    }
                }
                callback(null, result)
            } catch (error) {
                return callback(error)
            }
        }
        callback(err)
    })
}