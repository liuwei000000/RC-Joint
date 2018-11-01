const net = require('net')
const Stick = require('stickpackage').stick;
//const stick = new Stick(1024).setReadIntBE('16')
const HEAD_LEN = 2

var sockets = {};

function data_process(data) {
    const head = new Buffer(HEAD_LEN)
    /*
      copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
      targetBuffer - 要拷贝的 Buffer 对象。
      targetStart - 数字, 可选, 默认: 0
      sourceStart - 数字, 可选, 默认: 0
      sourceEnd - 数字, 可选, 默认: buffer.length
    */
    data.copy(head, 0)
    const l = head.readInt16BE();
    console.log('data.length:' + l);
    const body = new Buffer(l)
    console.log('D:', data)
    data.copy(body, 0, HEAD_LEN, HEAD_LEN + l)
    console.log('DD:', body)
}

const tcp_server = net.createServer(function (socket) {
    //连接成功进入
    //socket.write("hello,i'm server!");
    console.log('客户端：connnet');
    socket.stick = new Stick(1024).setReadIntBE('16')
    socket.stick.onData(data_process)

    socket.on('data', function (data) {
        console.log("Dat", data)
        //socket.stick.putData(data)
    })

    socket.on('close', function (error) {
        console.log('client disconnected')
    })

    socket.on('error', function (error) {
        console.log(`error:客户端异常断开: ${error}`)
    })
})

tcp_server.on('error', function (err) {
    throw err
})
tcp_server.listen(8080, function () {
    console.log('tcp_server listening on 8080')
})
console.log('ok');