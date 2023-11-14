---
title: 微信事业群面试题：HardMan
description: class && promise
date: 2023-11-05
random: refreshing 
tags:
    - 手写题
---

这道题是面试腾讯校招时，被WXG捞起来视频面时做的一道题，当时一脸懵逼，想了好一会，不过确实是不会做。主要是因为当时对类的使用以及Promise的掌握都还不够熟练，今天刚好想到这道题，于是翻出来好好地做了一下！
## 题目重述
```js
 实现一个 HardMan:
HardMan(“jack”) 输出:
I am jack

HardMan(“jack”).rest(10).learn(“computer”) 输出
I am jack
//等待10秒
Start learning after 10 seconds
Learning computer

HardMan(“jack”).restFirst(5).learn(“chinese”) 输出
//等待5秒
Start learning after 5 seconds
I am jack
Learning chinese
```
### 方法一、使用 纯Callbacks 调用
**主要涉及到的知识点**
1. 使用ES6中的箭头函数可规避this指向的问题，否则需要用bind来绑定
2. setTimeout异步事件，会在同步事件执行完后再开始执行
3. 实现链式调用，函数返回this即可
4. 队列的使用
5. 运用了类和面向对象的编程思想
**代码展示**
```js
class _HardMan {
    constructor(name) {
        this.tasks = [];
        // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，才开始执行第一个next函数，
        // 主要是考虑了restFirst的情况
        setTimeout(() => this.next())
        this.tasks.push(() =>{
            console.log(`I am ${name}`)
            this.next()
        })
    }

    next() {
        let task = this.tasks.shift()
        task && task()
    }

    learn(params) {
        this.tasks.push(() =>{
            console.log(`Learning ${params}`)
            this.next()
        })
        return this
    }

    wait(sec) {
        setTimeout(() => {
            console.log(`Start learning after ${sec} seconds`)
            this.next()
        }, sec * 1000);
    }
    waitPrint(sec) {
        console.log(`//等待${sec}秒..`)
        this.next()
    }

    rest(sec) {
        this.tasks.push(this.waitPrint(sec))
        this.tasks.push(this.wait(sec))
        return this
    }

    restFirst(sec) {
        this.tasks.unshift(this.wait(sec))
        this.tasks.unshift(this.waitPrint(sec))
        return this
    }
}

const HardMan = function (name) {
    return new _HardMan(name)
}

HardMan("jack").restFirst(5).learn("chinese")
// //等待5秒..
// Start learning after 5 seconds
// I am jack
// Learning chinese

HardMan("jack").rest(3).learn("computer")
// //等待3秒..
// I am jack
// Start learning after 3 seconds
```
### 方法一、使用 Promise & Queue
**主要涉及到的知识点**
1. 利用了Promise的异步特性
**代码展示**
```js
class _HardMan {
    constructor (name) {
        this.tasks = [];
        // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，才开始执行第一个next函数，主要是考虑了restFirst的情况
        setTimeout(() => this.next());
        this.tasks.push(() => 
            new Promise(resolve => {
                console.log(`I am ${name}`)
                resolve()
            })
        )

        //其实这里可以不用return this，因为调用构造函数没有更改this的指向
        return this
    }

    next () {
        let task = this.tasks.shift();
        task && task().then(() => this.next());
    }

    rest(sec) {
        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`//等待${sec}秒..`)
                setTimeout(() => {
                    console.log(`Start learning after ${sec} seconds`)
                    resolve()
                }, sec * 1000);
            })
        )
        return this
    }

    restFirst (sec) {
        this.tasks.unshift(() =>
            new Promise(resolve => {
                console.log(`//等待${sec}秒..`)
                setTimeout(() => {
                    console.log(`Start learning after ${sec} seconds`)
                    resolve()
                }, sec * 1000);
            })
        )
        return this
    }

    learn(params) {
        this.tasks.push(() => 
            new Promise(resolve => {
                console.log(`Learning ${params}`)
                resolve()
            })
        )
        return this
    }
}

const HardMan = function (name) {
    return new _HardMan(name)
}

HardMan("jack").restFirst(3).learn("Chinese").learn("Englsih").rest(2).learn("Japanese")

// //等待3秒..
// Start learning after 3 seconds
// I am jack
// Learning Chinese
// Learning Englsih
// //等待2秒..
// Start learning after 2 seconds
// Learning Japanese
```
### 使用 Async/Await 对方法二进行优化
首先我们可以简单地优化一下，将重复的代码用wait抽象出来
```js
wait(sec) {
    return new Promise(resolve => {
        console.log(`//等待${sec}秒..`)
        setTimeout(() => {
            console.log(`Start learning after ${sec} seconds`)
            resolve()
        }, sec * 1000);
    })
}

rest(sec) {
    this.tasks.push(() => this.wait(sec))
    return this
}

restFirst(sec) {
    this.tasks.unshift(() => this.wait(sec))
    return this
}
```
然后删除掉next方法，tasks队列中使用Async/Await顺序执行取代this.next()即可
```js
setTimeout(async () => {
    for (let task of this.tasks) {
        await task()
    }
})
```
最终代码
```js
class _HardMan {
    constructor(name) {
        this.tasks = [];
        // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，才开始执行第一个next函数，主要是考虑了restFirst的情况
        setTimeout(async () => {
            for (let task of this.tasks) {
                await task()
            }
        })
        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`I am ${name}`)
                resolve()
            })
        )

        //其实这里可以不用return this，因为调用构造函数没有更改this的指向
        return this
    }

    wait(sec) {
        return new Promise(resolve => {
            console.log(`//等待${sec}秒..`)
            setTimeout(() => {
                console.log(`Start learning after ${sec} seconds`)
                resolve()
            }, sec * 1000);
        })
    }

    rest(sec) {
        this.tasks.push(() => this.wait(sec))
        return this
    }

    restFirst(sec) {
        this.tasks.unshift(() => this.wait(sec))
        return this
    }

    learn(params) {
        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`Learning ${params}`)
                resolve()
            })
        )
        return this
    }
}

const HardMan = function (name) {
    return new _HardMan(name)
}

HardMan("jack").restFirst(3).learn("Chinese").learn("Englsih").rest(2).learn("Japanese")

// //等待3秒..
// Start learning after 3 seconds
// I am jack
// Learning Chinese
// Learning Englsih
// //等待2秒..
// Start learning after 2 seconds
// Learning Japanese
```