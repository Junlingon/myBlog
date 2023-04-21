---
title: 学习rc源码之select组件(二)
description: select组件中的Select文件
date: 2023-04-21
random: girl
tags:
    - REACT
---

## 总概
主要还是学习他的这个实现的思路，看他的核心代码
从上一篇可以知道，不论是她的baseSelect还是今天看的这个文件，都使用了React.forwardRef去包裹，这个小小的点其实就是非常值得我去思考为什么；其次就是React Context ，源码里简直用的太多，在业务代码中用 context 可能不多，大家更偏向于全局的状态管理库，比如 redux、mobx，那他是
最后通过他最后一次提交的commit中可以得知将选择逻辑从 BaseSelect 组件中移除，也就是说组件应该专注于实现它自己的功能，而把一些非本职责的任务、代码逻辑等剥离出来，放到相应的单元中去处理。

## React.forwardRef
### 作用
React.forwardRef 是 React 16.3 版本新增的功能，用于转发 refs 给子组件。它的作用是在跨组件传递 ref 时，可以更方便地完成 ref 的传递和使用，增强了组件之间的可组合性。

### 用法
需要定义一个函数，然后将该函数作为参数传递给 React.forwardRef，然后返回一个 React 组件。这个函数接收两个参数：props 和 ref，分别代表组件的属性和传递下来的 ref。

### 实例说明
```js
const Select = React.forwardRef(
  (props: SelectProps<any, DefaultOptionType>, ref: React.Ref<BaseSelectRef>) => {
  ...省去大段不需要的代码
    return (
      <SelectContext.Provider value={selectContext}>
        <BaseSelect ref={ref}/>
      </SelectContext.Provider>
    );
  },
);
```
可以清晰的看见 在组件中使用了传递进来的 ref 属性，在使用 Select 组件时，便通过 ref 来操作该组件内部的元素

另外，需要注意的是，React.forwardRef 只能转发 ref 属性，而不能转发其他属性，所以如果需要使用其他属性，需要在组件内部显式地处理这些属性。
下面是一个使用 React.forwardRef 的示例代码：
```js
import React, { useRef } from "react";

const MyComponent = () => {
  const SelectRef = useRef(null);

  const handleClick = () => {
    SelectRef.current.focus();
  };

  return (
    <div>
      <Select ref={buttonRef}>Click Me</Select>
      <button onClick={handleClick}>Focus Select</button>
    </div>
  );
};

const Select = React.forwardRef((props, ref) => {
  return (
    <select ref={ref} className="abc">
      {props.children}
    </select>
  );
});
```
在这个示例代码中，我们定义了一个父组件 MyComponent 和一个子组件 Select，然后我们通过将 ref 属性传递给 Select 组件，在 MyComponent 组件内部来操作 Select 组件。

## 开发组件的时候我不写不行吗
如果你写的组件没有涉及到跨组件传递 ref 的需求，那么不使用 React.forwardRef 包裹组件也是可以的。
但是如果你希望自己写的组件支持跨组件传递 ref 的功能，那么使用 React.forwardRef 进行包裹可以使代码更加简洁明了，也可以方便别的组件在使用时直接传递 ref，而不需要在内部处理 ref 属性，提高了组件的可重用性和可维护性。
此外，在 React 中使用 forwardRef 机制也是一个比较好的习惯，可以借鉴和学习现有组件库的设计思想和实现方式，提高自己的编码水平。因此，尽管在特定情况下不使用 React.forwardRef 包裹组件也是可行的，但还是建议掌握并使用这个机制。

## React Context

## 说明
React Context 是一种非常实用的数据传递方式，它使得我们可以轻松地在组件树中传递数据，避免了繁琐的 props 属性传递，同时也可避免数据的跨层级直接传递导致的组件耦合问题

向下传递数据：使用 Context.Provider 组件将数据传递给子组件。Provider 组件需要以 value 属性传递需要共享的数据。这样，包裹在 Provider 组件下的子组件就可以通过 Consumer 或 useContext hook 来获取 Context 对象中的数据。
```js
<MyContext.Provider value={/* 提供的数据 */}>
  <ChildComponent />
</MyContext.Provider>
```
在子组件中使用 Context：可以通过在子组件中使用 Consumer 组件或 useContext hook 来获取 Context 对象中的数据。Consumer 组件使用 render props 模式，需要传递一个函数作为子组件，而 useContext hook 相对更加简单易用，使用起来更加方便。
```js
<MyContext.Consumer>
  {value => /* 使用 value */}
</MyContext.Consumer>
// 或者使用 useContext hook
const value = useContext(MyContext);
```

## 组件运用
在一个单独的文件里面创建一个 Context 对象
`const SelectContext = React.createContext<SelectContextProps>(null);`
传的这个value值<SelectContext.Provider value={selectContext}>
是一个用React.useMemo包裹的一个对象

再去BaseSelect组件里去看看他是如何取到的
在useBaseProps这个hook文件里可以得知
```js
export const BaseSelectContext = React.createContext<BaseSelectContextProps>(null);

export default function useBaseProps() {
  return React.useContext(BaseSelectContext);
}

----------------------------------------------------------
return (
    <BaseSelectContext.Provider value={baseSelectContext}>{renderNode}</BaseSelectContext.Provider>
  );
```

通过 useContext hook 定义了一个名为 useBaseProps 的函数，该函数返回当前组件的 BaseSelectContext 的值。在调用 useBaseProps 时，当该组件位于 BaseSelectContext.Provider 组件的子树中，将会返回 BaseSelectContext 中的值。如果该组件不位于 BaseSelectContext.Provider 组件的子树中，则返回 BaseSelectContext 的默认值（即 null）。这种方式可以方便地跨组件传递数据，而无需通过逐层传递 props 属性的方式。

不过这里并没有使用到useBaseProps函数，或者是 BaseSelectContext.Consumer 或 useContext hook，
在baseSelectContext这个value中知道，其实他还是从props里去拿到的值
```js
 const baseSelectContext = React.useMemo(
    () => ({
      ...props, //这里
      notFoundContent,
      open: mergedOpen,
      triggerOpen,
      id,
      showSearch: mergedShowSearch,
      multiple,
      toggleOpen: onToggleOpen,
    }),
    [props, notFoundContent, triggerOpen, mergedOpen, id, mergedShowSearch, multiple, onToggleOpen],
  );
```

## 组件逻辑剥离

组件中很少去定义函数，一般都是自定义hook去封装好逻辑在hooks文件夹里，然后拿来调用，将状态逻辑从组件中抽离出来，使得组件更具可重用性和可维护性。

- useID 如果props中没有传递id值，那么就会生成自增的id
- useCache  避免在组件内多次重复的计算标签值和选项，如果缓存中已经存在对应的标签值和选项，则直接使用缓存中的数据，避免了重复的计算，提高了组件的运行效率。
- useLock 锁定/解锁的功能  在短时间内禁用用户的某些操作，以避免用户反复点击造成混乱。
- useSelectTriggerControl 监听全局的鼠标点击事件，如果用户点击了与下拉选择框无关的区域，则关闭下拉框。如果开发者自定义了触发器，则代码会忽略鼠标点击事件。