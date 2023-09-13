---
title: 重学webpack
description: 面试痛点之webpack
date: 2023-09-12
random: webpack
tags:
    - tools
---

美团和微软的二面都问到了webpack打包原理，为什么需要打包等，回答的不好，对此重学webpack的学习

**webpack是一个模块打包工具**  是一个基于node js 的框架，解决js模块化打包的问题
把零散的模块化代码打包到同一个js文件里，对环境有兼容性的代码，通过loader进行编译转换
可以把互相依赖的html，css，js，图片，字体等资源文件经过一系列的处理打包成静态的前端项目
webpack具有代码拆分的能力，按照我们的需要去打包，不用担心把全部代码打包在一起，产生的文件比较的问题，可以把项目初次加载的文件打包在一起，其他的模块再单独存放，在实际需要的时候再异步去加载这个模块从而实现增量加载

**为什么要用webpack呢**  
在之前传统的网页开发项目中，需要在html中引入大量的js文件，不仅会导致命名冲突，也会使页面体积过大，如果是第三方库，需要加载所有的代码  
而node出现后，js支持require 进行模块化开发了，支持npm去方便的管理依赖
借着node js和浏览器的js的一致性，前端项目在node js上开发，完成之后，把代码构建成浏览器支持的形式，，对于react 和 vue 这种组件化开发的形式，因为有很多分散的文件，那么就特别需要这样的构建操作，webpack就是进行构建操作的，把node js模块化的代码转换为浏览器可执行的代码，提供了es6的import export的模块化支持，通过分析import导入的依赖，把需要的代码加载进来，在webpack中，任何文件都可以通过import导入，只要有对应的loader就可以了，在打包过程可以通过插件干预打包过程，例如剔除不必要的代码，形成体积更小的项目

webpack只会在开发的时候用到，最后打包的项目中不需要webpack了

## 模块化规范
CommonJS （以同步的方式去加载模块）  
一个文件就是一个模块  
每个模块都有单独的作用域  
通过module。exports导出成员  
通过require函数加载模块  

不适合浏览器，因为浏览器每次加载大量的同步模式出现  
为浏览器设置了AMD规范（require.js），开发比较复杂，模块划分比较细的时候就会对js文件请求次数比较多，页面效率就会低下  
CMD代码风格类似于Commonjs，原理类似AMD,减轻开发者的学习成本  

如今最佳实践规范：在node中使用Commonjs  在浏览器使用ES Module（ES6的模块系统）  

ES Module特性：  
通过在script添加type=module的属性，就可以以ESmodule的标准执行js代码
 1. 自动使用严格模式
 2. 每个ES module 都是运用在单独的私有作用域中
 3. ESM 是通过cors的方式去请求外部js模块的
 4. script会延迟执行脚本 等待网页渲染完再执行，

ES的导入导出
import  export



## 模块打包工具
模块化确实解决了在复杂项目中的代码组织问题，但是引入模块化也产生了新的问题。例如ES Module存在环境兼容问题、 模块文件过多，前端项目运行在浏览器中，文件都需要在服务器上去请求回来  网络请求频繁、 所有的前端资源都需要模块化

希望能有工具能满足我们的设想
编译我们的代码  es6变es5 （环境兼容问题就不存在了）；
[![onJZwh.png](https://www.helloimg.com/images/2023/09/13/onJZwh.png)](https://www.helloimg.com/image/onJZwh)

把散落的文件打包在一起（解决了频繁对模块文件发出请求的问题）
[![onJohc.png](https://www.helloimg.com/images/2023/09/13/onJohc.png)](https://www.helloimg.com/image/onJohc)

支持不同种类的前端类型（对整个前应用来讲）
[![onJPxq.png](https://www.helloimg.com/images/2023/09/13/onJPxq.png)](https://www.helloimg.com/image/onJPxq)

