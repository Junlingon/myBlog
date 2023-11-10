---
title: 移动端适配
description: 要适配移动端和PC端，可以采用响应式设计和自适应设计两种方法。以下是一些建议和技巧：
date: 2023-08-21
random: AI
tags:
    - REACT
---


# 1.什么是移动端适配
**两个概念：**

1. 自适应：根据不同的设备屏幕大小来自动调整尺寸，大小。
2. 响应式：会随着屏幕的实时变动而自动调整，是一种自适应。

# 2.理解视口viewport
## 2.1 PC端的视口
1. 在浏览器中，我们可以看到的区域就是视口（viewport）
2. fixed就是相对于视口来进行定位的。
3. 在PC端的页面中，我们是不需要对视口进行区分，因为我们的布局视口和视觉视口是同一个

## 2.2移动端的视口
在移动端，不太一样，你布局的视口和你可见的视口是不太一样的。

+ 这是因为移动端的网页窗口往往比较小，我们可能会希望一个大的网页在移动端可以完整的显示口
+ 所以在默认情况下，移动端的布局视口是大于视觉视口的;
所以在移动端，我们可以将视口划分为三种情况:

布局视口 (layout viewport)
视觉视口 (visuallayout)
理想视口 (ideallayout)

### 2.2.1 布局视口
默认情况下，PC端的网页在移动端会如何显示？

+ 会按照宽度为980px来布局一个页面的盒子和内容。
+ 为了显示可以完整的显示页面中，对整个页面进行缩小。
我们相对于980px布局的这个视口，称之为布局视口 (layoutviewport) 

布局视口的默认宽度是980px

所以我们没有对项目移动端适配的话在手机打开是会将项目***同比例缩小。**
### 2.2.2 视觉视口 (visual viewport)

 默认情况下，我们按照980px显示内容，那么右侧有一部分区域就会无法显示，所以手机端浏览器会默认对页面进行缩放以显示到用户的可见区域中  那么显示在可见区域的这个视口，就是视觉视口 (visual viewport)

2.2.3理想视口 (ideallayout)
如果所有的网页都按照980px在移动端布局，那么最终页面都会被缩放显示

事实上这种方式是不利于我们进行移动的开发的，我们希望的是设置100px，那么显示的就是100px;

如何做到这一点呢? 通过设置理想视口 (ideal viewport) 


理想视口就是布局视口 === 视觉视口   

反着说就是布局视口 === 视觉视口 就是理想视口  

可以通过meta标签设置布局视口(淘宝网也是这样写法)
```js
<meta name="viewport" content="width=device-width, initial-scale=1.0, 
user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
```
还可以设置别的meta中的viewport;

 | 值	              | 可能的附加值	                        | 描述
 | width            | 	一个正整数，或者字符串device-width	 | 定义 viewport 的宽度。
 | height	          | 一个正整数，或者字符串 device-height	 | 定义 viewport 的高度。未被任何浏览器使用
 | initial-scale	  | 一个0.0和10.0之间的正数	              | 定义设备宽度与 viewport 大小之间的缩放比例
 | maximum-scale	  | 一个0.0和10.0之间的正数	    | 定义缩放的最大值，必须大于等于minimum-scale.否则表现将不可预测。
 | minimum-scale	  | 一个0.0和10.0之间的正数	 | 定义缩放的最小值，必须小于等于 maximum-scale.否则表现将不可预测。
 | user-scalable	  | yes 或者 no	 | 默认为 yes，如果设置为 no，将无法缩放当前页面。浏览器可以忽略此规则


# 3.移动端适配方案
## 3.1  rem单位+动态html的font-size(方案一)
rem单位是相对于html元素的font-size来设置的，那么如果我们需要在不同的屏幕下有不同的尺寸，可以动态的修改html的font-size尺寸。

在开发中，我们只需要考虑两个问题:

* 问题一: 针对不同的屏幕，设置html不同的font-size;
* 问题二: 将原来要设置的尺寸，转化成rem单位;
### 3.1.1第一种方式：媒体查询
可以通过媒体查询来设置不同尺寸范围内的屏幕html的font-size尺寸
```js
<meta name="viewport" content="width=device-width, initial-scale=1.0">
 
    <style>
        /* 媒体查询 */
        @media screen and (min-width:320px) {
            html{
                font-size: 20px;
            }
        }
        @media screen and (min-width:375px) {
            html{
                font-size: 24px;
            }
        } 
        @media screen and (min-width:414px) {
            html{
                font-size: 28px;
            }
        } 
        @media screen and (min-width:480px) {
            html{
                font-size: 32px;
            }
        } 
 
        .box {
            width: 5rem;
            height: 5rem;
            background: #8ec04c;
        }
    </style>
 
 
    <div class="box">
        <p></p>
    </div>
```
@media screen and开头的语句就是媒体查询语句。@media后面是一个或者多个表达式，如果表达式为真，则应用样式。@media screen and (min-width:320px)  这句话的意思就是：设备宽度小于320就选中这个样式。

**媒体查询的缺点:**

1. 我们需要针对不同的屏编写大量的媒体查询
2. 如果动态改变尺寸，不会实时的进行更新

### 3.1.2用js动态获取设备宽度
 如果希望实时改变屏幕尺寸时，font-size也可以实时更改，可以通过js代码:
 方法:

1. 根据html的宽度计算出font-size的大小，并且设置到html上
2. 监听页面的实时改变，并且重新设置font-size的大小到html上
```js
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
        // 1.获取html的元素
        const htmlEl = document.documentElement
 
        function setRemUnit() {
            // 2.获取html的宽度(视口的宽度)
            const htmlWidth = htmlEl.clientWidth
            // 3.根据宽度计算一个html的font-size的大小
            const htmlFontSize = htmlWidth / 10
            // 4.将font-size设置到html上
            htmlEl.style.fontSize = htmlFontSize + "px"
        }
        // 保证第一次进来时, 可以设置一次font-size
        setRemUnit()
 
        // 当屏幕尺寸发生变化时, 实时来修改html的font-size
        window.addEventListener("resize", setRemUnit)
        //跳转的页面计算一下
        window.addEventListener("pageshow",function(e) {
            if(e.persisted) {
                setRemUnit()
            }
         })
    </script>
    <style>
 
        .box {
            width: 5rem;
            height: 5rem;
            background: #8ec04c;
        }
        p{
            font-size: 0.5rem;
        }
    </style>
 
 
    <div class="box">
        <p></p>
    </div>
```
默认font-size:16px,所以一开始不用设置。
  
### 3.1.3 利用第三方库lib-flexible动态font-size
下载地址：<a href='https://github.com/amfe/lib-flexible'>GitHub - amfe/lib-flexible: 可伸缩布局方案</a>

核心代码和上面写js是差不多的，主要他处理一些别的情况，比如屏幕是否支持0.5px,还有页面跳转问题。
```js
<script src="./js/lib_flexible.js"></script>
 
  <style>
    .box {
      width: 5rem;
      height: 5rem;
      background-color: orange;
    }
 
    p {
      font-size: 0.5rem;
    }
  </style>
 
 
  
  <div class="box">
      <p>我是文本</p>
  </div>
```

### 3.1.4 rem单位-px转成rem的方案
上面我们已经解决了动态生成font-size了，但是我们要把px转成rem。
[![odOGao.png](https://vip.helloimg.com/images/2023/11/10/odOGao.png)](https://www.helloimg.com/image/odOGao)
 375px的屏幕font-size就是37.5，100px宽的盒子就是100除以37.5。每一次都要运算。这就很麻烦。

### 3.1.5第一种：手动用计算器算。（不推荐）
比如有一个在375px屏幕上，100px宽度和高度的盒子
我们需要将100px转成对应的rem值:
100/37.5=2.6667，其他也是相同的方法计算即可

### 3.1.6 第三种:postcss-pxtorem 
目前在前端的工程化开发中，我们可以借助于webpack的工具来完成自动的转化;

例如，设计稿375的那就在375上布局写px，之前怎么布局现在就怎么布局。后面打包就会自动修改。

下载插件：`npm i postcss-pxtorem -D`
  
插件官网:https://github.com/cuth/postcss-pxtorem
  
在根目录下新建一个postcss.config.js文件，下面提供了一份基本的 PostCSS 示例配置，可以在此配置的基础上根据项目需求进行修改。
```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*'],
    },
  },
};
```
其他设计稿的可以修改rootValue的值
### 3.1.7 第四种:VSCode插件
px to rem的插件，在编写时自动转化
[![od9yx1.png](https://vip.helloimg.com/images/2023/11/10/od9yx1.png)](https://www.helloimg.com/image/od9yx1)
然后直接打100px就可以看得到，然后选rem就可以了。就不用直接算了。
[![odOBgb.png](https://vip.helloimg.com/images/2023/11/10/odOBgb.png)](https://www.helloimg.com/image/odOBgb)


## 4.2 vw单位 (方案二)
vw单位是相对于视口的。比如375px的屏幕就是1vw==3.752px。

基于375屏幕：
```js
<meta name="viewport" content="width=device-width, initial-scale=1.0">
 
    <style>
        /* 设置给375px的设计稿 */
        /* 1vw = 3.75px */
        .box {
            /* width: 100px / 3.75px = 26.6667vw */
            width: 26.6667vw;
            height: 26.6667vw;
            background: #8ec04c;
        }
 
        p {
            font-size: 3.2vw;
        }
    </style>
 
 
    <div class="box">
        <p></p>
    </div>
 ```
效果一样的：可以从计算样式那里看到width和font-size都是动态的。


### 4.2.1 vw和rem的对比
**rem事实上是作为一种过渡的方案，它利用的也是vw的思想**
- 前面不管是我们自己编写的js，还是flexible的源码
- 都是将1rem等同于设计稿的1/10，在利用1rem计算相对于整个屏幕的尺寸大小
- 思考一下，1vw不是刚好等于屏幕的1/100而且相对于rem还更加有优势;

**vw相比于rem的优势:**
- 优势一: 不用去计算html的font-size大小，也不需要给html设置这样一个font-size
- 优势二:不会因为设置html的font-size大小，而必须给body再设置一个font-size，防止继承
- 优势三:因为不依赖font-size的尺寸，所以不用担心某些原因html的font-size尺寸被篡改，页面尺寸混乱
- 优势四:vw相比于rem更加语义化，1vw刚好是1/100的viewport的大小
- 优势五: 可以具备rem之前所有的优点
### 4.2.2 vw的单位换算
1. 第一种：手动换算
  
比如有一个在375px屏幕上，100px宽度和高度的盒子口我们需要将100px转成对应的vw值
100/3.75=26.667，其他也是相同的方法计算即可
  
2. 第二种:less/scss函数
```js
@vwUnit:3.75;
 
.pxToVw(@px) {
  result: 1vw * (@px / @vwUnit);
}
 
.box {
  width: .pxToVw(100)[result];
  height: .pxToVw(100)[result];
  background-color: orange;
}
 
p {
  font-size: .pxToVw(14)[result];
}
 ```

3. 第三种: postcss-px-to-viewport
和rem一样，在前端的工程化开发中，我们可以借助于webpack的工具来完成自动的转化。postcss-px-to-viewport 是一款 PostCSS 插件，用于将 px 单位转化为 vw/vh 单位。

安装插件：`npm i postcss-px-to-viewport -D`

下面提供了一份基本的 PostCSS 示例配置，可以在此配置的基础上根据项目需求进行修改。
```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,
    },
  },
};
viewportWidth的值根据自己的设计稿填写，还有很多配置想看文档配置，比如哪些类不转换vw等等。
```

4. 第四种:VSCode插件
 px tovw 的插件，在编写时自动转化
[![odORHD.md.png](https://vip.helloimg.com/images/2023/11/10/odORHD.md.png)](https://www.helloimg.com/image/odORHD)

 这样就可以转换了。
