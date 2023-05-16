---
title: 深入react之七大经典问题
description: 记录 && 总结
date: 2023-05-06
random: nba
tags:
    - REACT
---


# 在无状态组件每一次函数上下文执行的时候，react用什么方式记录了hooks的状态？
React使用一个称为“链表”的数据结构来记录每个函数组件的hook状态以及它们的顺序。每个hook函数都有它自己的节点，用来保存它当前的状态值。当组件重新渲染时，React会通过链表顺序遍历节点，读取它们的状态值，并将其传递给组件的JSX代码。这样，在多次函数执行的上下文中，React就能保证每个hook函数返回的状态值都是正确的，并且没有混淆。  


# 多个react-hooks用什么来记录每一个hooks的顺序的 ？换个问法！为什么不能条件语句中，声明hooks? hooks声明为什么在组件的最顶部？
React使用一个称为“Fiber”（纤程）的数据结构来记录每个组件的渲染过程，包括hooks的顺序和状态。每个组件都有一个Fiber节点，其中包含该组件的相关信息和hooks的相关信息。Fiber节点通过链表结构连接起来，形成一个完整的渲染树。
Hooks是基于调用顺序来管理状态的，即使两个hooks完全一样，但是它们在组件中的调用顺序不同，它们也会有不同的状态。因此，React严格禁止在条件语句、循环语句或嵌套函数等语法块中声明hooks，因为这样会导致hooks的调用顺序出现问题，使得状态无法正确管理，从而引发各种难以追踪的Bug。  
因为一旦在条件语句中声明hooks，在下一次函数组件更新，hooks链表结构，将会被破坏，current树的memoizedState缓存hooks信息，和当前workInProgress不一致，如果涉及到读取state等操作，就会发生异常。 


# function函数组件中的useState，和 class类组件 setState有什么区别？ 
+ 语义不同。useState返回一个数组，该数组包含一个最新状态和状态的函数，而setState则接受一个对象或函数作为参数，用于指定变更的状态值。
+ 对于class组件，我们只需要实例化一次，实例中保存了组件的state等状态。对于每一次更新只需要调用render方法就可以。但是在function组件中，每一次更新都是一次新的函数执行，为了保存一些状态,执行一些副作用钩子,react-hooks应运而生，去帮助记录组件的状态，处理一些额外的副作用。
+ 更新方式不同。在处理多个状态时，useState是可以同时处理多个状态的，而setState则需要对不同的状态进行单独的设置。此外，useState的状态更新是基于合并的方式实现的，而setState的状态更新是基于换的方式实现的。


# react 是怎么捕获到hooks的执行上下文，是在函数组件内部的？
在 hooks 函数调用时，React 可以通过当前 Fiber 节点中的 hooks 链表来获取到当前组件的 hooks 信息，从而获取到 hooks 的执行上下文以及状态值。  
对于第一次渲染组件，那么用的是HooksDispatcherOnMount hooks对象。
对于渲染后，需要更新的函数组件，则是HooksDispatcherOnUpdate对象，那么两个不同就是通过current树上是否memoizedState（hook信息）来判断的。如果current不存在，证明是第一次渲染函数组件。  
接下来，调用Component(props, secondArg);执行我们的函数组件，我们的函数组件在这里真正的被执行了，然后，我们写的hooks被依次执行，把hooks信息依次保存到workInProgress树上。  
接下来将ContextOnlyDispatcher赋值给 ReactCurrentDispatcher.current，由于js是单线程的，也就是说我们没有在函数组件中调用的hooks，都是ContextOnlyDispatcher对象上hooks
```javascript
const ContextOnlyDispatcher = {
    useState:throwInvalidHookError
}
function throwInvalidHookError() {
  invariant(
    false,
    'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
      ' one of the following reasons:\n' +
      '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
      '2. You might be breaking the Rules of Hooks\n' +
      '3. You might have more than one copy of React in the same app\n' +
      'See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.',
  );
}
```
通过这种函数组件执行赋值不同的hooks对象方式，判断在hooks执行是否在函数组件内部，捕获并抛出异常的。

# useEffect,useMemo 中，为什么useRef不需要依赖注入，就能访问到最新的改变值？
在 useEffect 和 useMemo 中使用的依赖数组是用来控制 useEffect 和 useMemo 在何时重新执行的。当依赖中的值发生变化时，React 会比较新旧依赖数组的值，只有当某一个依赖项发生变化时，才会触发 和 useMemo 的重新执行。
而 useRef 是一个 Hook 函数，它返回一个对象的引用，该引用对象的 current 属性指向一个可变的 current 值。useRef 并不会触发组件的重新渲染，它是用来存储引用值的，而这个引用值可以是任何可以保存在 JavaScript 变量中的值，包括对象、数组等。
当 useRef 返回的引对象中的 current 值发生变化时，并不会触发组件的重新染，因为 useRef 不在 useEffect 和 useMemo 的依赖数组中，它不会影响这两个 Hook 函数的执行。因此，我们可以在 useEffect 和 useMemo 中使用 useRef 返回的引用对象，而不必将它加入依赖数组中注入依赖，这样就可以访问到最新的改变值了。

总之，useRef 的使用特点是它返回一个引用值，并且它的变化不会触发组件的重新渲染，所以不需要在 useEffect 和 useMemo 中注入依赖。而 useEffect 和 useMemo 中需要注入依赖，是为了控制它们的执行时机，只有在某些依赖项发生变化时才会重新执行。


# useMemo是怎么对值做缓存的？如何应用它优化性能？
```js
function updateMemo(
  nextCreate,
  deps,
) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps; // 新的 deps 值
  const prevState = hook.memoizedState; 
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1]; // 之前保存的 deps 值
      if (areHookInputsEqual(nextDeps, prevDeps)) { //判断两次 deps 值
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```
在组件更新过程中，我们执行useMemo函数，做的事情实际很简单，就是判断两次 deps是否相等，如果不想等，证明依赖项发生改变，那么执行 useMemo的第一个函数，得到新的值，然后重新赋值给hook.memoizedState,如果相等 证明没有依赖项改变，那么直接获取缓存的值。  

使用 useMemo 优化性能的一般流程是：

- 确定哪些计算结果需要进行缓存，找出耗时的计算过程。
- 将这些计算过程封装到 useMemo 回调函数中。
- 将影响计算过程的变量作为依赖项传入 useMemo 的第二个参数中。
- 在组件中使用缓存的计算结果。


# 为什么两次传入useState的值相同，函数组件不更新?
每当组件重新渲染时，它都会执行一遍函数组件来获取最新的状态值，并将其存储起来。如果两次传入的初始值相同，那么第二次触发函数组件时，它会检测到状态值没有变化，所以不会重新渲染例如，下面的代码中，两次传入的初始值都为 1，导致组件第二次执行时，状态值没有变化，所以不会触发更新。
```js
function MyComponent() {
  const [value, setValue] = useState(1);
  console.log('render component');
  return (
    <div>
      <button onClick={() => setValue(2)}>Set value to 2</button>
    </div>
  );
}
```
如果想要更改状态值后重新触发组件更新，可以使用 useEffect 钩子来监听状态值的变化，例如
```jsx
function MyComponent() {
const [value, setValue] = useState(1);
useEffect(() => {
console.log('state updated');
}, [value]);
return (

<button onClick={() => setValue(2)}>Set value to 2

);
}
```
这样，当状态值发生变化时，`useEffect` 钩子就会被触发，从而重新渲染组
