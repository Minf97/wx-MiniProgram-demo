const app = getApp()

import { CanvasApi } from "../utils/canvas"
Page({
    data: {
        Canvas: {},
        color: "red",
        pos: {
            x: 30,
            y: 0
        }
    },
    onLoad() {
        // this.second();
        let Canvas = new CanvasApi();
        let { color } = this.data;
        console.log(Canvas);
        Canvas.init("myCanvas").then(res => {
            Canvas.initColorBar();
            Canvas.initColorBox(color)

            this.setData({
                Canvas: Canvas
            })
        })
    },
    touchStart({ changedTouches }) {
        let pos = {
            x: changedTouches[0].x,
            y: changedTouches[0].y
        }
    },
    touchMove({ changedTouches }) {
        let pos = {
            x: changedTouches[0].x,
            y: changedTouches[0].y
        }
        let { Canvas } = this.data

        // 在bar区域内
        if (
            pos.x > 0 &&
            pos.x < 20 &&
            pos.y > 0 &&
            pos.y < Canvas.canvas.height
        ) {
            // this.throttle(this.getImageData(pos, "bar"), 200);

            let now = Date.now();
            if (now - this.timer > 50) {
                this.timer = now;
                console.log(this.timer);
                this.getImageData(pos, "bar");
            }
        }

        // 在box区域内
        if (
            pos.x > 30 &&
            pos.x < Canvas.width &&
            pos.y > 0 &&
            pos.y < Canvas.height
        ) {
            // this.throttle(this.getImageData(pos, "box"), 200);

            let now = Date.now();
            
            if(now - this.timer > 80) {
                this.timer = now;
                this.getImageData(pos, "box");
            }
            else if (now - this.timer > 15) {
                // this.timer = now;
                // this.getImageData(pos, "box");
                this.setData({
                    [`pos.x`]: pos.x,
                    [`pos.y`]: pos.y
                })
            }
        }
    },
    touchEnd({ changedTouches }) {
        let pos = {
            x: changedTouches[0].x,
            y: changedTouches[0].y
        }
        let { Canvas } = this.data

        // 在bar区域内
        if (
            pos.x > 0 &&
            pos.x < 60 &&
            pos.y > 0 &&
            pos.y < Canvas.height
        ) {
            let rgba = Canvas.getRgbaAtPoint(pos, "bar");
            let rgbaStr = JSON.stringify(rgba);
            rgbaStr = rgbaStr.substring(1, rgbaStr.length - 1);
            this.setData({
                rgbColor: `rgba(${rgbaStr})`
            })
        }
        console.log(pos, "end");
    },
    timer: 0,
    throttle(fn, delay) {
        let now = Date.now();

        return (...args) => {
            if (now - this.timer > delay) {
                this.timer = now;
                console.log(this.timer);
                fn(args);
            }

        }
    },
    getImageData(pos, str) {
        let { Canvas } = this.data;

        let rgba = Canvas.getRgbaAtPoint(pos, str);
        let rgbaStr = JSON.stringify(rgba);
        rgbaStr = rgbaStr.substring(1, rgbaStr.length - 1);
        this.setData({
            rgbColor: `rgba(${rgbaStr})`,
            [`pos.x`]: pos.x,
            [`pos.y`]: pos.y
        })

        
    },
    second() {
        let that = this;
        wx.createSelectorQuery()
            .select('#myCanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
                // Canvas 对象
                const canvas = res[0].node
                // 渲染上下文
                const ctx = canvas.getContext('2d');

                // Canvas 画布的实际绘制宽高
                const { width, height } = res[0];

                // 3.初始化画布大小
                const dpr = wx.getWindowInfo().pixelRatio;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.scale(dpr, dpr);

                that.fillSquare(canvas, ctx, width, height);
                that.fillImg(canvas, ctx);
                that.animation(canvas, ctx, width, height);
            })
    },
    fillSquare(canvas, ctx, width, height) {
        // 4.进行绘制
        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 绘制红色正方形
        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(10, 10, 50, 50);

        // 绘制蓝色半透明正方形
        ctx.fillStyle = 'rgba(0 ,0, 200, 0.5)';
        ctx.fillRect(30, 30, 50, 50);

    },
    fillImg(canvas, ctx) {
        // 图片对象
        const image = canvas.createImage();
        // 图片加载完成回调
        image.onload = () => {
            // 将图片绘制到 canvas 上
            ctx.drawImage(image, 0, 0)
        }
        // 设置图片src
        image.src = 'https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon64_wx_logo.png'
    },
    canvasToTempFilePath() {
        // 生成图片
        wx.canvasToTempFilePath({
            canvas,
            success: res => {
                // 生成的图片临时文件路径
                const tempFilePath = res.tempFilePath
                console.log(res);
            },
        })
    },
    animation(canvas, ctx, width, height) {
        const startTime = Date.now()

        // 帧渲染回调
        const draw = () => {
            const time = Date.now();
            // 计算经过的时间
            const elapsed = time - startTime;
            // 计算动画位置
            const n = Math.floor(elapsed / 3000);
            const m = elapsed % 3000;
            const dx = (n % 2 ? 0 : 1) + (n % 2 ? 1 : -1) * (m < 2500 ? easeOutBounce(m / 2500) : 1);
            const x = (width - 50) * dx;

            // 渲染
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(x, height / 2 - 25, 50, 50);

            // 注册下一帧渲染
            canvas.requestAnimationFrame(draw)
        }

        draw()
    },

})
