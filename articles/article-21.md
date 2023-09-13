---
title: 重学webpack（二）
description: 面试痛点之webpack
date: 2023-09-13
random: plugin
tags:
    - tools
---

在production这个环境下，webpack会去自动启动优化插件，例如把代码压缩，但是打包的结果我们没有办法去阅读
development   方便去调试
none 运行最原始的打包 没有过多的处理

webpack打包结果运行原理
在webpack进行打包的过程中，主要分为两个阶段：编译(Compilation)和输出(Output)。其中编译阶段负责将JavaScript模块解析成依赖图，进行其他处理操作，例如将非JavaScript文件转化为JavaScript代码。而输出阶段则负责将编译后的代码打包输出成文件。
运行webpack打包结果的原理如下：
打包后的文件会生成一份依赖图，其中每个模块都会有一个相对的路径。
当网页请求打包后的文件时，服务器会将文件传回客户端。
客户端会对这个文件进行解析，并依照依赖图的顺序加载其中的模块。
当需要加载一个模块时，浏览器会向服务器发送请求获取该模块的代码。
服务器返回该模块的JavaScript代码。
客户端将获取到的代码执行，并且将该模块所依赖的模块继续加载，直到所有的依赖都加载完成，最终形成完整的应用程序。
在上述过程中，每个模块只需要被加载一次，因为它们的代码已经被打包成单个文件。通过这种方式，webpack实现了将应用程序中的整个依赖树打包成一个文件并进行请求和加载的过程，这样能够加快页面的加载速度，同时也能够管理和维护复杂的依赖关系。

loader机制是webpack的核心机制
其实就是一个资源文件从输入到输出的转换，通过函数把资源文件变成js 或者依次使用多个loader去变成js文件，直接拼接到最后打包的js文件中，避免语法不通过的问题，所以最终都要变成js
ts-loader babel-loader markdown-loader style-loader css-loader less-loader
[![onJaWr.png](https://www.helloimg.com/images/2023/09/13/onJaWr.png)](https://www.helloimg.com/image/onJaWr)

plugin是为了增强webpack自动化的能力，例如自动在打包前清除dist目录（clean-webpack-plugin），。拷贝静态文件自输出目录（copy-webapck-plugin）传入数组去指定需要拷贝的路径，压缩输出的代码，自动输出Html文件保证引入文件的路径是正确的（html-webpack-plugin）可根据构造函数去传入属性去生成html模板，还有可以输出多个html文件，通过额外的构造函数去创建
写法一般都是需要new 一个插件实例到数组中
plugin机制通过钩子去实现，可以触及到webapck工作的每一个环节，给每一个环节都埋下了钩子，插件必须是一个函数或者是一个包含apply方法的对象（compiler对象包含了webapck的所有构建信息），通过在webpack生命周期中挂载函数实现拓展， 列如通过在webpack的hooks属性去访问到emit钩子，通过tip方法去注册一个钩子函数，（emit是打包文件准备输出的时刻，通过文档去查阅）
[![onJ1gT.png](https://www.helloimg.com/images/2023/09/13/onJ1gT.png)](https://www.helloimg.com/image/onJ1gT)
移除注释的过程
