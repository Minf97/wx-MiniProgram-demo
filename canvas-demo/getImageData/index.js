import { CanvasApi } from "../utils/canvas"
Page({

    data: {
        rgbColor: "",
        pos: {
            x: 0,
            y: 0
        }
    },
    onLoad() {

        wx.createSelectorQuery()
            .select(`#myCanvas`)
            .fields({ node: true, size: true })
            .exec((res) => {
                // Canvas 对象
                const canvas = res[0].node;
                const ctx = canvas.getContext('2d');

                // 初始化画布大小
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
                ctx.scale(dpr, dpr)
                const gra = ctx.createLinearGradient(0, 0, 150, 0);
                gra.addColorStop(0, "black");
                gra.addColorStop(1, "white");

                // 绘图
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'red';
                ctx.fillRect(20, 20, 100, 100);

                this.setData({
                    canvas: canvas,
                    width: res[0].width,
                    height: res[0].height,
                    ctx,
                    dpr
                })
            })
    },
    timer: 0,
    touchMove({ changedTouches }) {
        let pos = {
            x: changedTouches[0].x,
            y: changedTouches[0].y
        }

        // this.throttle(this.getImageData(pos), 2000);
        let now = Date.now();
        console.log(now - this.timer);
        if(now - this.timer > 50) {
            this.timer = now;
            this.getImageData(pos);
        }else {
            console.log("kkkkk");
        }
    },
    getImageData(pos) {

        let { ctx, dpr } = this.data;
        let imgData = ctx.getImageData(20 * dpr, 20 * dpr, 100 * dpr, 100 * dpr);
        let data = imgData.data;
        var dataIndex = (Math.floor((pos.y - 20) * dpr) * imgData.width + (pos.x - 20) * dpr) * 4;

        let colorArr = [
            data[dataIndex],
            data[dataIndex + 1],
            data[dataIndex + 2],
            Number((data[dataIndex + 3] / 255).toFixed(2)),
        ];

        ctx.putImageData(imgData, 120 * dpr, 120 * dpr);
        let colorStr = JSON.stringify(colorArr);
        colorStr = colorStr.substring(1, colorStr.length - 1);
        this.setData({
            [`pos.x`]: pos.x,
            [`pos.y`]: pos.y,
            rgbColor: `rgba(${colorStr})`
        })
    },
    throttle(fn, delay) {
        let last = 0;
        return function (...args) {
            const now = Date.now();
            if (now - last > delay) {
                last = now;
                fn.apply(this, args);
            }
        }
    },
})