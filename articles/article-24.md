---
title: 浅谈浏览器页面渲染过程 load 与 DOMContentLoaded 事件
description: 笔试痛点之文档解析
date: 2023-09-30
random: render 
tags:
    - 八股文
---

## 一个问题
**为什么推荐把 <script> 都放在 <body> 底部？**
提高页面加载速度：浏览器在解析 HTML 文档时，会从上到下逐行解析。将 JavaScript 代码放在<body>底部意味着浏览器在解析完所有 HTML 内容之后才会执行 JavaScript。这样可以让浏览器在执行 JavaScript 代码之前，尽可能多地加载和渲染 HTML 内容。这样可以缩短页面的加载时间，提高用户体验。
避免阻塞渲染：在浏览器解析 HTML 文档时，如果遇到<script>标签，浏览器会暂停渲染 HTML 内容，转而执行 JavaScript 代码。将 JavaScript 代码放在<body>底部，可以避免这种情况，确保浏览器在渲染 HTML 内容时，不会被 JavaScript 代码中断。
兼容性：某些浏览器（如 Internet Explorer）在遇到<script>标签时，会立即执行其中的代码，而不管它位于 HTML 文档的哪个位置。将 JavaScript 代码放在<body>底部，可以确保这些浏览器在渲染 HTML 内容时，也能正确执行 JavaScript 代码。

## 正文
### document.readyState  
该属性描述了文档的加载状态，发生变化时，会在 document 对象上触发 readystatechange 事件。有3种状态：

+ loading 正在加载
+ interactive 文档已被解析，loading 状态结束，但是诸如图像，样式表和框架之类的子资源仍在加载，会在 document 和 window 对象上触发 DOMContentLoaded 事件。
+ complete 所有资源完成加载，会在 window 对象上触发 load 事件。

### 浏览器页面渲染过程
1. 浏览器与服务器建立 TCP 连接发送 HTTP 请求，获取 HTML 文档并开始从上到下解析，构建 DOM。
2. 在构建 DOM 过程中：
  - 如果遇到外联的 css 文件，下载文件并执行构建 CSSOM，此过程不影响 DOM 构建，但在完成之前会阻止页面渲染。
  - 如果遇到外联的 js 文件，则暂停构建 DOM，
      + 若在这之前的 css 文件已加载完毕且 CSSOM 构建完成，则合并已经构建好的 DOM 与 CSSOM 并渲染到页面上
      + 之后等 js 文件下载并执行后，然后继续构建后边的 DOM。
3. 完成文档解析后，将 DOM 和 CSSOM 进行关联和映射，生成 Render Tree 渲染页面。
4. 当所有同步的 js 代码执行完毕后，会在 document 和 window 对象上触发 DOMContentLoaded 事件，此时对应 document.readyState === 'interactive'。
5. 当所有资源完成加载后，会在 window 对象上触发 load 事件，此时对应 document.readyState === 'complete'。  

在这个过程中，js 文件的下载和执行会阻塞文档的解析，这也就是为什么推荐把 <script> 都放在 <body> 底部

## 小结
- DOMContentLoaded 事件在 html 文档加载完毕，并且 html 所引用的内联 js、以及外链 js 的同步代码都执行完毕后触发。
- load 事件在html 文档中所有资源完成加载后，才会触发。
- 注意： video、audio、flash 不会影响 load 事件触发。

## 关于文件加载
浏览器对同一域名下的资源并发下载线程数是有限的，比如 **chrome 为6个**。  
因此建议对于文件请求并发量比较大的页面，把静态资源尽可能放在不同的域名下，一方面尽可能多的加大并发请求数量，另一方面避免静态资源请求与数据请求在同一主域名下导致静态资源请求携带 cookie 造成不必要的带宽浪费。

## script 的 defer 与 async 属性
+ defer 用于开启新的线程下载 js 文件，并使之在文档解析完成后执行，此过程不会阻塞文档解析。
  - 相当于把 <script> 都放在 <body> 底部。
  - 对无 src 属性的 <script> 无效。
  - 理论上，如果有多个声明了 defer 的 <script>，则会按顺序下载和执行（有序）。
  - 理论上，声明了 defer 的 <script> 会在 DOMContentLoaded 之前执行。
+ async 用于异步下载脚本文件，下载完毕立即解释执行代码，此过程不会阻塞文档解析。
  - 对无 src 属性的 <script> 无效。
  - 如果有多个声明了 async 的 <script>，先下载完哪个执行哪个（无序）。