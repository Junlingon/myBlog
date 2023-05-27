---
title: React项目中使用Echart
description: 记录 && 总结
date: 2023-05-27
random: 3D
tags:
    - REACT
---


`数据可视化在前端开发中经常会遇到，前段时间开发工作中接到了一个图表展示的小需求，只对echart有所耳闻的我在摸索中完成了需求，下面一些笔记可供参考`

# 第一步:安装下载echart

```scss
 
npm install echart
npm install --save echarts-for-react
npm install echarts --save //如果有报错找不到echarts模块，需要在安装一下exharts'
```

# 第二步：引入模块和组件

```javascript
 
import React from 'react';
import ReactEcharts from 'echarts-for-react';
```

```
 
目录结构：

 MetaHivdeail
   Charts.jsx
   index.js
```

# 第三步：使用

index.js 文件 引入charts,并拿到接口返回的数据data

```javascript
 
import Charts from './Charts';


{
                    label: '分区信息',
                    value: 'partition',
                    type: 'children',
                    body: () => (
                        <>
                            <BSFormAndTable {...formAntTableConfig}></BSFormAndTable>
                            <Charts data={data} />
                        </>
                    ),
                },
```

charts.jsx 文件 配置echart选项

```javascript
 
import React from 'react';
import ReactEcharts from 'echarts-for-react';
function App(props) {
    const { data } = props;
                                             //用 option 描述 `数据`、`数据如何映射成图形`、`交互行为` 等
                                             //option 是个大的 JavaScript 对象
    const option = {
        color:'red'                         //修改图表系列颜色
        backgroudColor:'blue'               //修改图表背景颜色
        title: {                           //标题
            text: '分区行数监控',
            x:'center',
            textStyle:{
                 color:'yellow'
             }
        },
        tooltip: {                          //鼠标移入时的提示信息
            trigger: 'axis',
        },
        grid: {                            //位置
            left: '2%',
            right: '4%',
            bottom: '3%',
            containLabel: true,            //是否显示各种标签刻度
        },
        legend: {                          //图例
        data: ['蒸发量', '降水量', '平均温度']
         },
        xAxis: {                          //直角坐标系 X 轴
            type: 'category',             //坐标轴类型 'value' 数值轴，适用于连续数据; 
                                                     //'category' 类目轴，适用于离散的类目数据
                                                     //'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。
                                                     //'log' 对数轴。适用于对数数据
                                                     
            boundaryGap: false,          //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                                         //类目轴中 boundaryGap 可以配置为 true 和 false。
                                         //默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
                                         //非类目轴，包括时间，数值，对数轴，boundaryGap是一个两个值的数组，
                                         //分别表示数据最小值和最大值的延伸范围，可以直接设置数值或者相对的百分比，在设置 min 和 max 后无效。 示例：
                                         //boundaryGap: ['20%', '20%']
                                         
            data: data.map(({ part }) => part),//数据
            axisLabel: {
                interval: 0,             // 坐标轴刻度标签的显示间隔，在类目轴中有效
                                        //默认会采用标签不重叠的策略间隔显示标签
                                        //可以设置成 0 强制显示所有标签
                                        //如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推
                                        //可以用数值表示间隔的数据，也可以通过回调函数控制。回调函数格式如下：
                                          //(index:number, value: string) => boolean
                                          //第一个参数是类目的 index，第二个值是类目名称，如果跳过则返回 false
                                        
                rotate: 60,               //刻度标签旋转的角度,旋转的角度从 -90 度到 90 度
            },
            axisLine：{                  //修改x轴上字体颜色
                color:'red',
            }
            axisTick: {
                alignWithLabel: false,  //保证刻度线和标签对齐
            },
        },
        yAxis: {                       //直角坐标系 Y 轴
            type: 'value',
            offset: 10,
            axisLine：{                //修改y轴上字体颜色
                color:'red',
            }
        },
        series: [                      //图表数据
            {
                name: 'rows',
                type: 'bar',         //图表类型 line（折线图）、bar（柱状图）、pie（饼图）、scatter（散点图）、graph（关系图）、tree（树图）、
                barWidth: '10%',
                data: data.map(({ rows }) => rows),//图表中的数据
            },
            {
                name: 'rows',
                type: 'line',
                data: data.map(({ rows }) => rows),
            },
        ],
    };

    return (
        <div>
            <ReactEcharts option={option} />
        </div>
    );
}

export default App;
```

## 官网用例

```css
 
// 用 option 描述 `数据`、`数据如何映射成图形`、`交互行为` 等。
// option 是个大的 JavaScript 对象。
var option = {
    // option 每个属性是一类组件。
    legend: {...},
    grid: {...},
    tooltip: {...},
    toolbox: {...},
    dataZoom: {...},
    visualMap: {...},
    // 如果有多个同类组件，那么就是个数组。例如这里有三个 X 轴。
    xAxis: [
        // 数组每项表示一个组件实例，用 type 描述“子类型”。
        {type: 'category', ...},
        {type: 'category', ...},
        {type: 'value', ...}
    ],
    yAxis: [{...}, {...}],
    // 这里有多个系列，也是构成一个数组。
    series: [
        // 每个系列，也有 type 描述“子类型”，即“图表类型”。
        {type: 'line', data: [['AA', 332], ['CC', 124], ['FF', 412], ... ]},
        {type: 'line', data: [2231, 1234, 552, ... ]},
        {type: 'line', data: [[4, 51], [8, 12], ... ]}
    }]
};
```

## 可优化点

`实时数据展示

```
 
 传统定时器 .  每间隔两秒执行请求数据的操作

 websocket
```

图表响应式处理

window.resize=function(){ mychart.resize() }`
