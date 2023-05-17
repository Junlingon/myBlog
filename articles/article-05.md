---
title: React16、17、18版本区别
description: 从背景和解决的痛点来阐述
date: 2023-03-25
random: art
tags:
    - HTML
    - CSS
    - REACT
---

# react-16
+ *渲染性能问题*：早期采用的是 Stack Reconciliation 算法，在组件状态变化时进行依次递归比较更新，无法在中途中断，造成视图的阻塞渲染。而 React Fiber 算法改进了 Stack Reconciliation，采了一种时间分片技术，可以把一个更新任务分片，每个片段让出执行权给浏览器，其他任务则等待；在新的任务到来时，它会中断之前的任务，重新分配时间片以保证优先级的合理性，提高页面性能。

+ *组件复杂度问题*：类式组件需要维护生命周期函数、状态属性、事件处理等很多逻辑，随着组件复杂度的增加，不易于组件逻辑的复用，而 Hooks 的出现被认为是函数式编程的一次进步，它可以把逻辑解耦成多个更小的，单独的，比较连贯的函数单元，便于组逻辑的封装和重用。

+ *组件之间状态共享问题*：之前实现组件的状态共享是通过状态提升和 HOC 方式而 Hooks 的 useReducer、useContext 和 useImperativeHandle 等钩子函数可以在组件间跨层级共享状态，在保证组件封装与复用的同时增强组件的灵活性和通用性。

+ *组件复杂度和可维护性问题*：在 提供的钩子函数 API 下，组件的函数间调用构成了直接的图形化结构，方便开发者查看代码调试用例，可维护性更加高效。同时，由于提了 state 和 effect 等钩子函数 API，进一步地把不同的逻辑清晰地拆分开，使代码逻辑更具可读性。  

因此，React 16 版本中引入 Hooks 和 React Fiber 是为了解决 React 早期在性能、复杂度和可维护性上存在的问题，让开发者更加高效地开发 React 应用。



# react-17版本新特性
看B站视频上一个老师说，17版本的最大特点就没特点🌟  
**React 17 版本主要解决以下两个问题：**  

+ 代码迁移问题：由于 React 17 版本中不再通过事件委派方式实现事件处理，而采用了直接绑定事件处理函数的方式，这就意味着在 React 中原本由 event 对象传递事件处理逻辑的方式无法再使用，需要对代码进行修改和适配，这样会影响到已经存在的 React 应用的迁移工作。React 17 将进行向后兼容中断，保证旧版本仍然按照以前的方式运行，同时在新版本中逐步引入新的 API，给予用户更长的调整时间，使代码迁移变得更加平滑。  

+ 事件处理问题：在 React 16 及之前的版本中，事件处理的机制采用的是事件委派，在事件冒泡阶段处理事件，但这种方式容易导致事件性能问题，尤其是在复杂应用中，大量事件绑定会增加漫长的事件冒泡和依次执行过程，从而影响页面的性能。而 React 17 版本中通过直接绑定事件处理函数的方式来处理事件，从而减少了冒泡过程中的性能消耗。  

总之，React 17 的背景是为了保证 React 应用的兼容性和稳定性，在解决事件处理问题的同时，还能兼顾向后兼容，逐渐引入新的 API，便于开发者根据实际需求进行使用，这也是 React 长期维护的重要举措。


# react-18版本新特性
### 一、客户端渲染 API

带有 createRoot() 的 root API，替换现有的 render() 函数，提供更好的人体工程学并启用新的并发渲染特性。

```js
import { createRoot } from "react-dom/client";
import { useState } from 'react'

const App = () => {
  const [A, setA] = useState(1);
  const [B, setB] = useState(1);
  
  const handleClick = () => {
    setA((a) => a + 1);
    setB((b) => b - 1);
  };

  setTimeout(() => {
    setA((a) => a + 1);
    setB((b) => b - 1);
  }, 1000);
  
  return (<div>
    <p>{A}</p>
    <p>{B}</p>
  </div>);
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);

root.unmount(); //卸载组件
```
如果你的项目使用了ssr服务端渲染，需要把ReactDOM.hydrate升级为ReactDOM.hydrateRoot

```js
import { hydrateRoot } from "react-dom/client";

const container = document.getElementById("app");
const root = hydrateRoot(container, <App tab="home" />);
```
在某些场景下 我们可能不需要批处理状态更新, 此时我们需要用到 react-dom 提供的flushSync函数, 该函数需传入一个回调, 并且会同步刷新回调中的状态更新

```js
import { useState } from 'react'
import { flushSync } from 'react-dom'
 
function App() {
  const [num1, setNum1] = useState(1)
  const [num2, setNum2] = useState(1)
  
  const add = () => {
    setTimeout(() => {
      flushSync(() => {
        setNum1((pre) => pre + 1)
      })
      
      flushSync(() => {
        setNum2((pre) => pre + 1)
      })
    })
  }
  console.log('渲染了')
  console.log(num1, num2)
  
  return (
    <div className="App">
      <header className="App-header">react 18</header>
      <p>num1 : {num1}</p>
      <p>num2 : {num2}</p>
      <button onClick={add}>+1</button>
    </div>
  )
}
 
export default App
```

### 二、严格模式更新

React 18 带来了大把新特性，此外还有很多新特性正在路上。为了让你的代码为此做好准备，StrictMode 变得更加严格了。最重要的是，StrictMode 将测试组件对可重用状态的弹性，模拟一系列的挂载和卸载行为。它旨在让你的代码为即将推出的特性（可能以组件的形式）做好准备，这将在组件的挂载周期中保留这个状态。

虽然它肯定会在未来提供更好的性能，但就目前而言，启用 StrictMode 时必须要考虑这个事情。

除了以上提到的更改之外，根据你的 React 代码库，你可能还会发现其他一些更改。

值得一提的是，React 18 将不再支持 IE 浏览器，因为 React 18 现在依赖很多现代浏览器特性，如 Promise 或 Object.assign。

其余的更改与一些 React 行为的稳定性和一致性有关，不太可能影响你的代码库。

### 三、Transition

Transition 是由并发渲染提供支持的新特性之一。它旨在与现有状态管理 API 一起使用，以区分紧急和非紧急状态更新。通过这种方式，React 知道哪些更新需要优先考虑，哪些更新需要在后台通过并发渲染准备。

```js
import { useTransition, useState } from "react";

const App = () => {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(0);

  function handleClick() {
    startTransition(() => {
      setValue((value) => value + 1);
    });
  }

  return (
    <div>
      {isPending && <Loader />}
      <button onClick={handleClick}>{value}</button>
    </div>
  );
};
```

在 startTransition() 回调中提交的任何状态更新都将被标记为 transition，从而使其他更新具有优先权。如果你不能使用这个钩子，还有一个单独的 startTransition() 函数可用——虽然它不会通知你转换的进度。

```js
import { startTransition } from "react";
// ...
startTransition(() => {
  // Transition updates
});
// ...
```
# React 16、17、18的主要区别如下：

React 16：

-   引入了Fiber架构，可以实现更高效的渲染控制和调度；
-   支持Error Boundaries，可以更好地处理组件渲染时的错误；
-   支持Portals，可以将组件渲染到DOM树之外的任意位置；
-   支持新的Context API，可以更方便地实现跨组件的状态共享。

React 17：

-   改进了事件系统，可以更好地处理原生DOM事件；
-   改进了自定义DOM属性的处理方式，可以更好地遵循HTML标准；
-   改进了Server Rendering，可以更好地支持异步数据加载和渲染。

React 18：

-   引入了新的函数式组件API，可以更方便地编写无状态组件；
-   改进了React Server Components，可以更好地支持Server Rendering；
-   引入了新的渐进式升级功能，可以更方便地升级应用程序；
-   引入了新的性能分析工具，可以更方便地定位性能问题。

总的来说，React 17和React 18主要是在性能和开发体验方面进行了改进和优化，而React 16则是在架构和功能方面进行了升级。开发者可以根据具体的需求和场景选择适合自己的React版本。


