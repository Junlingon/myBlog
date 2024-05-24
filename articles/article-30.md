---
title: 先发后置
description: 实习中学到的新知识
date: 2023-11-29
random: tues 
tags:
    - api
---

先发后置https://zhuanlan.zhihu.com/p/291270190
取消请求  先发后置（作为一个亮点/难点）
实际上是一个可取消的promise，当前promise没有处理完，那这个promise就会取消掉。去执行最新的，也就是执行100次就只有最后一次有效，比发抖好一点
```js
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
```js
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