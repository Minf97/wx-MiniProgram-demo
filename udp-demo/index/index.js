
const app = getApp();

const udp = wx.createUDPSocket();

Page({
    data: {

    },
    onLoad() {
        const port = udp.bind();
        console.log("连接成功"+ port + "端口");
        udp.onMessage((res) => {
            console.log(res);
        })
    },
})
