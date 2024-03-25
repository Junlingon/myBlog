---
title: B站实习年前小结
description: 常用技能点
date: 2024-02-16
random: talk 
tags:
    - 实习
---


## 标识位来控制防抖，
这个是只触发第一次，后面再触发不再生效
+ 方法一。 useRef
```js
const buy = async (props) => {
    if (isBuying.current) return false
    // 标志位
    isBuying.current = true
    try {
        xxxxx
        isBuying.current = false
      }
    } catch (error) {
      isBuying.current = false
      toast.error(errorMessage)
    }
  }
```
+ 方法二。 变量
```js
let loading = false //组件外定义
const draw = async () => {
    if (loading) return
    loading = true
    try {
      const res = await getDrawInfo()
    } catch (error) {
      console.log(error)
    }
    loading = false
  }
```

## css布局
1. 对比了他们的布局，首先是要将最外层的的定位住，然后再写里面的内容，不然就会像我一样，里面的每个内容都要去做margin 0 auto （命运全台）
2. 数据拉伸导致变形。用纯色或重复一张图
3. inline 元素无缘无故撑开了，可能是父级的font-size搞得
4. flex布局 先最外层flex，然后某一个是flex1，其他的是根据margin来写的（再用其他来调整）
5. 想让component的高度占满屏幕减去navbar的高度，用flex布局后，然后component设置flex：1
6. * {
    appearance: none;
    -webkit-touch-callout: none;
    outline: none;
  }
-webkit-touch-callout: none;
解决复制问题
7. iphone 部分机型 label某一边框显示不出来
```js
      label {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          border: 1px solid #c0c0c0;
          border-radius: 8px;
          transform: scale(0.5);
        }
      }
    }
    .btn-active {
      color: #00aeec !important;
      background: rgba(114, 202, 251, 0.1) !important;
      &::after {
        content: '';
        border: 1px solid #00aeec !important;
      }
    }
```

8. background: url('https://i0.hdslb.com/bfs/activity-plat/static/20240118/d3de01ea5b5200083302ca865c89375d/Cz7bna43Ue.png') no-repeat center /100% 100%;
object-fit: contain; 表示将图像等比例缩放，以完全适应其父元素的宽度和高度，同时保持其原始宽高比。这可能会导致图像在其父元素内部有一些空白，因为图像的宽度和高度可能无法完全填充其父元素。
object-fit 属性有以下几个可能的值：
* fill：默认值。替换内容拉伸填充元素的内容框，可能会改变图像的宽高比。
* contain：替换内容等比例缩放，直至其宽度或高度完全适应内容框，不改变图像的宽高比。
* cover：替换内容等比例缩放，直至其宽度和高度都等于或超过元素的宽度和高度，不改变图像的宽高比。
* none：替换内容的宽度和高度与元素的宽度和高度无关。
* scale-down：内容的尺寸与 none 或 contain 中的一个相同，具体取决于哪一个最小。


9. `background-size: cover;` 和 `background-size: 100% 100%;` 是 CSS 中设置背景图片大小的两种方式，它们的效果和适用场景有所不同。

- `background-size: cover;`：这个设置会保证背景图片覆盖整个容器。图片会被等比例缩放，直到它的宽度或高度等于容器的宽度或高度。如果图片的宽高比与容器的宽高比不同，那么这种设置会导致图片的某些部分在容器外面，无法显示。

- `background-size: 100% 100%;`：这个设置会使背景图片的宽度和高度都等于容器的宽度和高度，但不保证等比例缩放。这意味着如果图片的原始宽高比与容器的宽高比不同，图片会被拉伸或压缩，可能会导致图片变形。

总的来说，`background-size: cover;` 更适合需要保持图片比例并覆盖整个容器的场景，而 `background-size: 100% 100%;` 更适合不需要保持图片比例并需要使图片完全填充容器的场景。

10.  top记得带单位

11. background url('./images/mall-bg.png') center / contain no-repeat

12. 。inset: <length> | auto;  四个方向的值
13. 。skew 文字不影响  里面再写一个角度相反就行
图片: https://uploader.shimo.im/f/1NNA59coKSY9GmMb.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MTEzNzY4OTQsImZpbGVHVUlEIjoiZXJBZE1kUHhNYlU0eEszRyIsImlhdCI6MTcxMTM3NjU5NCwiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjo3MjA3MjQwN30.8owngvuBjcHAH1eipRMJ19ijN4rHU1vcOEZvsacK9W4

列表的展开和收缩的逻辑
```HTML
<div className={styles.action}>
   {hasMore ? (
      <div className={styles.actionContent} onClick={showMore}>
          <div className={`${styles.icon}`}></div>
           <div className={styles.text}>点击展开10个排名</div>
       </div>
     ) : (
       <div className={styles.actionContent} onClick={collapse}>
          <div className={`${styles.icon} ${styles.collapse}`}></div>
           <div className={styles.text}>收起</div>
        </div>
     )}
 </div>      
  // 初始化
  const reset = () => {
    setList(rankInfo.rankList.slice(0, defaultNum))
    setHasMore(true)
  }

 const showMore = () => {
    setList(rankInfo.rankList.slice(0, index * pageNum))
    if (rankInfo.rankList.length <= pageNum * index) {
      setHasMore(false)
    }
    setIndex(index + 1)
  }

  const collapse = () => {
    reset()
  }
```

## jotai
接口写在jotai 就是为了能简单复用 
jotai在相同组件同时展示的时候是 没有状态隔离的，因为都是共用一个atom原子

## 兜底
如果碰到了数据可能没有到情况，可以在最开始的时候判断有没有，没有直接return调

## 弹窗
先是搞了一个baseDialog，引用了mui组件写，用props的visible和handleClose去调mui的

## 数组
some find every

## vue
滚动翻页

+ Vue.js 的 `this.$nextTick()` 方法用于延迟回调函数到下次 DOM 更新周期之后执行。在修改数据后立即使用这个方法，获取更新后的 DOM。

+ Vue.js 的数据观察理念是异步的。当你修改数据时，Vue.js 不会立即更新 DOM，而是等到所有数据改变后再统一进行 DOM 更新，以提高性能。这就可能导致当我们修改数据之后，立即去检查 DOM 的变化，可能无法获取到更新后的结果，因为 DOM 在那个时间点可能还没有更新。

+ 这时候 `this.$nextTick()` 就能派上用场。它可以在数据改变之后，DOM 更新完成之后，再执行我们的操作，这样就能获取到更新后的 DOM 了。

这是一个简单的使用例子：

```javascript
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('');
      this.$nextTick(function () {
        console.log(this.$el.textContent) // 'sj.euV olleH'
      })
    }
  }
})
```
在这个例子中，`reverseMessage` 方法改变了 `message` 数据，然后使用 `this.$nextTick()` 来延迟一个回调函数，这个回调函数会在 DOM 更新完成之后执行，所以可以正确地获取到更新后的 DOM 内容。

<el-radio @click.native="nums = 1">
[![1711377086633.png](https://vip.helloimg.com/i/2024/03/25/660189e04a8a4.png)](https://vip.helloimg.com/i/2024/03/25/660189e04a8a4.png)


## 移动端开发H5页面点击
+ 按钮后出现闪烁或黑色背景
的解决办法
https://cloud.tencent.com/developer/article/1357723


+ 专业性
前端的状态一定是根据后端字段来判断的，不要自己写一个前端逻辑，自己认为是怎么样的，一定要和产品和后端 一起确定好字段
从方案A 到 方案B，如果是还在开发/测试阶段，一定要采取一个最优方案逻辑代码，而不是把方案A一点一点改动去实现方案B，这样会导致代码的可读性不高

这两天跟卢卡哇沟通的时候，学到了首先问问题之前都得先把自己的业务和代码逻辑弄清楚，不然有bug的时候，后端只会往你身上找问题，说是不是你那边有问题，这样就落入了下风，导致有理说不清

不要用前端逻辑去控制了
多加了一行代码就要考虑会不会影响其他的代码，不要只想着当前这一步

一定要把自己写的那部分代码给看明白，虽然留有之前的代码，别让问起来就是不知道

自己真的很粗心 有犯了一个愚蠢的问题 没有参数漏传了 每次应该看看有没有现成调用的

后端提出来要改字段，应该问问为什么要改，不然稀里糊涂的自己就跟着改了
对后端接口文档有问题就直接去问后端

要把自己当成一个工程师来看待前端

一个项目就该如期完成，跟产品就要说好，过了这个时间就不会帮你再继续改了

写这么多业务，要能够做出解决需求的完美方案，不是重复搬砖，而是在什么情况下什么方案更好，比如什么开发时间紧急的情况下xxx改怎么这么做，能有效解决什么事

确定好需求再定方案
首次弹窗是 后端做还是前端做 是根据产品需求在手机 还 用户

二八原则去开发，八分想，二分做，搞清楚这块是纯展示还是需要涉及逻辑，纯展示和逻辑处理，逻辑处理一般都放在父组件，ui上是不是可以直接拿图来解决，减少使用伪类情况，有的样式是不是基本上可以复用，避免一个重复性，考虑临界情况，过多过少
## git
犯了一个天大的错误
合并master是 拉取最新的master，然后在自己的分支使用merge 然后解决冲突，然后push 然后再让他们 完成合并

git config pull.rebase true 

一页代码，我改了，同时他也改了，
当你在本地完成工作，并且准备将更改提交到远程仓库时，一般的步骤是：

1. 使用 `git add` 将更改的文件添加到暂存区。
2. 使用 `git commit` 将暂存区的更改提交到本地仓库。
3. 使用 `git pull` 获取远程仓库的最新更改并尝试自动合并到你的本地仓库。
4. 如果在步骤 3 中没有发生冲突，或者你已经解决了所有冲突，那么可以使用 `git push` 将你的更改推送到远程仓库。

在这个流程中，`git merge` 是在你执行 `git pull` 时自动进行的。`git pull` 实际上是 `git fetch` 和 `git merge` 的组合。`git fetch` 会获取远程仓库的最新更改，但不会合并到你的本地仓库；`git merge` 则会尝试将这些更改合并到你的本地仓库。

如果你在 `git pull` 之后执行 `git merge`，那么可能没有任何效果，因为 `git pull` 已经尝试过合并了。如果 `git pull` 没有发生冲突，那么 `git merge` 就没有需要合并的内容；如果 `git pull` 发生了冲突，那么你需要先解决这些冲突，然后使用 `git add` 和 `git commit` 来提交解决冲突后的更改，而不是使用 `git merge`。


## postcss
`postcss-pxtorem` 是一个 PostCSS 插件，它可以将 CSS 中的 px 单位自动转换为 rem 单位。它主要用于移动端的响应式设计。
这个插件的原理其实非常简单。它会遍历你的 CSS 文件，找到所有的 px 单位，然后根据你设置的基准值（rootValue）将 px 单位转换为 rem 单位。转换的公式是：目标 px 值 / rootValue = 转换后的 rem 值。
例如，如果你设置的 rootValue 是 75，那么 150px 就会被转换为 2rem。
这个插件还提供了一些其他的选项，例如：
- `propList`：可以用来指定哪些属性需要转换，哪些属性不需要转换。例如，你可以设置 `propList: ['*', '!border*']`，这样就会转换所有属性，但不会转换 border 相关的属性。
- `selectorBlackList`：可以用来指定哪些选择器的规则不需要转换。
- `minPixelValue`：可以用来指定最小的像素值。如果一个值小于这个值，那么就不会被转换。
postcss-pxtorem 插件通常在项目的构建过程中使用，而不是在项目打包时调用。

## ts
interface 和 type

## 先发后置
先发后置https://zhuanlan.zhihu.com/p/291270190
取消请求  先发后置（作为一个亮点/难点）
实际上是一个可取消的promise，当前promise没有处理完，那这个promise就会取消掉。去执行最新的，也就是执行100次就只有最后一次有效，比发抖好一点
```JS
export const cancellablePromise = (promise) => {
  let canceled = false

  const p = new Promise((resolve, reject) => {
    promise.then((res) => {
      if (!canceled) resolve(res)
    }).catch(err => {
      if (!canceled) reject(err)
    })
  })

  return {
    instance: p,
    cancel: () => {
      canceled = true
    }
  }
}
```
具体使用
```JS
 let fetchListPromise: any = null  //组件外写
   const getList = async (page = 1) => {

    fetchListPromise && fetchListPromise.cancel()
    try {
      const fetchListPromise = cancellablePromise($getListInfo({
        rank_type: curMainTab.value,
        sub_rank_type: curSubTab.value,
        page,
        size: 50,
        year: searchObj.rank_year
      }))
    }
    catch (error) {
      console.log('error');
    }
  }
```
这个 `cancellablePromise` 函数通常在你希望有能力取消一个长时间运行的异步操作的情况下使用。这种情况通常发生在用户界面的交互中，例如：

假设你正在构建一个自动完成功能，当用户在输入框中输入文字时，你可能会发出一个异步网络请求来获取匹配的建议。每次用户输入一个字符，你都会发出一个新的请求。但是，如果用户快速输入了很多字符，那么就会有很多并发的请求。在这种情况下，你可能只关心最后一个请求的结果，而不关心前面的请求。

如果你使用原生的 Promise，那么你无法取消这些请求，你必须等待所有的请求都完成，然后忽略前面的请求的结果。这可能会浪费很多资源，而且可能会导致用户界面显示错误的结果（例如，一个早期请求的结果覆盖了一个后续请求的结果）。

如果你使用 `cancellablePromise`，那么你可以在发出新的请求之前取消旧的请求。这样，即使旧的请求仍然在运行，它们的结果也不会影响用户界面，因为它们的 Promise 已经被取消，不会调用 `resolve` 或 `reject`。

在这个示例中，每次用户输入改变时，我们都会取消旧的请求，然后开始一个新的请求。这样，我们就可以确保用户界面总是显示最新请求的结果，而不会被旧的请求的结果干扰。
