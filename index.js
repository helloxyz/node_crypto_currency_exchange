var okex = require('./okex')
var bitmex = require('./bitmex')
const MD5 = require('./lib/MD5').MD5

exports.BitmexWS = require('./bitmexWS')
exports.OkexWS = require('./okexWS')

exports.GetTicker = function (exchange) {
    var args = handleArgs.apply(this, arguments)
    if (exchange === 'okex') {
        okex.GetTicker.apply(okex, args)
    } else if (exchange === 'bitmex') {
        bitmex.GetTicker.apply(bitmex, args)
    }
}

exports.GetPosition = function (exchange) {
    var args = handleArgs.apply(this, arguments)
    if (exchange === 'okex') {
        okex.GetPosition.apply(okex, args)
    } else if (exchange === 'bitmex') {
        bitmex.GetPosition.apply(bitmex, args)
    }
}

exports.GetOrderDepth = function (exchange) {
    var args = handleArgs.apply(this, arguments)
    if (exchange === 'okex') {
        okex.GetOrderDepth.apply(okex, args)
    } else if (exchange === 'bitmex') {
        bitmex.GetOrderDepth.apply(bitmex, args)
    }
}

exports.AddOrder = function (exchange) {
    var args = handleArgs.apply(this, arguments)
    if (exchange === 'okex') {
        // okex.GetOrderDepth.apply(okex, args)
    } else if (exchange === 'bitmex') {
        bitmex.AddOrder.apply(bitmex, args)
    }
}

exports.CancelOrder = function (exchange) {
    var args = handleArgs.apply(this, arguments)
    if (exchange === 'okex') {
        // okex.GetOrderDepth.apply(okex, args)
    } else if (exchange === 'bitmex') {
        bitmex.CancelOrder.apply(bitmex, args)
    }
}

exports.CancelAllOrder = function (exchange) {
    var args = handleArgs.apply(this, arguments)
    if (exchange === 'okex') {
        // okex.GetOrderDepth.apply(okex, args)
    } else if (exchange === 'bitmex') {
        bitmex.CancelAllOrder.apply(bitmex, args)
    }
}

exports.GetSign = function (name, params) {
    if (!params || typeof params !== 'object') return null
    if (name === 'okex') {
        var array = []
        var sign = ''
        for (var p in params) {
            if (p !== 'secret_key') {
                array.push(p)
            }
        }
        array.sort()
        for (var i = 0; i < array.length; i++) {
            sign += array[i] + "=" + params[array[i]] + "&"
        }
        sign += 'secret_key=' + params.secret_key
        return MD5(sign)
    }
}

function handleArgs() {
    var args = []
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }
    return args
}