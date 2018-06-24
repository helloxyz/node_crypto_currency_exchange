const request = require('request')
var SocksProxyAgent = require('socks-proxy-agent')
var proxy = 'socks://127.0.0.1:1080'
var agent = new SocksProxyAgent(proxy)
var baseURL = 'https://www.bitmex.com'

exports.GetOrderDepth = GetOrderDepth

function GetOrderDepth(symbol, depth, callback) {
    symbol = symbol || 'BTCUSD'
    depth = depth || 200
    var url = baseURL + '/api/v1/orderBook/L2?symbol=' + symbol + '&depth=' + depth
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

function AddOrder(order, options, callback) {
    if (!order || !options) return
    callback = callback || function () { }


    var apiKey = options.apiKey
    var apiSecret = options.apiSecret

    var verb = 'POST',
        path = '/api/v1/order',
        expires = new Date().getTime() + (60 * 1000)
    data.ordType = data.ordType || "Limit"
    var postBody = JSON.stringify(data);

    var signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

    var headers = {
        'content-type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'api-expires': expires,
        'api-key': apiKey,
        'api-signature': signature
    }

    const requestOptions = {
        headers: headers,
        url: baseURL + path,
        method: verb,
        body: postBody
    }

    request(requestOptions, function (error, response, body) {
        callback(error, response, body)
    })
}