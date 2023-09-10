---
title: 浅析Chrome Devtools的 Performance 面板
description: 面试痛点之performance
date: 2023-09-10
random: performance
tags:
    - tools
---

美团和微软的二面都问到了performance的一些具体参考指标或者是一些api等，回答的不好，对此加深performance的学习

选择开发者工具的 Performance，可以看到左边有三个按钮，一个点击是直接开始录制，第二个是重新加载页面并录制，第三个便是清除。如果你想直接看首页性能评测，可以直接点击第二个按钮。

[![on5yyo.png](https://www.helloimg.com/images/2023/09/10/on5yyo.png)](https://www.helloimg.com/image/on5yyo)

大家也可以看谷歌官方的[Demo](https://googlechrome.github.io/devtools-samples/jank/)地址来试试  

点击后等待几秒后关闭，Performance 显示大致如下：
[![onBBJD.md.png](https://www.helloimg.com/images/2023/09/10/onBBJD.md.png)](https://www.helloimg.com/image/onBBJD)

## 设置面板
点击右边的设置按钮，可展开如下菜单：

[![onBCcS.md.png](https://www.helloimg.com/images/2023/09/10/onBCcS.md.png)](https://www.helloimg.com/image/onBCcS)
+ Disable JavaScript samples：禁用 JavaScript 采样。禁用之后记录中会忽略所有 JavaScript 的调用栈，记录的 Main 部分会比开启更简短。
+ Enable advanced paint instrumentation(slow)：开启加速渲染工具。会带来大量的性能开销
+ Network：控制网络
+ CPU：控制录制过程中 CPU 工作频率。如 4x slowdown 选项会使你本地 CPU 运算速率比正常情况下降低 4 倍。

一般来说这块是用不到的

## FPS
FPS（frames per second）每秒帧数，是来衡量动画的一个性能指标。  
正常如果网页流畅度较好的话，FPS 应该维持在 60 前后，即一秒之内进行 60 次重新渲染，每次重新渲染的时间不能超过 16.7ms 左右。如下图，一般绿色条部分越高，说明帧率越好。如果有红色长条，就代表帧率太低可能存在问题。
[![onBGVC.md.png](https://www.helloimg.com/images/2023/09/10/onBGVC.md.png)](https://www.helloimg.com/image/onBGVC)
当然，红色条多的话，则说明页面掉帧影响到用户体验了。  

鼠标移动到 FPS,CPU 或者 NET 图表上任意地方，都会显示在该时间节点上的屏幕截图（前提是勾选了 Screenshots），将你的鼠标左右移动，可以看到整个页面加载的进程。  
[![onBZ3Q.th.png](https://www.helloimg.com/images/2023/09/10/onBZ3Q.th.png)](https://www.helloimg.com/image/onBZ3Q)


## CPU
[![onBoMt.md.png](https://www.helloimg.com/images/2023/09/10/onBoMt.md.png)](https://www.helloimg.com/image/onBoMt)
FPS 下面就是 CPU 图表，图表中的颜色和面板底部的Summarytab 中的颜色是匹配的。CPU 图标颜色越丰富，代表在录制过程中 CPU 利用已最大化。当然如果这段丰富颜色的长条比较长，就说明一直在占用 CPU，此时就可能导致网页卡顿，这就需要介入代码优化。


## 火焰图
### Network
可以看出网络请求的详细情况
[![onB1SE.th.png](https://www.helloimg.com/images/2023/09/10/onB1SE.th.png)](https://www.helloimg.com/image/onB1SE)

### Frame 
表示每帧的运行情况。鼠标移至下方的 Frame 的绿色方块部分，可以看到该特定帧上的 FPS 值。
[![onBF6u.th.png](https://www.helloimg.com/images/2023/09/10/onBF6u.th.png)](https://www.helloimg.com/image/onBF6u)

### Timings 重要的一些指标（用于判断当前页面是否加载完毕）
[![onBaZv.md.png](https://www.helloimg.com/images/2023/09/10/onBaZv.md.png)](https://www.helloimg.com/image/onBaZv)
+ FP（first paint）：指的是首个像素开始绘制到屏幕上的时机，例如一个页面的背景色
+ FCP（first contentful paint）：指的是开始绘制内容的时机，如文字或图片
+ LCP（Largest Contentful Paint）：视口内可见的最大内容元素的渲染时间
+ FMP（First Meaningful Paint）：首次有意义的绘制
+ DCL（DOMContentLoaded）：表示 HTML 已经完全被加载和解析
+ L（Onload）:页面所有资源加载完成事件

### Main
记录渲染进程中主线程的执行记录，点击 Main 可以看到某个任务执行的具体情况，可以分析主线程的 Event Loop，分析每个 Task 的耗时、调用栈等信息
[![onB3QY.md.png](https://www.helloimg.com/images/2023/09/10/onB3QY.md.png)](https://www.helloimg.com/image/onB3QY)
面板中会有很多的 Task，如果是耗时长的 Task，其右上角会标红，这个时候就可以选中标红的 Task，定位到耗时函数，然后针对性去优化。

## 找到瓶颈
现在你已经测量并验证了动画的性能不佳，接下来要搞清楚的问题是：为什么？

1. 请注意“Summary”选项卡。这个选项卡是性能问题的汇总。如果未选择任何事件，此选项卡将显示活动的明细。除去Idle（浏览器空置状态，白色部分）时间，页面的大部分时间用于Rendering（样式计算和布局，即重排）,排在其后的是Scripting（JavaScript执行）和Painting（重绘）。性能本质上来说是逃避工作的艺术，但是当它变得不可逃避的时候，保证你做的工作是高效的、花在处理问题上的时间是值得的。因此你的目标是减少用于渲染工作的时间。
[![onBqmX.th.png](https://www.helloimg.com/images/2023/09/10/onBqmX.th.png)](https://www.helloimg.com/image/onBqmX)

2. 展开Main节点。它显示主线程上随时间变化的计算活动的火焰图。x轴代表记录时间，每个条代表一个事件，一个更宽的栏意味着这个活动需要更长的时间。y轴表示调用堆栈，当你看到事件堆叠在一起时，意味着上面的事件导致了下面的事件。
[![onBxcg.md.png](https://www.helloimg.com/images/2023/09/10/onBxcg.md.png)](https://www.helloimg.com/image/onBxcg)

3. Main节点里有很多数据。通过单击、按住并将鼠标拖动到“概述”（Overview）上（Overview是包含FPS、CPU和网络图表的部分），放大单个动画帧激发的事件。“主要部分”和“摘要”选项卡仅显示所选录制部分的信息。

4. 注意动画帧激发事件右上角的红色三角形。每当你看到一个红色的三角形，都表示一个警告，可能有一个与此事件有关的问题。
[![onBEVM.md.png](https://www.helloimg.com/images/2023/09/10/onBEVM.md.png)](https://www.helloimg.com/image/onBEVM)

5. 单击动画帧地激发事件，Summary选项卡会显示有关该事件的信息，请注意其中的链接。单击可使DevTools高亮显示启动动画帧触发事件的事件。特别注意 app.js:95 这个链接，单击它，你将跳转到Sources面板（源代码）中的相关行。这一点太棒了！在代码界面，你将看到每行代码执行耗费的时间，找到最耗时的那一行，你就应该知道问题出在哪儿了。定位出问题后，剩下的问题就好解决了。

[![onBmXP.md.png](https://www.helloimg.com/images/2023/09/10/onBmXP.md.png)](https://www.helloimg.com/image/onBmXP)
注意：此代码的问题在于，在每个动画帧中（我们可以认为 app.update 函数执行一次即为一帧），它都会更改每个正方形的样式，然后查询页面上每个正方形的位置。 由于样式已更改，而浏览器不知道每个正方形的位置是否已更改，因此必须重新布局正方形才能计算其位置。 也就是说，在第 71 行的代码中，对offsetTop 这个属性的查询，导致触发了浏览器的又一次重排（也就是我们常说的reflow或re-layout），这是它的执行时间达到3000多毫秒的原因。

第 80 ~ 91 行是优化后的版本，请特别注意第85行代码，此处使用了前边已经计算好的位置值，替代原来的使用 m.offsetTop 查询当前方块位置的方法，可以避免页面次再重排，以提升性能。

你可以在页面上点击Optimize（优化）按钮，然后再次点击Performance面板左上角的实心圆 Record 按钮，过几秒钟后点击 Stop，Performance面板会再次产生一个新的记录。我们再按照上边第4、第5步的方法，查询优化版本代码的执行速度。你会发现同样用于查询方块位置的第85行代码，执行时间已经由原来的3000多毫秒，降到了可以忽略不计的0.2毫秒。

[![onBsM6.md.png](https://www.helloimg.com/images/2023/09/10/onBsM6.md.png)](https://www.helloimg.com/image/onBsM6)