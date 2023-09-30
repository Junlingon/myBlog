---
title: JavaScript 模块的循环加载
description: 笔试痛点之循环加载
date: 2023-09-30
random: circulate 
tags:
    - 八股文
---

## 问题
**import 和require 有什么区别？有2个js文件，a.js 和b.js，a调用b，b调用a，会出现死循环吗，为什么？**
import 和 require 都是用来引入模块的方式，但是它们有以下区别：
1. 加载方式不同：  
  - require 是在运行时加载模块，即在运行时才会执行引入的模块。  
  - import 是在编译时加载模块，即在代码编译阶段就引入模块，不会在运行时再次加载。
2. 遵循的规范不同：  
  - require 是 CommonJS 规范，它是一种服务器端模块规范，主要用于 Node.js 环境中。  
  - import 是 ES6 规范，属于静态引入，即在编译时就会执行，它是一种语言规格层面支持模块功能的语法。
3. 循环引用问题：  
  - require 存在循环引用的问题，因为 CommonJS 是基于文件的模块规范，无法实现模块的动态加载和静态分析，容易出现循环引用问题。  
  - import 不存在循环引用问题，因为 ES6 的模块规范是通过语言规格实现的，可以实现模块的动态加载和静态分析，避免了循环引用问题。
4. 导入的模块类型不同：  
  - require 可以引入 CommonJS 模块、AMD 模块和 ES6 模块。  
  - import 只能引入 ES6 模块。
5. 代码组织方式不同：  
  - require 使用的是 `require(module)` 的方式引入模块，模块的代码会被复制到当前作用域中,基本数据类型是直接拷贝，不会相互影响，引用数据类型是浅拷贝，修改后会影响原来的值。  
  - import 使用的是 `import { default } from 'module'` 的方式引入模块，模块的代码会被解析为 ES6 模块的默认导出，直接在当前作用域中使用。

结论：不会造成死循环，不论是用require引入还是import引入，都不会死循环
+ require： CommonJS中有自己避免循环引用的策略，一旦某个模块被”循环引用“，也就是这个模块没有加载完，就进入了循环，所以原则是，只exports已经执行的那部分，没执行的不输出。
+ import：跟 CommonJS 模块一样，ES6 模块也不会再去执行重复加载的模块，并且解决循环加载的策略也一样：一旦某个模块被循环加载，就只输出已经执行的部分，没有执行的部分不输出。**但ES6 模块的循环加载与 CommonJS 存在本质上的不同**。由于 ES6 模块是动态引用，用 import从一个模块加载变量，那个变量不会被缓存（是一个引用），所以只需要保证真正取值时能够取到值，即已经声明初始化，代码就能正常执行。


## 正文
### 1.什么是循环加载
“循环加载”简单来说就是就是脚本之间的相互依赖，比如a.js依赖b.js，而b.js又依赖a.js。例如：
```javascript
// a.js
const b = require('./b.js')

// b.js
const a = require('./a.js')
```
对于循环依赖，如果没有处理机制，则会造成递归循环，而递归循环是应该被避免的。并且在实际的项目开发中，我们很难避免循环依赖的存在，比如很有可能出现a文件依赖b文件，b文件依赖c文件，c文件依赖a文件这种情形。

也因此，对于循环依赖问题，其解决方案不是不要写循环依赖（无法避免），而是从模块化规范上提供相应的处理机制去识别循环依赖并做处理。

### 2.CommonJS 模块的循环加载
CommonJS 模块规范使用 require 语句导入模块，module.exports 语句导出模块。  
CommonJS 模块是运行时加载：  

运行时遇到模块加载命令 require，就会去执行这个模块，输出一个对象（即module.exports属性），然后再从这个对象的属性上取值，输出的属性是一个值的拷贝，即一旦输出一个值，模块内部这个值发生了变化不会影响到已经输出的这个值。  


CommonJS 的一个模块，就是一个脚本文件。require 命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。对于同一个模块无论加载多少次，都只会在第一次加载时运行一次，之后再重复加载，就会直接返回第一次运行的结果（除非手动清除系统缓存）。
```js  
// module
{
  id: '...', //模块名，唯一
  exports: { ... }, //模块输出的各个接口
  loaded: true, //模块的脚本是否执行完毕
  ...
}
```
上述代码是一个 Node 的模块对象，而用到这个模块时，就会从对象的 exports属性中取值。

CommonJS 模块解决循环加载的策略就是：**一旦某个模块被循环加载，就只输出已经执行的部分，没有执行的部分不输出。**

用一个 Node 官方文档上的示例来讲解其原理：
```js
// a.js
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
// b.js
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
// main.js
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```

main脚本 执行的顺序如下：
1. 输出字符串 main starting 后，加载a脚本
2. 进入 a 脚本，a脚本中输出的done变量被设置为false，随后输出字符串 a starting，然后加载 b脚本
3. 进入 b 脚本，随后输出字符串 b starting，接着b脚本中输出的done变量被设置为false，然后加载 a脚本，发现了循环加载，此时不会再去执行a脚本，只输出已经执行的部分（即输出a脚本中的变量done，此时其值为false），随后输出字符串in b, a.done = false，接着b脚本中输出的done变量被设置为true，最后输出字符串 b done，b脚本执行完毕，回到之前的a脚本
4. a脚本继续从第4行开始执行，随后输出字符串in a, b.done = true，接着a脚本中输出的done变量被设置为true，最后输出字符串 a done，a脚本执行完毕，回到之前的main脚本
5. main脚本继续从第3行开始执行，加载b脚本，发现b脚本已经被加载了，将不再执行，直接返回之前的结果，最终输出字符串in main, a.done = true, b.done = true，至此main脚本执行完毕

### 3.ES6 模块的循环加载
ES6 模块规范使用 import 语句导入模块中的变量，export 语句导出模块中的变量。
ES6 模块是编译时加载：
  
编译时遇到模块加载命令 import，不会去执行这个模块，只会输出一个只读引用，等到真的需要用到这个值时（即运行时），再通过这个引用到模块中取值。换句话说，模块内部这个值改变了，仍旧可以根据输出的引用获取到最新变化的值。
   
   
跟 CommonJS 模块一样，ES6 模块也不会再去执行重复加载的模块，并且解决循环加载的策略也一样：一旦某个模块被循环加载，就只输出已经执行的部分，没有执行的部分不输出。
   
但ES6 模块的循环加载与 CommonJS 存在本质上的不同。由于 ES6 模块是动态引用，用 import从一个模块加载变量，那个变量不会被缓存（是一个引用），所以只需要保证真正取值时能够取到值，即已经声明初始化，代码就能正常执行。
   
以下代码示例，是用 Node 来加载 ES6 模块，所以使用.mjs后缀名。（从Node v13.2 版本开始，才默认打开了 ES6 模块支持）
   
实例一：
```js
// a.mjs
import { bar } from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import { foo } from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```
执行 a脚本，会发现直接报错，如下图：
[![onfLC0.png](https://www.helloimg.com/images/2023/09/30/onfLC0.png)](https://www.helloimg.com/image/onfLC0)
简单分析一下a脚本执行过程：
1. 开始执行a脚本，加载b脚本
2. 进入b脚本，加载a脚本，发现了循环加载，此时不会再去执行a脚本，只输出已经执行的部分，但此时a脚本中的foo变量还未被初始化，接着输出字符串a.mjs，之后尝试输出foo变量时，发现foo变量还未被初始化，所以直接抛出异常
  
因为foo变量是用let关键字声明的变量，let关键字在执行上下文的创建阶段，只会创建变量而不会被初始化（undefined），并且 ES6 规定了其初始化过程是在执行上下文的执行阶段（即直到它们的定义被执行时才初始化），使用未被初始化的变量将会报错。详细了解let关键字，可以参考这篇文章深入理解JS：var、let、const的异同。
  
实例二：用 var 代替 let 进行变量声明。
```js
// a.mjs
import { bar } from './b';
console.log('a.mjs');
console.log(bar);
export var foo = 'foo';

// b.mjs
import { foo } from './a';
console.log('b.mjs');
console.log(foo);
export var bar = 'bar';
```
执行 a脚本，将不会报错，其结果如下：
[![onf4D5.png](https://www.helloimg.com/images/2023/09/30/onf4D5.png)](https://www.helloimg.com/image/onf4D5)
这是因为使用 var 声明的变量都会在执行上下文的创建阶段时作为变量对象的属性被创建并初始化（undefined），所以加载b脚本时，a脚本中的foo变量虽然没有被赋值，但已经被初始化，所以不会报错，可以继续执行。

### 4.小结
ES6 模块与 CommonJS 模块都不会再去执行重复加载的模块，并且解决循环加载的策略也一样：一旦某个模块被循环加载，就只输出已经执行的部分，没有执行的部分不输出。但由于 CommonJS 模块是运行时加载而 ES6 模块是编译时加载，所以也存在一些不同。
