const net = require('net')
const Stick = require('stickpackage').stick;
//const stick = new Stick(1024).setReadIntBE('16')
const HEAD_LEN = 2



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
var clientList = {};
/**
 * 释放连接资源
 */
function freeConn(conn) {
    delete clientList[conn.uname];
    conn.timer && clearInterval(conn.timer);
    conn.destroy();
}

function addCoon(conn, name) {
    conn.uname = name;
    clientList[name] = conn;
    conn.timer = setInterval(() => {
        // 发送心跳信息
        // 测试 freeConn(conn);
    }, 3000);
}

function sendMsg(conn, data) {
    if (!conn.writable)  freeConn(conn); //防止超时，没有收到end包
    conn.write(data);
}
var u = 0;

const tcp_server = net.createServer({ allowHalfOpen: false }, function (socket) {
    //连接成功进入
    //socket.write("hello,i'm server!");
    console.log('client connnet', Object.keys(clientList).length);
    addCoon(socket, u++);

    socket.on('data', function (data) {
        console.log("Dat", data, data.length);
        console.log("================");
    })

    socket.on('close', function (error) {
        console.log('client close');
        freeConn(socket);
    })

    socket.on('error', function (error) {
        console.log(`error:客户端异常断开: ${error}`)
    })

    socket.on('end', function (error) {
        console.log('client end');
        socket.destroy();
    })

    
})

tcp_server.on('error', function (err) {
    throw err
})
tcp_server.listen(8081, function () {
    console.log('tcp_server listening on 8081')
})
console.log('ok');