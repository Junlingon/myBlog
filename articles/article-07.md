---
title: 学习rc源码之select组件(一)
description: select组件中的BaseSelect文件
date: 2023-04-18
random: book
tags:
    - REACT
---

## 总概
总体上看860行代码还是非常多的，感觉是块难啃的骨头

依赖引入20行；ts类型声明近200行 ；BaseSelect组件600+行

600多行中 先抛去其他不看 只看render部分其实只有这么一句话
```js
  return (
    <BaseSelectContext.Provider value={baseSelectContext}>{renderNode}</BaseSelectContext.Provider>
  );
```
封装的组件特别多

所以我决定从这里开始往回倒推着来看

## BaseSelectContext
可以查询到这个东西是引入得到的
```js
import { BaseSelectContext } from './hooks/useBaseProps';
```
顺藤摸瓜，找到useBaseProps.ts文件，打开一看只有20行，很舒服，1E0B1A9B.png（hhh）

```js
/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

import * as React from 'react';
import type { BaseSelectProps } from '../BaseSelect';

export interface BaseSelectContextProps extends BaseSelectProps {
  triggerOpen: boolean;
  multiple: boolean;
  toggleOpen: (open?: boolean) => void;
}

export const BaseSelectContext = React.createContext<BaseSelectContextProps>(null);

export default function useBaseProps() {
  return React.useContext(BaseSelectContext);
}

```
- 知识点一：ts中interface接口可以继承其他类型，并且添加独属于自己的属性，这是type做不到的
- 知识点二： React.createContext的使用，用于发布订阅，在上游组件中创建一个 Context，通过 Provider 向下游组件传递数据；在下游组件中，可以使用 useContext 钩子或者 Consumer 组件获取上下文数据。

综上可以知道，BaseSelectContext为了方便在组件内部共享数据，triggerOpen: boolean 表示下拉菜单的打开状态；multiple: boolean 表示是否为多选模式；toggleOpen: (open?: boolean) => void 一个回调函数，用于切换下拉菜单的打开状态。

### baseSelectContext
这是向下传递的props
写在BaseSelect组件里的
```js
  const baseSelectContext = React.useMemo(
    () => ({
      ...props,
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
这段代码使用了 React.useMemo API，用于创建一个 memoized（记忆化）的上下文对象。useMemo 接收两个参数，第一个参数是一个函数，返回一个值；第二个参数是一个数组，包含了依赖变量，在依赖变量发生变化时，会重新计算 memoized 值。在这个例子中，依赖变量包含了 props、notFoundContent、triggerOpen、mergedOpen、id、mergedShowSearch、multiple 以及 onToggleOpen 等。

返回的参数是一个对象，包含了一些属性，例如 notFoundContent、open、multiple 等。这些属性的值来源于传递给组件的 props，以及一些计算得出的值，例如 mergedOpen、triggerOpen 等。这段代码中使用了对象展开运算符 ... 来复制 props 的所有属性，并添加了其他一些属性，从而创建了一个新的对象。

需要注意的是，这个 memoized 对象只有在依赖项发生变化时才会被重新计算，否则会从缓存中复用之前计算的结果。`这样可以避免在每次组件渲染时都重新创建这个对象，提高性能。`

## renderNode
```js
 // >>> Render
  let renderNode: React.ReactNode;

  // Render raw
  if (customizeRawInputElement) {
    renderNode = selectorNode;
  } else {
    renderNode = (
      <div
        className={mergedClassName}
        {...domProps}
        ref={containerRef}
        onMouseDown={onInternalMouseDown}
        onKeyDown={onInternalKeyDown}
        onKeyUp={onInternalKeyUp}
        onFocus={onContainerFocus}
        onBlur={onContainerBlur}
      >
        {mockFocused && !mergedOpen && (
          <span
            style={{
              width: 0,
              height: 0,
              position: 'absolute',
              overflow: 'hidden',
              opacity: 0,
            }}
            aria-live="polite"
          >
            {/* Merge into one string to make screen reader work as expect */}
            {`${displayValues
              .map(({ label, value }) =>
                ['number', 'string'].includes(typeof label) ? label : value,
              )
              .join(', ')}`}
          </span>
        )}
        {selectorNode}
        {arrowNode}
        {clearNode}
      </div>
    );
  }
```
这段代码根据是否存在 customizeRawInputElement，来渲染不同的节点。如果存在 customizeRawInputElement，则直接渲染 selectorNode，否则渲染一个包含了多个子节点的 <div> 元素。
其中，子节点包括：

<span> 元素，用于给 screen reader 提供有意义的信息。aria-live="polite" 属性表示这个元素的内容是“有礼貌”的，意味着会在无障碍模式下自动读出来，但不会打断正在读的内容。displayValues 是一个数组，包含了当前选中的选项，通过 map 方法将它们的 label 或者 value 拼接成一个字符串。
selectorNode，即自定义的选择器节点。
arrowNode，表示下拉箭头的节点。
clearNode，表示清除按钮的节点。
另外，代码还为这个 <div> 元素设置了一些事件监听器，例如 onMouseDown、onKeyDown、onKeyUp 等。在 ref 中绑定了 containerRef，用于引用这个元素的 DOM 节点。在 CSS 类名中引用了 mergedClassName，这个类名是根据传入的 className，以及一些计算得出的状态值进行合并的。
最终，这个 renderNode 变量中包含了要渲染的 React 节点。

### selectorNode
```javascript
const selectorNode = (
    <SelectTrigger
      ref={triggerRef}
      disabled={disabled}
      prefixCls={prefixCls}
      visible={triggerOpen}
      popupElement={optionList}
      containerWidth={containerWidth}
      animation={animation}
      transitionName={transitionName}
      dropdownStyle={dropdownStyle}
      dropdownClassName={dropdownClassName}
      direction={direction}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      dropdownRender={dropdownRender}
      dropdownAlign={dropdownAlign}
      placement={placement}
      builtinPlacements={builtinPlacements}
      getPopupContainer={getPopupContainer}
      empty={emptyOptions}
      getTriggerDOMNode={() => selectorDomRef.current}
      onPopupVisibleChange={onTriggerVisibleChange}
      onPopupMouseEnter={onPopupMouseEnter}
    >
      {customizeRawInputElement ? (
        React.cloneElement(customizeRawInputElement, {
          ref: customizeRawInputRef,
        })
      ) : (
        <Selector
          {...props}
          domRef={selectorDomRef}
          prefixCls={prefixCls}
          inputElement={customizeInputElement}
          ref={selectorRef}
          id={id}
          showSearch={mergedShowSearch}
          autoClearSearchValue={autoClearSearchValue}
          mode={mode}
          activeDescendantId={activeDescendantId}
          tagRender={tagRender}
          values={displayValues}
          open={mergedOpen}
          onToggleOpen={onToggleOpen}
          activeValue={activeValue}
          searchValue={mergedSearchValue}
          onSearch={onInternalSearch}
          onSearchSubmit={onInternalSearchSubmit}
          onRemove={onSelectorRemove}
          tokenWithEnter={tokenWithEnter}
        />
      )}
    </SelectTrigger>
  );
```
一眼看下来，传入的props可真多啊；

这段代码定义了 selectorNode 变量，它是一个包含了 <SelectTrigger> 和其他子元素的 React 组件。<SelectTrigger> 是 import SelectTrigger from './SelectTrigger';用于包裹下拉选项列表的容器组件，可以控制下拉菜单的展示状态和位置等，通过接受一些 props 来进行定制化配置。

下面是这段代码中用到的一些 props：

- ref：用于引用 <SelectTrigger> 组件的 DOM 元素，可以通过 triggerRef 来进行绑定。
- disabled：是否禁用选择器组件。
- prefixCls：组件的 CSS 类名前缀。
- visible：下拉选项列表是否可见。
- popupElement：下拉选项列表的内容。这里是通过 optionList 变量来传入的。
- containerWidth：选择器组件的宽度。
- animation：下拉动画的配置。可以传入一个对象来进行更细粒度的控制。
- transitionName：下拉动画的类名前缀。
- dropdownStyle：下拉选项列表的样式。
- dropdownClassName：下拉选项列表的 CSS 类名。
- direction：下拉选项列表的弹出方向。
- dropdownMatchSelectWidth：下拉选项列表的宽度是否和选择器组件对齐。
- dropdownRender：自定义下拉选项列表的渲染方式。
- dropdownAlign：下拉选项列表的对齐方式。
- placement：下拉选项列表相对于选择器组件的定位方式。
- builtinPlacements：内置的下拉选项列表定位方式，可以通过传入自定义的对象来覆盖。
- getPopupContainer：获取下拉选项列表的容器的方法，可以传入一个函数来返回一个 DOM 元素。
- empty：是否存在空选项。
- getTriggerDOMNode：获取选择器组件的 DOM 元素的方法，可以传入一个函数来返回一个 DOM 元素。
- onPopupVisibleChange：下拉选项列表的可见状态发生变化时的回调函数。
- onPopupMouseEnter：鼠标进入下拉选项列表时的回调函数。
此外，selectorNode 还包含了一个条件渲染的子组件，即 customizeRawInputElement ? ... : <Selector ... />：

如果存在 customizeRawInputElement，则克隆这个自定义的输入框组件，并将它的 ref 绑定到 customizeRawInputRef，从而实现直接使用自定义的输入框。这个自定义输入框组件通常是一个原生的 <input> 元素。
如果不存在 customizeRawInputElement，则渲染默认选择器组件 <Selector>，并传入一些 props 进行定制，例如 showSearch 表示是否开启搜索功能，values 表示当前已选中的选项等。这个选择器组件包含了一个输入框和一个选项列表，用于实现选择下拉框的核心功能。

#### Selector
简化代码如下
```js
 const selectNode =
    mode === 'multiple' || mode === 'tags' ? (
      <MultipleSelector {...props} {...sharedProps} />
    ) : (
      <SingleSelector {...props} {...sharedProps} />
    );

  return (
    <div
      ref={domRef}
      className={`${prefixCls}-selector`}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {selectNode}
    </div>
  );
```
这段代码定义了一个名为 selectNode 的变量，根据传入的 mode 属性的不同，选择渲染不同类型的选择器组件。如果 mode 是 multiple 或 tags，则渲染多选选择器组件 <MultipleSelector>，否则渲染单选选择器组件 <SingleSelector>。这两个组件都继承了共用的一些属性，通过 ES6 的解构语法 ...props 和 ...sharedProps 分别将它们传递给了子组件。

之后，这个选择器组件会被包裹在一个 <div> 元素中，并设置了一些事件处理函数，例如 onClick 和 onMouseDown。这里给这个 <div> 元素绑定了一个 ref 属性，用于将这个元素的 DOM 引用保存到组件实例中，从而方便在其他地方引用这个元素。

最后，selectNode 会被渲染到这个包裹元素中，完成选择器组件的渲染

`multiple 和 tags 都是 Select 组件的两种不同的选择模式。`

- multiple 模式表示可以选中多个选项，渲染成一个可以多选的下拉框，每个选项都有一个可点击的复选框。
- tags 模式表示可以自由输入选择项，并将输入的内容作为新的选项添加到选项列表中，渲染成一个可以输入或选择多个选项的下拉框。在输入时，如果输入的内容不存在于选项列表中，则会自动将其添加为新的选项。
这两种模式的使用场景不同，可以根据具体需求进行选择。如果需要用户自由输入选项，或者需要允许选择多个选项，那么就应该使用相应的选择模式。


## 最后
这个小小文件里包括了好几个封装好的组件，基本上每个组件又写了非常多的props，眼花缭乱
值得注意的一点是他使用了
```js
const BaseSelect = React.forwardRef((props: BaseSelectProps, ref: React.Ref<BaseSelectRef>) => {})
```
React.forwardRef 是 React 提供的一个高阶组件，可以用来将 ref 透传到组件的子组件中，从而实现父组件和子组件的通信。通过 React.forwardRef，开发者可以使用 ref 属性访问子组件实例，并在必要的时候直接调用子组件的方法或操作子组件的状态。这种方式可以让父组件与子组件实现紧密的交互，以达到更好的拆分组件的目的。
总之，React.forwardRef 的作用不仅限于父子组件通信，还可以将 ref 透传到组件需要操作的 DOM 元素中，优化代码的可读性和可维护性，同时提高了代码的复用性。
BaseSelect 组件中用到的 ref 属性在 SingleSelector 和 MultipleSelector 子组件中定义，包裹在 forwardRef 中的组件会将这些子组件作为其渲染的内容，并将它们的 ref 对象透传到更高层的组件，最终将它们传递给组件的父组件。这样就能够通过 ref 属性获取到子组件实例，实现对子组件对应的 DOM 元素或状态值进行操作，达到组件间的通信。
这是我在开发MineEX-UI的select组件中没考虑到的

