const Stick = require('stickpackage').stick;
const stick = new Stick(1024).setReadIntBE('16')
const HEAD_LEN = 2
/*
*  data1:[0x00, 0x02, 0x66, 0x66]
*  data2:[0x00, 0x04, 0x88, 0x02, 0x11, 0x11]
*/
const data = Buffer.from([0x00, 0x02, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11, 0x11]);
const data_ = Buffer.from([0x11]);
const data2_1 = Buffer.from([0x00, 0x02, 0x00, 0x04, 0x66, 0x66, 0x00, 0x04, 0x88, 0x02, 0x11]);
const data2_2 = Buffer.from([0x11]);


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

stick.onData(data_process);

stick.putData(data);

stick.putData(data_);
stick.putData(data2_2); 