---
title: 重学webpack
description: 面试痛点之webpack
date: 2023-09-12
random: webpack
tags:
    - tools
---

美团和微软的二面都问到了webpack打包原理，为什么需要打包等，回答的不好，对此重学webpack的学习

webpack是一个模块打包工具  是一个基于node js 的框架  
可以把互相依赖的html，css，js，图片，字体等资源文件经过一系列的处理打包成静态的前端项目  

**为什么要用webpack呢**
在之前传统的网页开发项目中，需要在html中引入大量的js文件，不仅会导致命名冲突，也会使页面体积过大，如果是第三方库，需要加载所有的代码  
而node出现后，js支持require 进行模块化开发了，支持npm去方便的管理依赖
借着node js和浏览器的js的一致性，前端项目在node js上开发，完成之后，把代码构建成浏览器支持的形式，，对于react 和 vue 这种组件化开发的形式，因为有很多分散的文件，那么就特别需要这样的构建操作，webpack就是进行构建操作的，把node js模块化的代码转换为浏览器可执行的代码，提供了es6的import export的模块化支持，通过分析import导入的依赖，把需要的代码加载进来，在webpack中，任何文件都可以通过import导入，只要有对应的loader就可以了，在打包过程可以通过插件干预打包过程，例如剔除不必要的代码，形成体积更小的项目

webpack只会在开发的时候用到，最后打包的项目中不需要webpack了

------------未完