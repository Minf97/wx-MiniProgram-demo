// https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.start.html
// 电脑上无法调试，用真机

import { pcm_wav } from "../packages/pcm_to_wav"
const app = getApp();

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const fs = wx.getFileSystemManager()

const options = {
    duration: 600000, //指定录音的时长，单位 ms
    sampleRate: 8000, //采样率
    numberOfChannels: 1, //录音通道数
    encodeBitRate: 16000, //编码码率
    format: 'pcm', //音频格式，有效值 aac/mp3等  
    frameSize: 10,  // 2kb
}

recorderManager.onStart(() => {
    console.log('recorder start')
})
recorderManager.onPause(() => {
    console.log('recorder pause')
})
recorderManager.onStop((res) => {
    console.log('recorder stop', res)
    const { tempFilePath } = res;
    recorderManager.start(options);
    fs.readFile({
        filePath: tempFilePath,
        success: res => {
            let view = pcm_wav(res.data, '8000', '16', '1');
            let dateNow = Date.now();
            fs.writeFile({
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
        }
    })
    innerAudioContext.src = tempFilePath;
})
recorderManager.onFrameRecorded((res) => {
    const { frameBuffer } = res
    let view = pcm_wav(frameBuffer, '8000', '16', '1');
    let dateNow = Date.now();
    fs.writeFile({
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
})

innerAudioContext.autoplay = true;

innerAudioContext.onPlay(() => {
    console.log("audio start");
})
innerAudioContext.onStop(() => {
    console.log("audio stop");
})
Page({
    data: {

    },
    onLoad() {

    },
    start() {
        recorderManager.start(options);
    },
    stop() {
        recorderManager.stop();

    },
    startAudio() {
        innerAudioContext.play();
    },
    stopAudio() {
        innerAudioContext.stop();
    }
})
