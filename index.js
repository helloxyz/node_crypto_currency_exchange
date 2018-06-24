var okex = require('./okex')
var bitmex = require('./bitmex')

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

function handleArgs() {
    var args = []
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }
    return args
}