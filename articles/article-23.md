---
title: figma插件机制
description: 面试痛点之figma插件
date: 2023-09-20
random: figma 
tags:
    - tools
---

## Figma 架构简介
Figma 整体是用 React 开发的，核心的画布区是一块 canvas ，使用WebGL来渲染。并且画布引擎部分使用的是WebAssembly，这就是 Figma 能够如此流畅的原因。桌面端的Figma App 使用了 Electron——一个使用Web技术开发桌面应用的框架。Electron 类似于一个浏览器，内部运行的其实还是一个Web应用。

## Figma 插件原理
 Figma 插件分为两个部分：UI 层 与 Plugin 层。UI 层运行在iframe中，拥有浏览器API；Plugin 运行在 JS 沙箱中，没有浏览器 API，但是可以访问 figma API。两者只能用postMessage通信。

在Web端开发一套安全、可靠的插件系统， iframe 无疑是最直接的方案。 iframe 是标准的W3C规范，在浏览器上已经经过多年应用，它的特点是：
 
 + 安全，天然沙箱隔离环境，iframe内页面无法操作主框架； 
 + 可靠，兼容性非常好，且经过了多年市场的检验； 
 
但是它也有明显的缺点：与主框架通信只能通过 postMessage(STRING) 的方式，通信效率非常低。如果要在插件里操作一个画布元素，首先要将元素的节点信息从主框架拷贝到 iframe 中，然后在  iframe 中操作完再更新节点信息给主框架。这涉及到大量通信，而且对于复杂的设计稿节点信息是非常巨大的，可能超过通信的限制。
 
为了保证操作画布的能力，必须回到主线程。插件在主线程运行的问题主要在于安全性上，于是Figma的开发人员在主线程实现了一个 js 沙箱环境，使用了Realm API。沙箱中只能运行纯粹的 js 代码和Figma提供的API，无法访问浏览器API（例如网络、存储等），这样就保证了安全性。
[![onvLr6.png](https://www.helloimg.com/images/2023/09/20/onvLr6.png)](https://www.helloimg.com/image/onvLr6)

经过综合考虑，Figma 将插件分成两个部分：插件UI运行在 iframe 中，操作画布的代码运行在主线程的隔离沙箱中。UI线程和主线程通过 postMessage 通信。
插件配置文件 manifest.json 中分别配置 main 字段指向加载到主线程的 js 文件， ui 字段配置加载到 iframe 中的 html 文件。打开插件时，主线程调用 figma.showUI() 方法加载 iframe 。
```javascript
{
  // 插件名称
  "name": "quanquan",
  // 插件ID 自动生成
  "id": "109824696931xxxx519",
  // api 版本号
  "api": "1.0.0",
  // 运行在主进程隔离沙箱的 api 操作代码
  "main": "code.js",
  // 插件类型
  "editorType": [
    "figma"
  ],
  // 插件 UI
  "ui": "ui.html"
}
```

## iframe
 
通过打开Firma的devtools，可以看到插件iframe的url是 Data URLs 格式。这是Figma将插件html 内容转成了base64格式。 图片: [![onvi3n.png](https://www.helloimg.com/images/2023/09/20/onvi3n.png)](https://www.helloimg.com/image/onvi3n)
 
这会带来什么问题呢？我们在console面板里调试一下，可以看到在iframe中调用localStorage和cookie 都会报错。localStorage和cookie 都是根据域名来存储数据的，而使用了Data URLs 格式就没有域名了，所以无法存储数据。 [![onvnMR.png](https://www.helloimg.com/images/2023/09/20/onvnMR.png)](https://www.helloimg.com/image/onvnMR)
 于是 Figma提供了一个存储API figma.clientStorage 。这个API是在JS沙箱中调用的，也就是说数据是存储在主线程，而不是在iframe中。iframe中要存取数据的话，就必须通过 postMessage 接口与主线程通信。


面试话术
实现的一个功能是：将选中的设计稿节点导出为png格式的图片。
整体流程为：
在 Figma 的 JavaScript 沙箱环境中监听选中事件，获取当前节点id；
根据节点id，导出设计稿的buffer数据；
将buffer转换为图片格式，可以保存到本地或者上传到云端；
在 Figma 的 UI 线程中监听选中事件，获取当前节点 id；  
在 Figma 的 JavaScript 沙箱环境中，根据节点 id，导出设计稿的 buffer 数据；  
将 buffer 转换为图片格式，并在沙箱环境中通过 postMessage 通信传输数据到 UI 线程，以便保存到本地或上传到云端。
整体流程如下：
1. 在 Figma 的 UI 线程中监听选中事件：
在 Figma 的 UI 线程中，我们可以通过监听 `figma.ui.lectionchange` 事件来获取当前选中的节点 ID。在监听器中，我们可以使用以下代码：
 figma.ui.lectionchange.subscribe((event) => {  
 const nodeIds = event.selection;  
 const currentNodeId = nodeIds[0];  
 console.log('当前选中的节点 ID:', currentNodeId);  
});  
2. 在 Figma 的 JavaScript 沙箱环境中，根据节点 id，导出设计稿的 buffer 数据：
为了导出设计稿的 buffer 数据，我们需要调用 Figma 的 API。首先，我们需要通过节点 ID 获取节点对象，然后使用 `exportAsync()` 方法导出 buffer 数据。以下是如何实现这个过程的代码：
async function getNodeBuffer(nodeId: string): Promise<Uint8Array> {  
 const node = figma.getNodeById(nodeId);  
 if (!node) {  
   console.error('无法找到节点');  
   return;  
 }
 try {  
   const buffer = await node.exportAsync();  
   return buffer;  
 } catch (error) {  
   console.error('导出 buffer 数据时发生错误：', error);  
   return;  
 }  
}
3. 将 buffer 转换为图片格式，并在沙箱环境中通过 postMessage 通信传输数据到 UI 线程，以便保存到本地或上传到云端：（掉后端接口）
为了将 buffer 转换为图片格式并传输到 UI 线程，我们需要使用以下代码：
async function saveBufferAsImage(buffer: Uint8Array, fileName: string) {  
 const base64Data = new Uint8Array(buffer.length);  
 for (let i = 0; i < buffer.length; i++) {  
   base64Data[i] = buffer[i];  
 }
 const base64String = btoa(unescape(encodeURIComponent(new Uint8Array(base64Data).toString())));
 const imgData = `data:image/png;base64,${base64String}`;
 // 在此处添加将图片保存到本地或上传到云端的代码  
}
async function saveNodeBufferAsImage(nodeId: string, fileName: string) {  
 const buffer = await getNodeBuffer(nodeId);  
 await saveBufferAsImage(buffer, fileName);
 // 通过 postMessage 通信将数据传输到 UI 线程  
 figma.showUI(__html__, { width: 200, height: 100 });  
}
使用以上代码，我们可以在 Figma 的 UI 线程中监听选中事件，获取当前节点 ID，然后进入 Figma 的 JavaScript 沙箱环境中导出设计稿的 buffer 数据。接着，我们将 buffer 转换为图片格式，并在沙箱环境中通过 postMessage 通信传输数据到 UI 线程，以便保存到本地或上传到云端。

在js代码中将画布内容导出，需要利用浏览器API（例如：下载、通过网络上传等），则需要先在JS沙箱中获取到画布元素，然后通过postMessage传递到iframe中。iframe调用浏览器API来导出数据