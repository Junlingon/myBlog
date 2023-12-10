---
title: git
description: 原来git还能这样用
date: 2023-12-10
random: git 
tags:
    - git
---

之前使用git就是clone一下，add、commit、push一下，或者pull，checkout和merge，觉得会这些就够够的了  

近段时间，间接或直接的使用到了git stash 和git pull --reabse，这些可能就是只是在面试题中看见过的，如今真的用上了，形成了闭环。  

# git stash
## 一、介绍
        git stash这个命令可以将当前的工作状态保存到git栈，在需要的时候再恢复。

## 二、使用场景
        当在一个分支的开发工作未完成，却又要切换到另外一个分支进行开发的时候，可以先将自己写好的代码，储存到 git 栈，进行另外一个分支的代码开发。这时候 git stash 命令就派上用场了！

## 三、常见方法：
1. git stash  
        保存当前的工作区与暂存区的状态，把当前的修改的保存到git 栈，等以后需要的时候再恢复，git stash 这个命令可以多次使用，每次使用都会新加一个stash@{num}，num是编号

2. git stash save '注释'  
        作⽤等同于git stash，区别是可以加⼀些注释， 执⾏存储时，添加注释，⽅便查找

3. git stash pop  
        默认恢复git栈中最新的一个stash@{num}，建议在git栈中只有一条的时候使用，以免混乱

        注：该命令将堆栈中最新保存的内容删除

4. git stash list  

        查看当前stash的所有内容

5. git stash apply  
        将堆栈中的内容恢复到当前分支下。这个命令不同于 git stash pop。该命令不会将内容从对堆栈中删除，也就是该命令能够将堆栈的内容多次运用到工作目录，适合用与多个分支的场景

        使用方法：git stash apply stash@{$num}

6. git stash drop   
        从堆栈中移除指定的stash

        使用方法：git stash drop stash@{$num}

7. git stash clear  
        移除全部的stash

8. git stash show  
     查看堆栈中最新保存的stash和当前⽬录的差异，显⽰做了哪些改动，默认show第一个存储


#  git pull --rebase
git pull 和 git pull --rebase 命令都是从远端拉取代码，更新我们的仓库。  
前提知识
四个区：

+ 工作区 ：代码在本地存储的目录位置
+ 暂存区 ：git可以追踪的代码（工作区可以将代码添加到暂存区(add)）——临时存储
+ 本地库 ：暂存区的代码可以提交到本地库(commit)，并生成对应的版本 ——生成历史版本
+ 远程库：（远程库：如github）本地区的代码可以提交到远程库(push)，并生成对应的版本 ——存储在远端
## 区别git pull 与 git pull --rebase
简单理解
git pull 是 git pull --merge的简写。  
git pull 与git pull --rebase 的关系如下：
```js
git pull = git fetch + git merge
git pull --rebase =  git fetch + git rebase
```
git fetch是将远程库的最新内容拉到本地库，用户在检查了以后决定是否合并到工作区中。  
git merge是将本地的两个分支合并，如果在分支A中执行git merge B，那就是将分支B中的代码合并到分支A中。   
git pull 则是将远程主机的最新内容拉去到本地库后直接合并到工作区中，即：git pull = git fetch + git merge，这样可能会产生冲突，需要手动解决。


git rebase是将提交到某一分支上的所有修改都移至另一分支上。即如果在B分支上使用git rebase A就是将B分支上的修改都变基（移到）A分支上详见：https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA  
git pull --rebase则是将远程主机的最新内容拉去到本地库后直接变基到工作区中，即：git pull --rebase = git fetch + git rebase，可能会产生冲突手动解决。


## git merge与git rebase
通过上面的比较，git pull 与 git pull --rebase的区分实际上就是git merge与git rebase的区分。为了方便区分我们使用两个不同名分支进行讲解。

git merge是合并分支。是将yang分支合并到master分支之后，master分支的代码有所改动，会自动commit，生成一个新的结点，并且不会影响之前两分支的提交节点。
合并前：
[![opVULK.png](https://vip.helloimg.com/images/2023/12/10/opVULK.png)](https://www.helloimg.com/image/opVULK)
合并后：
[![opVgQb.png](https://vip.helloimg.com/images/2023/12/10/opVgQb.png)](https://www.helloimg.com/image/opVgQb)
执行的合并命令：
```js
$ git checkout master
$ git merge yang
```
git rebase是变基。是将yang分支变基到master分支，就是将yang分支的代码改动完全合并到master分支，不会生成新的结点。
变基前：
[![opVkyo.png](https://vip.helloimg.com/images/2023/12/10/opVkyo.png)](https://www.helloimg.com/image/opVkyo)
变基后：
[![opVVJD.png](https://vip.helloimg.com/images/2023/12/10/opVVJD.png)](https://www.helloimg.com/image/opVVJD)
执行的变基命令：
```js
$ git checkout yang
$ git rebase master
```
然后再执行如下命令，是master分支指向最新节点
```js
$ git checkout master
$ git merge yang
```
[![opVYcS.png](https://vip.helloimg.com/images/2023/12/10/opVYcS.png)](https://www.helloimg.com/image/opVYcS)
由此可以看出merge和rebase的区别：  
+ merge 会多出一次 commit生成一个新节点，rebase不会。
+ merge 的提交树是非线性的，rebase 的提交树是线性的（通过重写提交历史）。
