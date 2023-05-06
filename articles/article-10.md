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

---
待更新　　
