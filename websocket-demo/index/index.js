
let websocket = null
Page({
    data: {
        result: [],
    },
    onLoad(options) {
        this.startWebsocket();
    },
    //发送事件
    sendClick() {
        websocket.send({
            data: '客户端发送信息',
            success: res => {
                console.info('客户端发送成功');
            }
        });
    },
    startWebsocket(e) {
        websocket = wx.connectSocket({
            url: 'wss://wss-cn.doiting.com/ws',
        })
        websocket.onOpen(function () {
            console.log("创建连接成功");
        });

        websocket.onMessage(function (e) {
            console.log('收到socket信息', e);
        });
        websocket.onClose(function () {
            console.info('连接关闭成功');
        });
        websocket.onError(function () {
            console.info('连接报错');
        });
    }
})