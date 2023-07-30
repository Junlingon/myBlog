---
title: 前端UI组件务实开发指南
description: 腾讯云智实习 记录 && 总结
date: 2023-07-30
random: Lego
tags:
    - REACT
---

# 1 整体思路
UI 组件，最主要的功能是完成视图层的展示和交互，以 HTML 原生的 选择器 <select> 为例，它给用户展示可选择的选项和当前选中的选项，用户通过鼠标、键盘或其他交互方式，改变选中项。  

出于体验的考虑，我们很有可能会打破原生 <select> 的样式和功能，例如保留 Label 提示、自定义下拉列表的样式、支持多选，支持搜索选项等等，大部分情况下需要自己再封装符合交互视觉规范和功能要求的 选择器 Select 组件。  

可以肯定的说，是产品体验的一致性决定了 UI 组件的复用性，有了复用性，才有了开发效率上的体现。  

针对 UI 组件的封装，应该只保留组件在视图层的展示和交互，剥离所有数据和业务处理的逻辑，UI 组件通过 API 向业务暴露数据和逻辑接口，API 就是组件的功能，API 的好与坏，决定了组件在开发者端的体验，因此对 UI 组件的 API 设计需要非常慎重。  


总结一下，我们明确了 UI 组件库的两个核心是 UI 和 API ，一方面面向界面和终端用户，另一方面面向数据、逻辑和开发者，接下来我们再详细探讨。  

# 2 UI 实现
## 2.1 视觉样式：
颜色（文字颜色、背景颜色、边框颜色、透明度等）
字体属性（字体族、字号、字重等）
排版（标题、段落、引用、注释等等）
边框圆角（尺寸、弧形角度）
阴影（角度、远近）
间距（水平、垂直）
插画
图标

## 2.2 动效样式（以 Material Design 为例）：
时长 & 缓动
移动
材料形变
编排
以上设计规范应该以全局作用域形式抽到 UI 组件库的公共样式，保证在风格上的一致性的。


## 2.3 主题配置
站在工程的角度，UI 组件库通过主题（风格）的配置，可以让一套 UI 组件库在不同的场景中使用，因此主题配置，换肤功能也是成熟的 UI 组件库必须具备的功能。  


## 2.4 样式作用域
UI 组件库作为业务的第三方引用，应尽量保持对业务的无侵入性（包括在 UI 层），常常见到 UI 组件库的 reset 样式直接作用于业务的 html,body，像 AntD 也出现了这个问题（issue:Remove global Styles #9363），以设计规范统一的立场，全局性影响是合理的，但应该把选择权交给业务开发者本身，而不是先覆盖再由业务开发者解决，比较理想的做法应该是给定一个 UI 组件库全局作用的类名前缀(@Prefix)变量，以保证 UI 组件库的样式只影响组件本身。

对于组件样式的作用域管理，可以采用 BEM 命名规范，避免组件间样式相互污染和与业务样式相互影响，CSS-in-JS 和 CSS Modules 也是可行的解决方案。

## 2.5 好看好用的组件
在 UI 实现的最后一部分，探讨一下最重要的怎样的组件才是一个“好看、好用”的组件，每个用户都有不同的主观感受和使用习惯，有一种理论认为，开发者应该基于原生 HTML 标签封装，因为使用简单和复用性最高，我曾经也是这种理想的坚实支持者，但就像最前面说的：

“是产品体验的一致性决定了 UI 组件的复用性，有了复用性，才有了开发效率上的体现”

当我们抛开体验和风格，谈控件的交互和复用是没有意义的，对于业务开发者，如果需要在第三方 UI 组件的基础上，大量改造 UI 以适应自身业务风格和体验的要求，那本身就不适合引入这类第三方 UI 组件。

Ant Design、Element UI、Material UI 等组件库的现象级成功，很大部分程度上源于他们背靠完整的设计体系，只要用这些组件库，就是选择了他们的UI、风格和组件体验，这里的产品体验一致完全由这些 UI 组件库来保证。

以 Ant Design 的 分页 Pagination 组件为例，当需要快速跳转分页时，不仅能保证鼠标稳定的位置，同时又兼顾了需要更快速跨页的的跳转。



还有像 数字输入框 InputNumber 组件，当需要鼠标点击增减数字时，注意可点击区域的放大和鼠标指针的变化。



这些细节的体验，来源于 Ant Design 设计理念中的：

追求细节上的精益求精，用户在使用中不断发现令人惊喜的细节

并不是单纯利用好原生 HTML 控件就能达到这样的体验水平，W3C、HTML 规范形成和浏览器实现的机制，决定了原生控件的体验无法迎合用户日益提升的体验要求。设计者和开发者不断发明创新反推规范制定者和浏览器厂商跟进实现。

当我们需要再造一个 UI 组件库轮子时，工程思维的开发者很容易下意识的直奔 “实现一套能用的控件”，能用与好用的差别就好比60分跟90分，一直认为，好的体验并没有一套完全可复用的工程方法可以直接套用，也不是某个岗位某个人就能主宰实现，和任何领域一样，做好体验需要依靠团队的沉淀和打磨，Ant Design 在这方面做了很好的榜样。 Ant Design 1.0 背后的故事：把艺术变成技术

还有另外一类型组件库，以开发者复用的角度，只提供基础的样式和高度灵活的扩展，如 react-component 和 NU-system，其核心不再是组件的 UI，而是组件通用逻辑的抽取和便于二次封装的扩展能力。

# 3 API 设计
API 的用户是组件的使用者，API 设计需要考虑充足的扩展性和整体的一致性，扩展性由合理的 Props 和开放内部结构来实现，一致性由统一的命名规则和符合习惯的属性来保证，下面内容会围绕这两点展开。

## 3.1 API 的组织
组件的 API 并不是越多越好，如果有人不理解你的 API，那他使用组件的学习成本就会增加，组件开发过程中我们要有清晰的脉络结构，一般可将 UI 组件的 API 分为以下几种类型：

类型 Type
属性 Attribute
样式 Style
数据 Setter/Getter
事件 Events
扩展 Children/Slots
对每个组件 Props 定义，建议都使用 ComponentProps 形式单独命名文件，在组件内部实现中继承，这样做的好处是便于持续维护和组件文档生成等工作，例如 tdesign-web-react 的 列表 List 组件的实现：
```ts
// src/list/ListProps.ts
import React, { HTMLAttributes } from 'react';
/**
 * List 组件支持的属性
 */
export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 列表头部
   */
  header?: React.ReactNode;
  /**
   * 列表底部
   */
  footer?: React.ReactNode;
  /**
   * 列表是否正在加载
   */
  loading?: 'loading' | 'load-more';
  /**
   * 列表尺寸
   * @default 'middle'
   */
  size?: 'middle' | 'small' | 'large';
  /**
   * 是否展示分割线
   * @default true
   */
  split?: boolean;
  /**
   * 是否展示斑马纹
   * @default false
   */
  stripe?: boolean;
  /**
   * 设置 action 布局
   * @default horizontal
   */
  actionLayout?: 'horizontal' | 'vertical';
  /**
   * 加载更多函数
   */
  loadMore?: () => void;
  /**
   * 列表滚动时触发的函数
   */
  onScroll?: (
    event: React.UIEvent<HTMLElement>,
    context: { scrollTop: number; scrollBottom: number },
  ) => void;
}
// src/list/List.tsx
import { ListProps } from './ListProps';
const List = forwardRef((props: ListProps, ref: React.Ref<HTMLDivElement>) => {
	...... //组件内部实现
});
List.displayName = 'List';
export default List;
```
## 3.2 Props 的校验
Props 的校验是很多组件开发者常常会遗漏的问题，UI 组件是一个不断迭代演变的过程，每个组件的使用者都有可能为组件的 API 提出不同的意见，随着时间推移，由于人的忘性和不同接手人的出现，不受控的 API 实现，会摧毁使用者的信心


# 3.3 组件和 Props 的界定
什么时候出现新组件，什么时候以 props:{ type:newType } 实现，也是很多组件开发者会忽略的问题，一个有趣的例子，例如图标按钮 button 的实现，AntD、Element UI、tdesign-web-vue 中都是以 Props 的方式给开发者使用，Material-UI 以新组件 IconButton 形式使用：
```js
//AntD 用 shape + icon 代表图标按钮，shape 有 square,round,circle 值
<Button icon={<SearchOutlined />} shape="circle" />

//Element UI 用 circle 的 Boolean 值 + icon代表图标按钮
<el-button icon="el-icon-search" circle></el-button>

//tdesign-web-vue 用 icon 值 + 自动判断是否图标按钮
<t-button icon="search"></t-button>

//Material-ui 定义一个新的 IconButton 组件 + {children} 实现
<IconButton><SearchIcon /></IconButton>
```
直观的感受 Material-UI 的实现更符合组件使用者的理解，在 Material-UI 中Button 和 IconButton 共同继承 ButtonBase API，然后有自己对应的 API 实现，虽然差异并不大，但 Material-UI 的开发者也许认为未来这两个组件会越走越远。

上面只是一个简单的例子，像 Input / InputNumber / TextArea / DataPicker 等等更是需要组件开发者考虑如何实现。不管以何种方式实现，我认为最重要的应该是 UI 组件库的 API 设计，应该要有统一的指导思想或者优先原则，不能一会在属性互斥的组件以 Props 方式定义，一会又把两个功能相似，界面不同的组件定义为新组件。

对于一个旨在简化开发者使用的 UI 组件库，需要尽可能减少学习成本，例如：  

遵循 HTML 规范的定义组件或原生组件的 Props  
为组件使用者封装 Props，减少所需的自定义 Props 数量  
对于一个旨在适配更多场景的 UI 组件库，在 Props 上尽可能留足扩展空间，例如：  

使用枚举(enum)，而不是布尔值(boolean)    
为组件使用者提供不同 Props 组合  
对于一个旨在简单和灵活中取得平衡的中庸 UI 组件库来说：  

尽可能使用默认值，同时允许使用者覆盖  
为组件使用者做更多逻辑判断  
## 3.4 开放扩展
在 UI 组件库的场景，为组件使用者提供足够的扩展非常重要，无论你怎样设计组件的样式、Props，总会有不同的需求出现，UI 组件提供扩展主要有两个途径：

增加组件可扩展点，方便组件使用者注入自定义的内容  
提供组件内部挂载子组件( children / slot )的功能，将组件内部 DOM 决定权交给使用者  
以 选项卡 Tab 组件为例，Element UI 定义的选项卡(Tab-pane)标题只能传入文本内容，当业务需求需要在标题前加上 icon 或者其他修饰元素时，当前的 Props 可能就需要新增一个 labelIcon 的属性，非常不灵活。    

从通用性角度考虑，对于有可能出现自定义内容，可以开放组件的扩展点，方便注入自定义的内容，例如 react-component 中将 TabPane 标题 定义为 ReactNode，AntD 相应的继承了 rc-tabs 的定义：  
```ts
//TabPane.tsx
export interface TabPaneProps {
  tab?: React.ReactNode;
  ......
}
允许自定义内容后，组件使用者可以在 tab={ } 属性中插入图标、文本和其他需要的内容。

ReactDOM.render(
  <Tabs>
    <TabPane
      tab={
        <span>
          <TDesinIcon />
          TDesign
        </span>
      }
    >
      关于
    </TabPane>
    ......
  </Tabs>,
);
第二种方式，同样也是上面的例子，在组件内部提供插槽，能方便组件使用者应对不同场景，例如 Element UI 在模板中为选项卡(Tab-pane) 提供了 slot 插槽：

//tab-pane.vue
<template>
  <div
    class="el-tab-pane"
    ......
  >
    <slot></slot>
  </div>
</template>
开放了 Tab-pane 内部的 DOM 结构后，组件使用者可以自定义内部各种内容和交互，组件的扩展性也相应提高。

<el-tabs type="border-card">
  <el-tab-pane>
    **<span slot="label"><i class="icon-TDesign"></i>TDesign</span>**
    关于
  </el-tab-pane>
  ......
</el-tabs>
```
还有另外一些场景，组件使用者可能需要部分覆盖组件的实现，像 选择器 Select 的 option ，导航菜单 Menu 的 MenuItem，下拉菜单 Dropdown 的 options 等等，组件开发者可以为使用者开放自定义渲染 Render 的接口，以替代组件自身默认的实现。

组件的扩展不应该是完全自由的，过度的开放同时也是增加使用者的学习成本，如何取舍应该基于 UI 组件库整体的设计原则和 API 设计思想。


# 3.5 数据处理
前面提到，UI 组件为业务暴露的数据接口，很大程度上影响了业务自身的数据格式，在一般的业务开发中，我们都是将数据源通过 UI 组件提供的数据 Props 渲染到业务中，这样导致的结果就是 UI 组件定义的数据格式，要不决定了后端返回的格式，要不前端再额外处理数据，这种耦合就要求组件开发者，不能任性地设计组件的数据格式。

对数据的注入，UI 组件一般提供两种方式，一种以 Props 属性方式注入，一种以 Children 模板方式注入，例如 Fusion Next 的选择器 Select 组件：
```js
//Props 方式
const dataSource = [
    {label:'option1', value:'option1'},
    {label:'option2', value:'option2'},
    {label:'disabled', disabled:true}
];

<Select dataSource={dataSource}/>

//Children 方式
<Select>
    <Select.Option value="option1">option1</Select.Option>
    <Select.Option value="option2">option2</Select.Option>
    <Select.Option disabled>disabled</Select.Option>
</Select>;
```
两种方式对组件使用者来说各有优劣，Props 方式组件使用者不需要关心组件内部的实现，实现比较快速，但同时缺乏对组件逻辑的控制，在一些定制和特殊逻辑的实现上就比较吃力；另一种 Children 方式，组件内部结构对组件使用者开放，利于单独写入业务逻辑，但组件使用者需要再实现数据注入的逻辑。面向通用场景的 UI 组件库，最好两种数据注入方式都提供，这样组件使用者可以按场景自行选择， Fusion Next Web 的实现主要判断有无传入 Children，有则优先渲染：
```js
//next/src/select/base.jsx

/**
* render menu item
* @protected
* @param {Array} dataSource
*/
renderMenuItem(dataSource) {
const { prefix, itemRender, showDataSourceChildren } = this.props;
......
return dataSource.map((item, index) => {
    if (!item) {
        return null;
    }
    if (Array.isArray(item.children) && showDataSourceChildren) {
        return (
            <MenuGroup key={index} label={item.label}>
                {this.renderMenuItem(item.children)}
            </MenuGroup>
        );
    } else {
        const itemProps = {
            role: 'option',
            key: item.value,
        };
        return <MenuItem {...itemProps}>{itemRender(item, searchKey)}</MenuItem>;
    }
});
}
```
# 3.6 API 设计原则
在 API 设计的最后一节，我们来探讨一下最重要的 UI 组件库整体的指导思想（原则），前面也有提及一些，我认为并没有一种绝对正确的模型可以套用所有 UI 组件库，组件开发者需要在易用和扩展之间，为使用者寻找最理想的平衡点。   

有一种理论认为，开发者应该设计自由的组件，我个人并不太认同这样的观点，即使数据与组件耦合，或者业务开发者需要重写（二次开发）部分组件，但 UI 组件给业务开发者带来的复用和便捷的收益是实实在在的，过度的抽象和自由，反倒缩小 UI 组件的使用场景，如果仅保留组件的“交互”逻辑，那与使用原生控件重新封装的成本就相差不多。  

回到 API 设计原则，UI 组件库的 API 与其他工具库提供的 API 并无大异，我们不妨套用 JavaScript API 设计原则的几个要点：  

**保持一致**

组件 API 应该遵循明确和统一的规则，这样可以给组件使用者传递一种熟悉和安全的体验，大大降低组件库的使用成本。在 API 命名上，尽量保持与原生组件的相同的方式，
一个组件如果越像 HTML 元素，他就会变得越可靠。例如，对一个 时间选择框 TimePicker 组件，使用和原生组件一样的 value 和 onChange ，保留与 step 属性一样的定义，这样可以使组件使用者更容易明白组件的运作，也更容易记忆。  

// 原生
<input type="time" value="13:30" step="60" onChange="handleTimeChange()">   

// Good
<TimePicker value={value} step="{{minute:1}}" onChange={handleTimeChange}/>;  

// Bad
<TimePicker time={value} minuteStep={1} onSelect={handleTimeChange} />;  
另外，尽量保持与市面流行的 UI 组件库相同的 API 命名，毕竟 UI 组件库本质上功能并无大差异，大部分开发者都已经熟悉其中一种，或多种 UI 组件库的使用方法，像 TDesign 组件库的实践，在 API 设计评审阶段，就严格参照和学习其他组件库的 API 定义和命名：  

一致性最重要的要求，是所有组件 API 的一致和一致性的延续，在前面我们提到 Props 的组织和校验的方法，就是有力的保障措施。

**避免复杂**
不要为了扩展性，任意创造一系列 Props 属性，大部分组件使用者用不到也理解不了这么多繁杂的 Props 配置项，就像 Material-UI 在自己的 API 设计方法中，引用的这句话：

API 设计的难点在于你可以让一些复杂的东西看起来简单，也可能把简单的东西搞得复杂 @sebmarkbage/React · TC39

大胆地创造一个与原生定义不同的组件，只要它能方便组件使用者调用，以 Dashboard 中常用 环形进度条 CircularProgress 为例，原生 progress 元素并没有环形进度条和进度状态相关的属性，我们可以把环形相关的属性 type,strokeLinecap 封装为 CircularProgress 组件，把 strokeColor="red" 、label={<ErrorOutlined />}，封装为 status="exception" ，percent 和{children} 统一为 value ，这样，大大减少了组件所需的定义 Props 的数量，并且减少了组件内部实现的逻辑，也更利于组件代码的分割。类似的还有 TimePicker、DatePicker、ColorPicker、InputNumber 等input 组件的不同 type。    

扩展性良好的衡量标准是，通过增加代码来实现新功能或者改变已有的功能，而不是修改原有的代码，作为高内聚的 UI 组件，不应该让组件使用者直接修改组件代码，而是通过 API 的扩展复写或新增：  

在样式上：允许使用者自定义所有样式，例如 Material-UI 提供了多种方法覆盖方法，每个组件都有一个 className 属性，开发者可以直接对组件注入样式。当需要覆盖更深层的元素样式时，可使用 classes 对象属性找到组件的其他元素。如果只是一次性覆盖，不关心样式优先级，可以直接使用 style 属性注入内联样式。  
在结构上：开放内部结构让组件使用者可以自定义内部的结构，同样以 Material-UI 为例，开发者在所有组件内实现了 component 属性，允许自定义组件标签，例如 List 默认渲染的根元素从 <ul> 更改为 <nav> ，ListItem 更改为 <div> 。
<List>
   <ListItem>Trash</ListItem>
   <ListItem>Spam</ListItem>
</List>
      ↓ ↓ ↓ ↓ ↓ ↓
<ul class="MuiList-root MuiList-padding">
	<li class="MuiListItem-root MuiListItem-gutters">Trash</li>
	<li class="MuiListItem-root MuiListItem-gutters">Spam</li>
</ul>

<List component="nav">
   <ListItem component="div">Trash</ListItem>
   <ListItem component="div">Spam</ListItem>
</List>
      ↓ ↓ ↓ ↓ ↓ ↓
<nav class="MuiList-root MuiList-padding">
	<div class="MuiListItem-root MuiListItem-gutters">Trash</div>
	<div class="MuiListItem-root MuiListItem-gutters">Spam</div>
</nav>
更进一步，同样也是利用 component 属性，组件使用者可以自行封装 props ，例如Material-UI 提供的例子中把 ListItem 封装成 ListItemLink ：

import { Link } from 'react-router-dom';

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem button component={CustomLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

# 4 组件文档
组件文档就是组件使用者的使用手册 ，组件文档是否准确、清晰也是决定 UI 组件库成败的关键因素，除了对外说明，组件文档还应该兼顾本地开发预览的功能。

优秀的 UI 组件库文档首先要满足以下条件：

使用说明：何时使用，什么场景使用何种类型等等
保持同步：文档与代码版本同步
API 齐全：Props（名称、说明、类型、默认值）、Slots、Events
示例/Demo：示例比 API 描述更直观
源码/Playground：直接调试
流行的 UI 组件库必然非常重视组件文档的建设，我们以 按钮 Button 组件为例，选取几个标杆一起看看，在 使用说明 的描述上，Material-UI 完全以“场景”而非“功能”的描述，为组件使用者指明组件的使用场景，例如：

Contained Buttons 实心按钮
实心按钮 表示高度的强调，你根据它们的立体效果和填充颜色来区分彼此。 它们用于触发应用程序所具有的主要功能。

Outlined Buttons 描边按钮
描边按钮表示中等的强调。 它们包含了一些重要的操作，但不是一个 app 中的主要操作。
你也可以将描边按钮作为比实心按钮次要一点的替代方案，或者用来作为比文本按钮重要一点的展示。

Icon Buttons（图标按钮）
图标按钮通常位于应用栏和工具栏中。
图标也适用于允许选择单个选项的切换按钮或取消选择，例如向项目添加或删除星标。

在 示例/Demo 上，Vuetify 提供了一个可视化的配置功能，通过 UI 的操作比平铺所有的示例更加合理清晰。



另外，特别提一下 IBM 的 Carbon 组件库，把组件样式的类名和相关的变量单独展示，方便组件使用者覆盖业务样式。另外针对无障碍，有单独的使用方法和测试情况说明，非常专业。


## 4.1 国际化(i18n)
一般认为国际化就是对文本词条的翻译，UI 组件的词条并不多，因此 UI 组件库的国际化并没有得到太多的重视。在讨论具体的方案之前，我们首先要明确，就是 UI 组件库哪些内容是需要做国际化的，除了语言包外，还应该包括：

RTL 支持：阿拉伯语、希伯来语，习惯从右到左（所有含文本的组件）
日期格式：例如美式英语 08/20/2020，英式英语 20/08/2020 （日期选择器 DatePicker）
数字格式：例如德语数字 123.456,789，印度数字 1,23,456.789 （输入框 Input、计数器 InputNumber ）
文档国际化：官网
语言包
国际化首先要用到的是语言包，由于 UI 组件的词条不多，建议所有组件的的词条按不同组件放在一个语言包文件内：

// components/locale/zh_CN.ts

const localeValues: Locale = {
  locale: 'zh-cn', 
  ......
  Popconfirm: {
    cancelText: '取消',
    okText: '确定',
  },
  ......
};

export default localeValues;
然后在模板实现的部分，以 AntD 的 气泡确认框 Popconfirm 组件为例，我们可以看到这个语言包的使用：

// components/popconfirm/index.tsx 
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}
const renderOverlay = (popconfirmLocale: PopconfirmLocale) => {
    return (
      ......
          <Button>
            {cancelText || popconfirmLocale.cancelText}
          </Button>
          <Button>
            {okText || popconfirmLocale.okText}
          </Button>
      ......
    );
  };

const overlay = (
    <LocaleReceiver componentName="Popconfirm" defaultLocale={defaultLocale.Popconfirm}>
      {(popconfirmLocale: PopconfirmLocale) => renderOverlay(popconfirmLocale)}
    </LocaleReceiver>
  );
LocaleReceiver 就是语言包的替代函数（消费者组件），接受来自 Provider（组件库内或组件使用者提供） 的语言包。在 Vue 技术栈下，可以使用 mixin 混入定义语言包的替代函数，可以参考 Element UI 的实现。

不管是 React 还是 Vue 技术栈，本身国际化已经有比较成熟的方案，例如 react-intl 和 Vue i18n，在实现过程中需要注意与他们的兼容。

RTL 从右到左
在中东地区，像阿拉伯语、希伯来语，他们的阅读习惯是从右到左的，与我们平常习惯是相反的，因此国际化有必要考虑实现 RTL。

RTL 的支持比语言包替代复杂，因为它涉及到 CSS 样式的调整，UI 组件的样式本身应该独立作用自身，因此做 RTL 方向支持，应该考虑只写一套方向变量，然后通过组件顶层元素的 dir 属性，作用于每一个组件，参考：

/*** RTL ***/
$direction            :rtl;
$opposite-direction   :ltr;

$start-direction     :right;
$end-direction       :left;

$transform-direction :-1;
$rotate-direction :1;

body {
  direction: $direction;
  text-align: $start-direction;
}

margin-#{$end-direction}: 0;
padding-#{$start-direction}: 320px;
border-#{$start-direction}: 1px;

transform: translateX($transform-direction * -100%);
transform: scaleX($transform-direction);       // 使元素沿着中轴进行水平翻转
transform: rotate(180deg * $rotate-direction); // 水平翻转(上下对称的图标)
但实际上，每个组件的样式去单独引用 RTL 的变量是非常繁琐的，所以一般的做法还是会引用 RTL 样式去覆盖组件的本身的 LTR 写法，例如 AntD 和 Fusion Next。

# 4.2 无障碍(a11y)
原生组件对无障碍的支持本身是非常好的（因为标准和通用），但是到了开发者实现的 UI 组件库，无障碍就变得不一样了，总体来说，国外实现的组件库在无障碍上比国内的完善和成熟。本质上无障碍应该是一个系统性工程，但因为收益（用户比例）和成本（大量标记工作）ROI 不成正比，无法引起开发者重视，但如果是一款面向国际化的产品，因为违规成本大于开发成本，因而不得不重视。

对于 Web 无障碍，社区有很多实现方法，最值得参考 MDN 的系列文章。回到 UI 组件库的场景，无障碍一般需要实现以下几点：

读屏支持：

添加 role 属性，描述当前控件，使读屏工具可识别，例如：
装饰性的 图标 Icon 使用 <Icon role="presentation">
进度条 Progress 使用 <Progress role="progressbar">
全局提示 Message、警告提示 Alert 、通知提醒框 Notification 使用 <Message role="alert"></Message>
文字提示 Tooltip 使用 <Tooltip role="tooltip"></Tooltip>
对话框 Modal、抽屉 Drawer、气泡确认框 Popconfirm使用 <Modal role="dialog"></Modal>
导航菜单 Menu 使用 <Menu role="menu"> <Menu.Item role="menuitem"></Menu.Item></Menu>
标签页 Tabs 使用 <Tabs role="tablist"><TabPane role="tab"></TabPane></Tabs>
开关 Switch 使用 <Switch role="switch"/>
滑动输入条 Slider 使用 <Slider role=“slider” />
使用 aria-label 和aria-labelledby 说明意图，例如：
指向性的 图标 Icon 使用 <Icon aria-label="描述这个Icon作用">
可关闭的 标签 Tag 使用 <Tag closable aria-label="删除标签"> Prevent Default </Tag>
输入框 Input 使用 aria-labelledby 关联说明或使用aria-label 声明用途
复杂交互的组件如日期选择框 DatePicker、时间选择框 TimePicker、Transfer穿梭框、树选择 TreeSelect、级联选择 Cascader 等，通过 aria-label 指明手动输入的方法
使用 aria-current 标记当前步骤，例如：
步骤条 Steps 使用<Steps aria-current="1"><Step /></Steps>
面包屑 Breadcrumb 使用<Breadcrumb aria-current="1"><Breadcrumb.Item></Breadcrumb.Item></Breadcrumb>
触发更新，提醒时用 aria-live，例如：
选择器 Select 的选中项更新后，更新aria-live
输入框 Input 校验后，更新aria-live
所有组件的 disabled 禁用状态和 aria-disabled 同步
图片、图标、样式内容需要有替代文本，例如
为 徽标数 Badge 角标数量设置文本；
图片 Image 保留 alt；
键盘：

所有组件样式上支持的 foucs 样式，激活提示时使用 autoFocus 开启默认聚焦
对话框 Modal、抽屉 Drawer、气泡确认框 Popconfirm 激活时
选择器 Select、下拉菜单 Dropdown 点击时，激活子菜单
需要支持键盘导航 keycode
导航菜单 Menu
标签页 Tabs
分页 Pagination
步骤条 Steps
评分 Rating
选择器 Select
下拉菜单 Dropdown
颜色：


最后，UI 组件的工程化与一般前端项目相比，是一项广度更广，通用化程度更高的工作，因此也是非常值得前端工程师在这个领域深入实践和学习，它为组件开发者带来的专业收获，不亚于任何一类业务开发工作
