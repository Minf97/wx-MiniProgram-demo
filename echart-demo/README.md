# echart-weapp组件
基于echart封装，便于在小程序上实现echart数据响应式的组件

## 使用教程
 - 第一步：在页面中引入本组件
 ```json
 // index.json
 {
  "usingComponents": {
      "ec-canvas": "../components/ec-canvas/ec-canvas"
  }
 }
 ```

 - 第二步：在wxml中添加dom节点
 ```html
 // index.wxml
<view class="ec-container">
     <ec-canvas type="{{canvas.type}}" data="{{canvas.data}}"></ec-canvas>
</view>
 ```
 ```css
 // index.wxss
 .ec-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 30vh;
    /* background-color: green; */
}

 ec-canvas {
    width: 90%;
    height: 90%;
 }
 ```

 - 第三步：放入数据，生成对应图表
 ```js
 /**
  * type 图表类型，"pie"饼图 || "bar"柱状图 || "line"折线图
  * data 数据源，具体参照 echart 官网的配置项手册 https://echarts.apache.org/zh/option.html
 */
 
 // 下面给出示例
 // index.wxml
 <view class="ec-container">
     <ec-canvas type="{{canvas.type}}" data="{{canvas.data}}"></ec-canvas>
 </view>

 // index.js
 // 生成饼图
 let canvas = {
     type: "pie",
     data: {
         series: {
             data: [
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
         }
     }
 }
 this.setData({
     canvas: canvas
 })

 // 柱状图
 let canvas = {
     type: 'bar',
     data: {
        xAxis: {
            data: ['demo1', 'demo2', 'demo3', 'demo4', 'demo5', 'demo6', 'demo7']
        },
        series: {
            data: [100, 200, 300, 400, 500, 600, 700]
        }
     }
 }
 this.setData({
     canvas: canvas
 })

 // 折线图
  let canvas = {
     type: 'bar',
     data: {
        xAxis: {
            data: ['demo1', 'demo2', 'demo3', 'demo4', 'demo5', 'demo6', 'demo7']
        },
        series: {
            data: [100, 200, 300, 400, 500, 600, 700],
            smooth: false
        }
     }
 }
 this.setData({
     canvas: canvas
 })
 ```

 ## 组件可接受的有效参数
 ```js
 let canvas = {
     type: "pie" || "bar" || "line",
     data: {
        backgroundColor,  //图表背景颜色
        legend,           //图表头部   
        xAxis,            //横坐标轴 
        yAxis,            //纵坐标轴
        series,           //数据源
     }
 }
 // 具体请参照echart官网配置项 https://echarts.apache.org/zh/option.html
 ```