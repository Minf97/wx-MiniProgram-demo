

import { pcm_wav } from "../packages/pcm_to_wav";


const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true;
innerAudioContext.onPlay(() => {
    console.log('开始播放')
})
innerAudioContext.onError((res) => {
    console.log(res.errMsg, res.errCode)
})
innerAudioContext.onPause(
    () => {
        console.log('停止播放')
    }
)

Page({
    data: {
        src: '',
        imageSrc: 'https://wss-cn.doiting.com/swoole/mjpg?session_id=mjpg'
    },
    onLoad(options) {

        // url: 'https://urchin.nosdn.127.net/wecall/700564EB-1111-475C-81A7-148083E40B86.wav',
        wx.downloadFile({
            url: 'https://wss-cn.doiting.com/8k16bit.pcm',
            success: res => {
                this.demo(res.tempFilePath);
            }
        })
    },

    demo(filePath) {
        // 录音录制之后拿到tempFilePath
        const FileSystemManager = wx.getFileSystemManager()
        FileSystemManager.readFile({
            filePath: filePath,
            success: res => {
                console.log(res.data);

                let view = pcm_wav(res.data, '8000', '16', '1');
                let dateNow = Date.now();
                FileSystemManager.writeFile({
                    data: view,
                    filePath: `${wx.env.USER_DATA_PATH}/${dateNow}.wav`,
                    success: res => {
                        // 拿封装好的文件进行操作
                        innerAudioContext.src = `${wx.env.USER_DATA_PATH}/${dateNow}.wav`;
                    },
                    fail: err => {
                        console.log(err, 233);
                    }
                })
            },
            fail: err => {
                console.log(err);
            }
        })
    },

    audioPlay: function () {
        innerAudioContext.play()
    },
    audioPause: function () {
        innerAudioContext.pause()
    }
})