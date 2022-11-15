import WxCanvas from './wx-canvas';
import * as echarts from './echarts.min';

let ctx;
let that;
let chart;

function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }
    return 0
}

Component({
    properties: {
        canvasId: {
            type: String,
            value: 'ec-canvas'
        },
        forceUseOldCanvas: {
            type: Boolean,
            value: false
        },
        type: {
            type: String,
            value: 'bar'
        },
        data: {
            type: Object,
        }
    },
    observers: {
        'data': function(data) {
            if(chart) {
                chart.setOption(this.handleOption(this.properties.type, this.properties.data));
            }
        },
    },
    data: {
        isUseNewCanvas: false,
        ec: {
            onInit: null
        },
        demo: 1
    },

    ready: function () {
        // Disable prograssive because drawImage doesn't support DOM as parameter
        // See https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.drawImage.html
        echarts.registerPreprocessor(option => {
            if (option && option.series) {
                if (option.series.length > 0) {
                    option.series.forEach(series => {
                        series.progressive = 0;
                    });
                }
                else if (typeof option.series === 'object') {
                    option.series.progressive = 0;
                }
            }
        });

        if (!this.data.ec) {
            console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" '
                + 'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
            return;
        }

        if (!this.data.ec.lazyLoad) {
            this.init();
        }

        // 生成图表
        this.setData({
            [`ec.onInit`]: this.initChart
        })
        that = this;
    },

    methods: {
        // 自增方法
        initChart(canvas, width, height, dpr) {
            console.log(arguments);
            chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
            });
            canvas.setChart(chart);
            const { type, data } = that.properties;

            console.log(type, data, "233");
            chart.setOption(that.handleOption(type, data));
            return chart;
        },
        handleOption(type, data) {
            let option;
            let {
                backgroundColor,
                legend,
                xAxis,
                yAxis,
                series,
            } = data;

            // 饼图
            let optionPie = {
                backgroundColor: backgroundColor || 'rgba(255,255,255,0.8)',
                tooltip: {
                    trigger: 'item'   // 折线和柱状图用 axis
                },
                legend: {//显示图例
                    show: legend?.show || true,
                    top: legend?.top || '5%',    // 图例的绝对定位高度位置,可修改看看效果
                    left: 'center'
                },
                series: [{
                    label: {
                        normal: {
                            fontSize: 14
                        }
                    },

                    type: 'pie',
                    center: series?.center || ['50%', '60%'],//位置
                    radius: series?.radius || ['20%', '30%'],//圈大小

                    data: series?.data || [
                        {//每一项
                            value: 3,
                            name: '数字农业 3个'
                        }, {
                            value: 2,
                            name: '体育产业 2个'
                        }, {
                            value: 7,
                            name: '乡村新业态 7个'
                        }, {
                            value: 3,
                            name: '其他产业 3个'
                        }
                    ]
                }]
            };

            // 柱状图
            let optionBar = {
                backgroundColor: backgroundColor || 'rgba(255,255,255,0.8)',
                xAxis: {
                    type: xAxis?.type || 'category',
                    data: xAxis?.data || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: yAxis?.type || 'value'
                },
                series: [
                    {
                        data: series?.data || [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar'
                    }
                ]
            };

            // 折线图
            let optionLine = {
                backgroundColor: backgroundColor || 'rgba(255,255,255,0.8)',
                xAxis: {
                    type: xAxis?.type || 'category',
                    data:  xAxis?.data || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: yAxis?.type || 'value'
                },
                series: [
                    {
                        data: series?.data || [150, 230, 224, 218, 135, 147, 260],
                        type: 'line',
                        smooth: series?.smooth || true
                    }
                ]
            };

            switch (type) {
                case 'bar':
                    option = optionBar;
                    break;
                case 'pie':
                    option = optionPie;
                    break;
                case 'line':
                    option = optionLine;
                    break;
                default:
                    option = optionBar;
                    break;
            }
            return option
        },
        // 自增方法end
        init: function (callback) {
            const version = wx.getSystemInfoSync().SDKVersion

            const canUseNewCanvas = compareVersion(version, '2.9.0') >= 0;
            const forceUseOldCanvas = this.data.forceUseOldCanvas;
            const isUseNewCanvas = canUseNewCanvas && !forceUseOldCanvas;
            this.setData({ isUseNewCanvas });

            if (forceUseOldCanvas && canUseNewCanvas) {
                console.warn('开发者强制使用旧canvas,建议关闭');
            }

            if (isUseNewCanvas) {
                // console.log('微信基础库版本大于2.9.0，开始使用<canvas type="2d"/>');
                // 2.9.0 可以使用 <canvas type="2d"></canvas>
                this.initByNewWay(callback);
            } else {
                const isValid = compareVersion(version, '1.9.91') >= 0
                if (!isValid) {
                    console.error('微信基础库版本过低，需大于等于 1.9.91。'
                        + '参见：https://github.com/ecomfe/echarts-for-weixin'
                        + '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82');
                    return;
                } else {
                    console.warn('建议将微信基础库调整大于等于2.9.0版本。升级后绘图将有更好性能');
                    this.initByOldWay(callback);
                }
            }
        },

        initByOldWay(callback) {
            // 1.9.91 <= version < 2.9.0：原来的方式初始化
            ctx = wx.createCanvasContext(this.data.canvasId, this);
            const canvas = new WxCanvas(ctx, this.data.canvasId, false);

            echarts.setCanvasCreator(() => {
                return canvas;
            });
            // const canvasDpr = wx.getSystemInfoSync().pixelRatio // 微信旧的canvas不能传入dpr
            const canvasDpr = 1
            var query = wx.createSelectorQuery().in(this);
            query.select('.ec-canvas').boundingClientRect(res => {
                if (typeof callback === 'function') {
                    this.chart = callback(canvas, res.width, res.height, canvasDpr);
                }
                else if (this.data.ec && typeof this.data.ec.onInit === 'function') {
                    this.chart = this.data.ec.onInit(canvas, res.width, res.height, canvasDpr);
                }
                else {
                    this.triggerEvent('init', {
                        canvas: canvas,
                        width: res.width,
                        height: res.height,
                        canvasDpr: canvasDpr // 增加了dpr，可方便外面echarts.init
                    });
                }
            }).exec();
        },

        initByNewWay(callback) {
            // version >= 2.9.0：使用新的方式初始化
            const query = wx.createSelectorQuery().in(this)
            query
                .select('.ec-canvas')
                .fields({ node: true, size: true })
                .exec(res => {
                    const canvasNode = res[0].node
                    this.canvasNode = canvasNode

                    const canvasDpr = wx.getSystemInfoSync().pixelRatio
                    const canvasWidth = res[0].width
                    const canvasHeight = res[0].height

                    const ctx = canvasNode.getContext('2d')

                    const canvas = new WxCanvas(ctx, this.data.canvasId, true, canvasNode)
                    echarts.setCanvasCreator(() => {
                        return canvas
                    })

                    if (typeof callback === 'function') {
                        this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr)
                    } else if (this.data.ec && typeof this.data.ec.onInit === 'function') {
                        this.chart = this.data.ec.onInit(canvas, canvasWidth, canvasHeight, canvasDpr)
                    } else {
                        this.triggerEvent('init', {
                            canvas: canvas,
                            width: canvasWidth,
                            height: canvasHeight,
                            dpr: canvasDpr
                        })
                    }
                })
        },
        canvasToTempFilePath(opt) {
            if (this.data.isUseNewCanvas) {
                // 新版
                const query = wx.createSelectorQuery().in(this)
                query
                    .select('.ec-canvas')
                    .fields({ node: true, size: true })
                    .exec(res => {
                        const canvasNode = res[0].node
                        opt.canvas = canvasNode
                        wx.canvasToTempFilePath(opt)
                    })
            } else {
                // 旧的
                if (!opt.canvasId) {
                    opt.canvasId = this.data.canvasId;
                }
                ctx.draw(true, () => {
                    wx.canvasToTempFilePath(opt, this);
                });
            }
        },

        touchStart(e) {
            if (this.chart && e.touches.length > 0) {
                var touch = e.touches[0];
                var handler = this.chart.getZr().handler;
                handler.dispatch('mousedown', {
                    zrX: touch.x,
                    zrY: touch.y,
                    preventDefault: () => { },
                    stopImmediatePropagation: () => { },
                    stopPropagation: () => { }
                });
                handler.dispatch('mousemove', {
                    zrX: touch.x,
                    zrY: touch.y,
                    preventDefault: () => { },
                    stopImmediatePropagation: () => { },
                    stopPropagation: () => { }
                });
                handler.processGesture(wrapTouch(e), 'start');
            }
        },

        touchMove(e) {
            if (this.chart && e.touches.length > 0) {
                var touch = e.touches[0];
                var handler = this.chart.getZr().handler;
                handler.dispatch('mousemove', {
                    zrX: touch.x,
                    zrY: touch.y,
                    preventDefault: () => { },
                    stopImmediatePropagation: () => { },
                    stopPropagation: () => { }
                });
                handler.processGesture(wrapTouch(e), 'change');
            }
        },

        touchEnd(e) {
            if (this.chart) {
                const touch = e.changedTouches ? e.changedTouches[0] : {};
                var handler = this.chart.getZr().handler;
                handler.dispatch('mouseup', {
                    zrX: touch.x,
                    zrY: touch.y,
                    preventDefault: () => { },
                    stopImmediatePropagation: () => { },
                    stopPropagation: () => { }
                });
                handler.dispatch('click', {
                    zrX: touch.x,
                    zrY: touch.y,
                    preventDefault: () => { },
                    stopImmediatePropagation: () => { },
                    stopPropagation: () => { }
                });
                handler.processGesture(wrapTouch(e), 'end');
            }
        }
    }
});

function wrapTouch(event) {
    for (let i = 0; i < event.touches.length; ++i) {
        const touch = event.touches[i];
        touch.offsetX = touch.x;
        touch.offsetY = touch.y;
    }
    return event;
}

function getOptionPie(data) {
    let option;
    let {
        bgColor
    } = data;

    option = {

    };
    return option;
}

