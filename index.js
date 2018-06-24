var okex = require('./okex')
var bitmex = require('./bitmex')

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

function handleArgs() {
    var args = []
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }
    return args
}