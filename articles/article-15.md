---
title: three.js 核心概念
description: 主要讲解 three.js Render，Camera，Scene，Light 等核心概念
date: 2023-08-16
random: Stereoscopic graphics
tags:
    - REACT
---


要在屏幕上展示3D图形，思路大体上都是这样的：

1. 构建一个三维空间

● Three中称之为场景(Scene)

2.  选择一个观察点，并确定观察方向/角度等

● Three中称之为相机(Camera)

3.  在场景中添加供观察的物体

● Three中的物体有很多种，包括Mesh,Line,Points等，它们都继承自Object3D类

4.  将观察到的场景渲染到屏幕上的指定区域

● Three中使用Renderer完成这一工作

一个 three.js 页面至少包括三个核心元素，场景（Scene），照相机（Camera）以及渲染器（Renderer）。



## 场景（Scene）

Scene 是所有物体的容器，也代表着我们创建的三维世界。场景树的结构类似 html 的渲染树，Scene 中的每个对象（除了 Scene 本身）都有一个父对象，并且可以拥有任意数量的子对象。在渲染场景时，渲染器遍历场景图，从 Scene 开始，并使用每个对象相对于父对象的位置、旋转和比例来确定它的位置。

[![oSEP2A.png](https://www.helloimg.com/images/2023/08/16/oSEP2A.png)](https://www.helloimg.com/image/oSEP2A)

创建一个场景

```js
const scene = new THREE.Scene();
```

在场景中，我们通过坐标系来确定物体的位置，three 采用了右手坐标系进行定位，垂直屏幕的是 z 轴。

[![oSEx5c.png](https://www.helloimg.com/images/2023/08/16/oSEx5c.png)](https://www.helloimg.com/image/oSEx5c)

## 照相机（Camera）

Camera 是三维世界的观察者，使用的相机或观察的角度不同都会看到不同的场景。在 three 中主要使用两种相机，PerspectiveCamera 透视投影相机和 OrthographicCamera 正交投影相机。

[![oSEEsq.png](https://www.helloimg.com/images/2023/08/16/oSEEsq.png)](https://www.helloimg.com/image/oSEEsq)

正交投影与透视投影的区别如上图所示，左图是正交投影，物体发出的光平行地投射到屏幕上，远近的方块都是一样大的；右图是透视投影，近大远小，符合我们平时看东西的感觉。

[维基百科：三维投影](https://zh.wikipedia.org/wiki/%E4%B8%89%E7%BB%B4%E6%8A%95%E5%BD%B1)

### 正交投影相机

[![oSEJdr.png](https://www.helloimg.com/images/2023/08/16/oSEJdr.png)](https://www.helloimg.com/image/oSEJdr)

注：图中的”视点”对应着Three中的Camera。

这里补充一个视景体的概念：视景体是一个几何体，只有视景体内的物体才会被我们看到，视景体之外的物体将被裁剪掉。这是为了去除不必要的运算。

创建正交投影相机需要 6 个参数，通过这些参数构建了一个视景体，与视椎体相似，只有在视景体内的物体才会被渲染到屏幕上。

正交投影相机的视景体是一个长方体，OrthographicCamera的构造函数是这样的：OrthographicCamera( left, right, top, bottom, near, far )

Camera本身可以看作是一个点，left则表示左平面在左右方向上与Camera的距离。另外几个参数同理。于是六个参数分别定义了视景体六个面的位置。在创建的时候要注意 right - left 与 top - botoom 的横纵比要与 canvas 一致。可以近似地认为，视景体里的物体平行投影到近平面上，然后近平面上的图像被渲染到屏幕上。

### 透视投影相机

[![oSE42K.png](https://www.helloimg.com/images/2023/08/16/oSE42K.png)](https://www.helloimg.com/image/oSE42K)

透视投影相机的视景体是个四棱台，它的构造函数是这样的：PerspectiveCamera( fov, aspect, near, far )

fov对应着图中的视角，是上下两面的夹角。aspect是近平面的宽高比。在加上近平面距离near，远平面距离far，就可以唯一确定这个视景体了。

透视投影相机很符合我们通常的看东西的感觉，因此大多数情况下我们都是用透视投影相机展示3D效果。

```js
const fov = 35; // 视野的宽度
const aspect = clientWidth / clientHeight; // 横纵比
const near = 0.1; // 近切面
const far = 100; // 远切面

const camera = new PerspectiveCamera(fov, aspect, near, far);
```

## Objects

有了相机，总要看点什么吧？在场景中添加一些物体吧。

Three中供显示的物体有很多，它们都继承自Object3D类，这里我们主要看一下Mesh和Points两种。

### Mesh

我们都知道，计算机的世界里，一条弧线是由有限个点构成的有限条线段连接得到的。线段很多时，看起来就是一条平滑的弧线了。

计算机中的三维模型也是类似的，普遍的做法是用三角形组成的网格来描述，我们把这种模型称之为Mesh模型。

[![oSEAKb.png](https://www.helloimg.com/images/2023/08/16/oSEAKb.png)](https://www.helloimg.com/image/oSEAKb)

这是那只著名的[斯坦福兔子](https://en.wikipedia.org/wiki/Stanford_bunny)。它在3D图形中的地位与数字图像处理领域中著名的[lena](https://zh.wikipedia.org/wiki/%E8%90%8A%E5%A8%9C%E5%9C%96)是类似的。

看这只兔子，随着三角形数量的增加，它的表面越来越平滑/准确。

三维模型的形状在计算机中通常都是这样描述的。在Three中，Mesh的构造函数是这样的：Mesh( geometry, material )

geometry是它的形状，material是它的材质。  
 
不止是Mesh，创建很多物体都要用到这两个属性。下面我们来看看这两个重要的属性。Geometry  

Geometry，形状，相当直观。Geometry通过存储模型用到的点集和点间关系(哪些点构成一个三角形)来达到描述物体形状的目的。  

Three提供了立方体(其实是长方体)、平面(其实是长方形)、球体、圆形、圆柱、圆台等许多基本形状；  
 
你也可以通过自己定义每个点的位置来构造形状；    

对于比较复杂的形状，我们还可以通过外部的模型文件导入。 

### Material
 
Material，材质，这就没有形状那么直观了。  

材质其实是物体表面除了形状以为所有可视属性的集合，例如色彩、纹理、光滑度、透明度、反射率、折射率、发光度。  

这里讲一下材质(Material)、贴图(Map)和纹理(Texture)的关系。  

材质上面已经提到了，它包括了贴图以及其它。    

 

纹理嘛，其实就是‘图’了。  

Three提供了多种材质可供选择，能够自由地选择漫反射/镜面反射等材质。

## Renderer

通过渲染器可以将我们创造的三维世界渲染到屏幕上，在渲染的过程中会有几个阶段。

[![oSESFo.md.png](https://www.helloimg.com/images/2023/08/16/oSESFo.md.png)](https://www.helloimg.com/image/oSESFo)首先 three 会将立方体分割成三角形信息存储，然后经过相机的处理，裁剪掉不在视景体内的物体，然后计算物体的各种变化后的位置，最后栅格化显示。在渲染时，可能会遇到两个物体重叠的可见性问题，这里涉及到两个算法：[画家算法](https://zh.wikipedia.org/wiki/%E7%94%BB%E5%AE%B6%E7%AE%97%E6%B3%95) 与 [Z-Buffer 算法](https://zh.wikipedia.org/wiki/%E6%B7%B1%E5%BA%A6%E7%BC%93%E5%86%B2)。

## Light

[![oSEiiD.md.png](https://www.helloimg.com/images/2023/08/16/oSEiiD.md.png)](https://www.helloimg.com/image/oSEiiD)灯光的来源有两种，直接照明和间接照明，在 three 中提供了多种灯光来模拟这两种光照方式。直接照明有直射光，点光源，聚光灯等，three 中环境光并不是模拟现实生活中的漫反射，因为漫反射要求的计算资源较多，一些性能较高的显卡提供了[光线追踪](https://zh.wikipedia.org/zh-hans/%E5%85%89%E7%B7%9A%E8%BF%BD%E8%B9%A4)的功能，在 three 中的环境光是给整个场景添加一个固定的亮度。

## 物体变换

[![oSEnzS.md.png](https://www.helloimg.com/images/2023/08/16/oSEnzS.md.png)](https://www.helloimg.com/image/oSEnzS)物体可以有三种变换，可以改变物体位置，大小或者旋转。并不是所有的物体都可以被缩放，light 与 camera 的缩放是无效的。

[![oSEbBC.md.png](https://www.helloimg.com/images/2023/08/16/oSEbBC.md.png)](https://www.helloimg.com/image/oSEbBC)three 中物体默认的旋转顺序是 XYZ，旋转的正方向是逆时针方向，旋转的角度使用的是弧度制而不是角度，也并不是所有的物体都能被旋转，对于灯光的旋转是无效的。

[![oSElsQ.md.png](https://www.helloimg.com/images/2023/08/16/oSElsQ.md.png)](https://www.helloimg.com/image/oSElsQ)

## 代码说明

```js
<script>
    /**
     * 创建场景对象Scene
     */
    var scene = new THREE.Scene();
    /**
     * 创建网格模型
     */
    var geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
    var material = new THREE.MeshLambertMaterial({
      color: 0xff0000,
      // wireframe:true, //网格模型以线条的模式渲染
    }); //材质对象Material
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    scene.add(mesh); //网格模型添加到场景中
    /**
     * 光源设置
     */
    //点光源，可以删除点光源，观察效果
    var point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
    //环境光
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    /**
     * 相机设置
     */
    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(100, 100, 100); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染器对象
     */
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);//设置渲染区域尺寸
    renderer.setClearColor(0xffffff, 1); //设置背景颜色
    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作   指定场景、相机作为参数
    renderer.render(scene, camera);
  </script>
```

[![oSEMvt.th.png](https://www.helloimg.com/images/2023/08/16/oSEMvt.th.png)](https://www.helloimg.com/image/oSEMvt)

如果将以上代码中相机的位置设置为 camera.position.set(0, 0, 100) ，则相当于在立方体的正面观察，也就只能看见以下所示的正方形。这里与[WebGL实现立方体](https://km.woa.com/articles/show/557261?kmref=author_post)中需要对立方体进行矩阵变换道理是一样的

[![oSE2Yu.md.png](https://www.helloimg.com/images/2023/08/16/oSE2Yu.md.png)](https://www.helloimg.com/image/oSE2Yu)

如果将以上代码中添加点光源部分的代码删除

```js
var point = new THREE.PointLight(0xffffff);
point.position.set(400, 200, 300); //点光源位置
scene.add(point); //点光源添加到场景中
```

[![oSEWev.md.png](https://www.helloimg.com/images/2023/08/16/oSEWev.md.png)](https://www.helloimg.com/image/oSEWev)
可以发现立方体也是没有立体效果的，这里与WebGL实现立方体文章中提到需要给物体添加光照的原理一致。  

可以为场景添加多个光源  

你可以把点光源的位置设置为 (0,0,0) ，然后不使用其它任何光源，这时候你会发现场景中立方体渲染效果是黑色。其实原因很简单，立方体是有大小占用一定空间的，如果光源位于立方体里面，而不是外部，自然无法照射到立方体外表面。

### 立方体旋转动画

Threejs绘制旋转动画同样是通过 requestAnimationFrame 进行，通过调用Mesh对象的 rotateY 方法实现绕Y轴旋转的动画效果

```js
function draw(){
  requestAnimationFrame(draw)
  // 绕Y轴旋转，旋转角速度0.001弧度每毫秒
  mesh.rotateY(0.001)
  renderer.render(scene, camera);
}
draw()
```

### 绘制多个几何体

Threejs中绘制多个立方体只需要将物体加入到场景中，threejs的几何体默认位于场景世界坐标的原点(0,0,0)，所以绘制多个几何体的时候，主要它们的位置设置。

```js
// 球体网格模型
var geometry2 = new THREE.SphereGeometry(30, 30, 30);
var material2 = new THREE.MeshLambertMaterial({
  color: 0xff00ff
});
var mesh2 = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
mesh2.translateX(150); //球体网格模型沿X轴正方向平移150
scene.add(mesh2);

// 圆柱网格模型
var geometry3 = new THREE.CylinderGeometry(30, 30, 100, 25);
var material3 = new THREE.MeshLambertMaterial({
  color: 0xffff00
});
var mesh3 = new THREE.Mesh(geometry3, material3); //网格模型对象Mesh
mesh3.position.set(-150,0,0);//设置mesh3模型对象的xyz坐标为-150,0,0
scene.add(mesh3); 
```

[![oSE9TE.md.png](https://www.helloimg.com/images/2023/08/16/oSE9TE.md.png)](https://www.helloimg.com/image/oSE9TE)

使用顶点数据绘制立方体

立方体网格模型Mesh是由立方体几何体geometry和材质material两部分构成，立方体几何体 BoxGeometry 本质上就是一系列的顶点构成，只是Threejs的API BoxGeometry 把顶点的生成细节封装了，用户可以直接使用。

比如一个立方体网格模型，有6个面，每个面至少两个三角形拼成一个矩形平面，每个三角形三个顶点构成，对于球体网格模型而言，同样是通过三角形拼出来一个球面，三角形数量越多，网格模型表面越接近于球形。 [![oSEOKY.md.png](https://www.helloimg.com/images/2023/08/16/oSEOKY.md.png)](https://www.helloimg.com/image/oSEOKY)

使用顶点数据绘制立方体

```js
var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
//类型数组创建顶点数据
var vertices = new Float32Array([
  50,  50,  50,//顶点0
  -50,  50,  50,//顶点1
  -50, -50,  50,//顶点2
  50,  50,  50,//顶点0
  -50, -50,  50,//顶点2
  50, -50,  50,//顶点3

  50,  50,  50,//顶点0
  50, -50,  50,//顶点3
  50, -50, -50,//顶点7
  50,  50,  50,//顶点0
  50,  50, -50,//顶点4
  50, -50, -50,//顶点7

  50,  50,  50,//顶点0
  -50,  50,  50,//顶点1
  -50,  50, -50,//顶点5
  50,  50,  50,//顶点0
  50,  50, -50,//顶点4
  -50,  50, -50,//顶点5

  -50,  50,  50,//顶点1
  -50, -50,  50,//顶点2
  -50, -50, -50,//顶点6
  -50,  50,  50,//顶点1
  -50, -50, -50,//顶点6
  -50,  50, -50,//顶点5

  -50, -50,  50,//顶点2
  50, -50,  50,//顶点3
  -50, -50, -50,//顶点6
  50, -50,  50,//顶点3
  -50, -50, -50,//顶点6
  50, -50, -50,//顶点7

  50,  50, -50,//顶点4
  -50,  50, -50,//顶点5
  -50, -50, -50,//顶点6
  50,  50, -50,//顶点4
  -50, -50, -50,//顶点6
  50, -50, -50,//顶点7
  50, 0, 0, //顶点2坐标
]);

// 创建属性缓冲区对象
var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

...
var material = new THREE.MeshLambertMaterial({
   color: 0xff0000, //三角面颜色
   side: THREE.DoubleSide //双面渲染，否则旋转到某个角度有些面就看不到了，默认单面渲染
}); //材质对象

var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(mesh)
```

### 索引复用

绘制一个矩形网格模型,至少需要两个三角形拼接而成，两个三角形，每个三角形有三个顶点，也就是说需要定义6个顶点位置数据。对于矩形网格模型而言，两个三角形有两个顶点位置是重合的。也就是说可以重复的位置可以定义一次，然后通过通过顶点数组的索引值获取这些顶点位置数据。

```js
var vertices2 = new Float32Array([
   50,  50,  50,//顶点0
   -50,  50,  50,//顶点1
   -50, -50,  50,//顶点2
   50, -50,  50,//顶点3
   50,  50, -50,//顶点4
   -50,  50, -50,//顶点5
   -50, -50, -50,//顶点6
   50, -50, -50,//顶点7
]);

// Uint16Array类型数组创建顶点索引数据
var indexes = new Uint16Array([
  // 0对应第1个顶点位置数据、第1个顶点法向量数据
  // 1对应第2个顶点位置数据、第2个顶点法向量数据
  // 索引值3个为一组，表示一个三角形的3个顶点
  0, 1, 2, 0, 2, 3,
  0, 3, 7, 0, 4, 7,
  0, 1, 5, 0, 4, 5,
  1, 2, 6, 1, 6, 5,
  2, 3, 6, 3, 6, 7,
  4, 5, 6, 4, 6, 7,
])
// 创建属性缓冲区对象
var attribue = new THREE.BufferAttribute(vertices2, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

// 索引数据赋值给几何体的index属性
geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组
```

[![oSEdF9.md.png](https://www.helloimg.com/images/2023/08/16/oSEdF9.md.png)](https://www.helloimg.com/image/oSEdF9)

### 法向量

上述代码仅仅定义了几何体BufferGeometry的顶点位置数据，没有定义顶点法向量数据。没有法向量数据，点光源、平行光等带有方向性的光源不会起作用，三角形平面整个渲染效果相对暗淡，而且两个三角形分界位置没有棱角感。

太阳光照在一个物体表面，物体表面与光线夹角位置不同的区域明暗程度不同，WebGL中为了计算光线与物体表面入射角，你首先要计算物体表面每个位置的法线方向，在Threejs中表示物体的网格模型Mesh的曲面是由一个一个三角形构成，所以为了表示物体表面各个位置的法线方向，可以给几何体的每个顶点定义一个方向向量。
[![oSEvnX.th.png](https://www.helloimg.com/images/2023/08/16/oSEvnX.th.png)](https://www.helloimg.com/image/oSEvnX)
```js
/**
*顶点法向量数组normals
**/
var normals = new Float32Array([
  0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,//z轴正方向——面1
  1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,//x轴正方向——面2
  0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,//y轴正方向——面3
  -1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,//x轴负方向——面4
  0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,//y轴负方向——面5
  0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1//z轴负方向——面6
]);

// 设置几何体attributes属性的位置normal属性
geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的法向量数据
```

[![oSEwzg.th.png](https://www.helloimg.com/images/2023/08/16/oSEwzg.th.png)](https://www.helloimg.com/image/oSEwzg)

### 彩色立方体

Three.js提供了BoxGeometry，很方便的创建了立方体，但是没有办法设置顶点颜色。Three.js还提供了缓冲几何体对象BufferGeometry，采用绘制三角面元的思想，通过类型数组设置几何体顶点位置与颜色，从而得到想要的立方体模型。

基于上述使用顶点数据绘制立方体模块涉及代码，需要给顶点数据添加颜色。

```js
//类型数组创建顶点颜色color数据
var colors = new Float32Array([
  1,0,0, 1,0,0, 1,0,0,//红色——面1
  0,1,0, 0,1,0, 0,1,0,//绿色——面2
  0,0,1, 0,0,1, 0,0,1, //蓝色——面3
  1,1,0, 1,1,0, 1,1,0,//黄色——面4
  0,0,0, 0,0,0,0,0,0,//黑色——面5
  1,1,1, 1,1,1, 1,1,1,//白色——面6
]);
// 设置几何体attributes属性的颜色color属性
geometry.attributes.color = new THREE.BufferAttribute(colors, 3); //3个为一组,表示一个顶点的颜色数据RGB

var material = new THREE.MeshLambertMaterial({
  side: THREE.DoubleSide, 
  vertexColors: THREE.VertexColors, //以顶点颜色为准
});
```

[![oSENBM.md.png](https://www.helloimg.com/images/2023/08/16/oSENBM.md.png)](https://www.helloimg.com/image/oSENBM)