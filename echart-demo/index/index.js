const app = getApp()

Page({
    data: {
        canvas: {
            type: 'line',
            data: {}
        }
    },
    onLoad() {
        // 饼图
        // setTimeout(() => {
        //     this.setData({
        //         [`canvas.data`]: {
        //             series: {
        //                 data: [
        //                     {//每一项
        //                         value: 3,
        //                         name: 'lalallall'
        //                     }, {
        //                         value: 2,
        //                         name: 'xcvxc 2个'
        //                     }, {
        //                         value: 7,
        //                         name: 'wer 7个'
        //                     }, {
        //                         value: 3,
        //                         name: '其rthr 3个'
        //                     }
        //                 ]
        //             }
        //         }
        //     });
        // }, 2000);

        // 柱状图
        // setTimeout(() => {
        //     this.setData({
        //         [`canvas.data`]: {
        //             xAxis: {
        //                 data: ['demo1', 'demo2', 'demo3', 'demo4', 'demo5', 'demo6', 'demo7']
        //             },
        //             series: {
        //                 data: [100, 200, 300, 400, 500, 600, 700]
        //             }
        //         }
        //     });
        // }, 2000);

        // 折线图
        setTimeout(() => {
            this.setData({
                [`canvas.data`]: {
                    xAxis: {
                        data: ['demo1', 'demo2', 'demo3', 'demo4', 'demo5', 'demo6', 'demo7']
                    },
                    series: {
                        data: [100, 200, 300, 400, 500, 600, 700],
                        smooth: false
                    }
                }
            });
        }, 2000);
    },
})
