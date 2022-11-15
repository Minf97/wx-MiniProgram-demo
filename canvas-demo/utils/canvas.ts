export class CanvasApi {
    public canvas
    public ctx
    public width
    public height
    public dpr
    public imageData

    createCanvas(id) {
        return new Promise((reslove, reject) => {
            wx.createSelectorQuery()
                .select(`#${id}`)
                .fields({ node: true, size: true })
                .exec((res) => {
                    // Canvas 对象
                    const canvas = res[0].node;
                    const ctx = canvas.getContext('2d');
                    console.log(res);

                    this.canvas = canvas;
                    this.width = res[0].width;
                    this.height = res[0].height;
                    this.ctx = ctx;
                    reslove("创建完成")
                })
        })

    }

    initCanvas() {
        return new Promise((reslove, reject) => {
            const dpr = wx.getSystemInfoSync().pixelRatio;
            this.dpr = dpr;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            console.log(`${this.canvas.width} rpx`, `${this.canvas.height} rpx`, `${this.width} px`, `${this.height} px`, dpr);
            this.ctx.scale(dpr, dpr);
            reslove("初始化画布大小")
        })
    }

    /**
     * 进行 canvas 初始化
     * @param id 
     */
    init(id) {
        return this.createCanvas(id).then(() => {
            return this.initCanvas()
        }).catch(err => {
            this.catchErr(err)
        })
    }

    initColorBar() {
        let gradientBar = this.ctx.createLinearGradient(0, 0, 20, this.height);

        gradientBar.addColorStop(0, '#f00');
        gradientBar.addColorStop(1 / 6, '#f0f');
        gradientBar.addColorStop(2 / 6, '#00f');
        gradientBar.addColorStop(3 / 6, '#0ff');
        gradientBar.addColorStop(4 / 6, '#0f0');
        gradientBar.addColorStop(5 / 6, '#ff0');
        gradientBar.addColorStop(1, '#f00');


        this.ctx.fillStyle = gradientBar;
        this.ctx.fillRect(0, 0, 20, this.height);
    }

    initColorBox(color) {
        let ctx = this.ctx;

        // 底色填充，也就是（举例红色）到白色
        var gradientBase = ctx.createLinearGradient(30, 0, this.width, 0);
        gradientBase.addColorStop(1, color);
        gradientBase.addColorStop(0, 'rgba(255,255,255,1)');
        ctx.fillStyle = gradientBase;
        ctx.fillRect(30, 0, this.width, this.height);

        // 第二次填充，黑色到透明
        var my_gradient1 = ctx.createLinearGradient(30, 0, 0, this.height);
        my_gradient1.addColorStop(0, 'rgba(0,0,0,0)');
        my_gradient1.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = my_gradient1;
        ctx.fillRect(30, 0, this.width, this.height);
    }

    getRgbaAtPoint(pos, area) {

        if (area == 'bar') {
            var imgData = this.imageData ? this.imageData : this.ctx.getImageData(0, 0, 20 * this.dpr, this.height * this.dpr);
            var data = imgData.data;
            var dataIndex = (Math.floor(pos.y * this.dpr) * imgData.width + pos.x * this.dpr) * 4;
        } else {
            var imgData = this.imageData ? this.imageData : this.ctx.getImageData(30 * this.dpr, 0, (this.width - 30) * this.dpr, this.height * this.dpr);
            var data = imgData.data;
            var dataIndex = (Math.floor(pos.y * this.dpr) * imgData.width + (pos.x - 30) * this.dpr) * 4;
        }

        return [
            data[dataIndex],
            data[dataIndex + 1],
            data[dataIndex + 2],
            Number((data[dataIndex + 3] / 255).toFixed(2)),
        ]
    }

    catchErr(err) {
        wx.showToast({
            title: err,
            icon: "error",
            duration: 2000
        })
    }
}