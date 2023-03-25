---
title: React16、17、18版本新特性
description: 
date: 2023-03-25
random: art
tags:
    - HTML
    - CSS
    - REACT
---

# react-16版本新特性
### 一、hooks

```js
import { useState } from 'react'
 
function App() {
  // 参数：状态初始值比如,传入 0 表示该状态的初始值为 0
  // 返回值：数组,包含两个值：1 状态值（state） 2 修改该状态的函数（setState）
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => { setCount(count + 1) }}>{count}</button>
  )
}
export default App
```

### 二、memo、lazy、Suspense
Memo是React中的高级功能，它可以记忆组件的输出结果，并在组件的输入数据不变的情况下，直接返回记忆的结果，从而优化应用的性能。Memo组件可以接受一个回调函数作为参数，该回调函数返回新的输出结果。当Memo组件的输入数据发生变化时，会调用回调函数，重新计算输出结果。

Lazy是React 16.6版本中新增的功能，它可以实现组件的懒加载。懒加载是指当组件需要渲染时，才会进行加载和初始化，而不是在应用启动时就加载和初始化。这可以提高应用的性能，并减少应用的初始加载时间。Lazy组件可以接受一个函数作为参数，该函数返回需要懒加载的组件。

Suspense是React 16.6版本中新增的功能，它可以实现组件的异步加载。异步加载是指当组件需要渲染时，如果组件的依赖项还没有加载完成，就会显示一个占位符，直到依赖项加载完成后再显示组件。这可以提高应用的性能，并减少应用的初始加载时间。Suspense组件可以接受一个fallback属性，该属性指定一个占位符组件。当异步加载的组件还没有加载完成时，就会显示该占位符组件。
```js
import React, { Suspense } from 'react';
 
const OtherComponent = React.lazy(() => import('./OtherComponent'));
function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

### 三、Profiler

Profiler 能添加在 React 树中的任何地方来测量树中这部分渲染所带来的开销

```js
function onRenderCallback(
    id, // 发生提交的 Profiler 树的 “id”
    phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
    actualDuration, // 本次更新 committed 花费的渲染时间
    baseDuration, // 估计不使用 memoization 的情况下渲染整棵子树需要的时间
    startTime, // 本次更新中 React 开始渲染的时间
    commitTime, // 本次更新中 React committed 的时间
    interactions // 属于本次更新的 interactions 的集合
) {
    // 合计或记录渲染时间。。
    console.log(
      id, // 发生提交的 Profiler 树的 “id”
      phase, // "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
      actualDuration, // 本次更新 committed 花费的渲染时间
      baseDuration, // 估计不使用 memoization 的情况下渲染整棵子树需要的时间
      startTime, // 本次更新中 React 开始渲染的时间
      commitTime, // 本次更新中 React committed 的时间
      interactions // 属于本次更新的 interactions 的集合
    );
}
//Navigation update 0 0 57313.90000009537 57314.5 Set(0) {size: 0}
 
<Profiler id="Navigation" onRender={onRenderCallback}>
  <div
    onClick={() => {
      setNumber((e) => e + 1);
    }}
  >
    test
  </div>
</Profiler>
```

### 四、createContext、createRef、forwardRef、生命周期函数的更新、Strict Mode

```js
// 父组件中
const ThemeContext = React.createContext("light");

const ParentComponent = () => {
  const inputRef = createRef();
  
  return (
    <ThemeContext.Provider value="dark">
      <ChildComponent ref={inputRef} />
      <button
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        获取焦点
      </button>
    </ThemeContext.Provider>
  );
}

//子组件
const ChildComponent = forwardRef((props, inputRef) => {
  const value = useContext(ThemeContext);
  
  return (
    <>
      <input id="input" type="text" ref={inputRef} />
      <button
        style={{ background: "yellow" }}
        onClick={() => {
          console.log(value);
        }}
      >
        测试
      </button>
    </>
  );
});
```


### 五、Fragment

```js
<React.Fragment>
  <ChildA />
  <ChildB />
  <ChildC />
</React.Fragment>
```


### 六、createPortal

`ReactDOM.createPortal(child, container)`

# react-17版本新特性
### 一、全新的 JSX 转换

React 17以前，React中如果使用JSX，则必须像下面这样导入React，否则会报错，这是因为旧的 JSX 转换会把 JSX 转换为 React.createElement(…) 调用。

```js
import React from 'react';
export default function App(props) {
  return <div>app </div>;
}
```

### 二、事件委托的变更

在 React 16 或更早版本中，React 会由于事件委托对大多数事件执行 document.addEventListener()。但是一旦你想要局部使用React，那么React中的事件会影响全局，当把React和jQuery一起使用，那么当点击input的时候，document上和React不相关的事件也会被触发，这符合React的预期，但是并不符合用户的预期。

React React17不再将事件添加在document上，而是添加到渲染 React 树的根 DOM 容器中：

```js
const rootNode = document.getElementById('root');
ReactDOM.render(<App />, rootNode);
```


### 三、事件系统相关更改

除了事件委托这种比较大的更改，事件系统上还发生了一些小的更改，与以往不同，React 17中onScroll 事件不再冒泡，以防止出现常见的混淆 。

React 的 onFocus 和 onBlur 事件已在底层切换为原生的 focusin 和 focusout 事件。它们更接近 React 现有行为，有时还会提供额外的信息。

捕获事件（例如，onClickCapture）现在使用的是实际浏览器中的捕获监听器。这些更改会使 React 与浏览器行为更接近，并提高了互操作性。

注意：尽管 React 17 底层已将 onFocus 事件从 focus 切换为 focusin，但请注意，这并未影响冒泡行为。在 React 中，onFocus 事件总是冒泡的，在 React 17 中会继续保持，因为通常它是一个更有用的默认值。

### 四、去除事件池

在React 17 以前，如果想要用异步的方式使用事件e，则必须先调用调用 e.persist() 才可以，这是因为 React 在旧浏览器中重用了不同事件的事件对象，以提高性能，并将所有事件字段在它们之前设置为 null。如下面的例子：

```js
function FunctionComponent(props) {
  const [val, setVal] = useState("");
  const handleChange = e => {
    // setVal(e.target.value);
    // React 17以前，如果想用异步的方式使用事件e，必须要加上下面的e.persist()才可以
    // e.persist();
    // setVal(data => e.target.value);
  };
  return (
    <div className="border">
      <input type="text" value={val} onChange={handleChange} />
    </div>
  );
}
```
但是这种使用方式有点抽象，经常会让对React不太熟悉的开发者懵掉，但是值得开心的是，React 17 中移除了 “event pooling（事件池）“，因为以前加入事件池的概念是为了提升旧浏览器的性能，对于现代浏览器来说，已经不需要了。因此，上面的代码中不使用e.persist()；也能达到预期效果。

### 五、副作用清理时间

React 17以前，当组件被卸载时，useEffect和useLayoutEffect的清理函数都是同步运行，但是对于大型应用程序来说，这不是理想选择，因为同步会减缓屏幕的过渡（例如，切换标签），因此React 17中的useEffect的清理函数异步执行，也就是说如果要卸载组件，则清理会在屏幕更新后运行。如果你某些情况下你仍然希望依靠同步执行，可以用 useLayoutEffect。

### 六、启发式更新算法更新

React 16开始替换掉了`Stack Reconciler`，开始使用启发式算法架构的的`Fiber Reconciler`。那么为什么要发生这个改变呢？

React的killer feature： virtual dom

- React15.x - Stack Reconciler
- React16 - Fiber Reconciler
- React17 - Fiber Reconciler (进阶版 - 优先级区间)
1. 为什么需要fiber：对于大型项目，组件树会很大，这个时候递归遍历的成本就会很高，会造成主线程被持续占用，结果就是主线程上的布局、动画等周期性任务就无法立即得到处理，造成视觉上的卡顿，影响用户体验。
2. 任务分解的意义：解决上面的问题
3. 增量渲染（把渲染任务拆分成块，匀到多帧）
4. 更新时能够暂停，终止，复用渲染任务
5. 给不同类型的更新赋予优先级
6. 并发方面新的基础能力
7. 更流畅

React 17中更新了启发式更新算法，具体表现为曾经用于标记fiber节点更新优先级的expirationTime换成了为lanes，前者为普通数字，而后者则为32位的二进制，了解二进制运算的都比较熟悉了，这种二进制的lanes是可以指定几个优先级的，而不是像以前expirationTime只能标记一个。

之所以做这种改变，原因就是在于`expirationTimes`模型不能满足`IO操作`（Suspense），Suspense用法如下：

```js
<React.Suspense fallback={<Loading />}>
   <Content />
</React.Suspense>
```

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


