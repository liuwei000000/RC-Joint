const net = require('net')
const stick = require('stickpackage')
stick(1024);
var sockets = {};

const tcp_server = net.createServer(function (socket) {
     //连接成功进入
    //socket.write("hello,i'm server!");
    console.log('客户端：已经与服务端建立连接');
    const msgCenter = new stick.msgCenter();
    msgCenter.onMsgRecv(function (data) {
        console.log('recv data: ' + data.toString())
    })

    socket.on('data', function (data) {
        console.log("data", data);
        msgCenter.putData(data)
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