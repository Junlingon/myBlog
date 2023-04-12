---
title: 路由鉴权by浪哥
description: --技术分享
date: 2023-04-12
random: mood
tags:
    - REACT
---



## 前言
React-Router是React生态里面很重要的一环 常用的路由模式有 <BrowserRouter>, <HashRouter>, <MemoryRouter>
现在React的单页应用的路由基本都是前端自己管理的，而不像以前是后端路由，React管理路由的库常用的就是React-Router。本文想写一下React-Router的使用，但是光介绍API又太平淡了，而且已经 官方文档 写得很好了，我这里就用一个常见的开发场景来看看React-Router是怎么用的吧。我们一般的系统都会有用户访问权限的限制，某些页面可能需要用户具有一定的权限才能访问

登录这块我们使用 ops后台的统一鉴权就可以了 
菜单这块的权限 喜马安全部针对后台功能鉴权有一套解决方案:  权限中心
本文主要介绍菜单权限和组件权限的对接实现

## 版本
依赖 | 版本
react | @17.0.2
react-router-dom  | @5.2.0 
antd | @4.15.4
@xmly/auth-component  | @0.0.9

## 配置数据获取
不同环境的 productCode, 需要找安全部配置开通, 具体可以联系 @杜红顺
配置数据的获取我们是从权限中心去拿, 通过安全部提供的 sdk 可以拿到不同环境对应项目的权限数据, 如下

```js
import { init } from '@xmly/auth-component';

export const env = process.env.REACT_APP_BUILD_ENV as
  | 'development'
  | 'test'
  | 'uat'
  | 'production';

const productCodeConfig = {
  test: '****',
  uat: '****',
  prod: '****',
};

const envString = envConfig[env] as 'test' | 'uat' | 'prod';

// 通过安全部提供的sdk初始化权限数据
init(
  {
    opsId, // 通过服务端获取
    productCode: productCodeConfig[envString] || productCodeConfig['test'], // 安全部会生成唯一的code
  },
  envString
)
```


## 路由鉴权
因为我们的路由是通过接口获取的, 所以我们需要做成可配置的 json 格式的数据, 类似如下:
```js
{
  "hierarchyMenuList": [
    {
      "menuName": "综合查询",
      "menuUrl": "/comprehensive-query",
      "childList": [
        {
          "menuName": "订单查询",
          "parentMenuName": "综合查询",
          "menuUrl": "/comprehensive-query/order-query",
          "childList": null
        }
      ]
    }
  ]
}
```
拿到上面的数据我们需要通过 react-router-dom 对菜单的数据进行注册初始化路由, 方案如下:
```js
import { useAuthorityList } from '@xmly/auth-component';

const XRouter: FC<Props> = (props: Props) => {
  // 首页地址 假如没有首页地址 获取可跳转的第一个菜单路由进行重定向
  const { redirectUrl } = props;
  // 获取菜单列表数据
  const authorityList = useAuthorityList();

  const filterRouter = useCallback(() => {
    if (authorityList.menuList.length === 0) return [];

    const menuList = authorityList.menuList;

    // 格式化接口菜单数据合并进result用于生成子应用路由
    menuList.forEach((menu: MENU_INTERFACE) => {
        let component: any = () => '';
        result.push({
          name: menu.menuName,
          path: menu.menuUrl,
          component,
        });
    });

    // 生成路由列表组件
    return recursionRouter([...whiteRoutes, ...result]);
  }, [authorityList]);

  return (
     // 使用 Suspense + lazy + import(webpack) 做组件的懒加载
    <Suspense fallback={<div></div>}>
    // 使用 Switch 匹配组件
      <Switch>
        <Redirect exact from="/" to={redirectUrl} />
        // 渲染路由列表组件
        {filterRouter()}
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

动态递归初始化路由 (简化版)
function recursionRouter({
  routeList,
  path = '',
}: {
  routeList: Routes[];
  path?: string;
}) {
  return (
    <>
      {routeList.map(route => {
        if (Array.isArray(route.children) && route.children.length > 0) {
          return (
            <Fragment key={route.path}>
              // 递归拍平成一维路由
              {recursionRouter({
                routeList: route.children,
                path: `${path}${route.path}`,
              })}
            </Fragment>
          );
        }

        if (route.component) {
          const Component = route.component;

          return (
            <Route
              key={route.path}
              exact
              strict
              // 路由路径的初始化
              path={path + route.path}
              render={props => <Component {...props} />}
            ></Route>
          );
        }
      })}
    </>
  );
}
```
至此, 我们获取权限中心并进行路由初始化的工作已经完成
下面我们说下动态菜单初始化和匹配

## 菜单配置
React 后台菜单组件我一般使用 Ant-Design 的 [Menu 导航菜单组件](https://ant-design.gitee.io/components/menu-cn/#header)
```js
const XMenu: FC = () => {
  const location = useLocation<Location>();

  // 菜单选中值
  const selectKeys: SelectKeys = useMemo<SelectKeys>(() => {
    return [location.pathname];
  }, [location.pathname]);

  return (
    <Menu
      className="h-full"
      theme="dark"
      mode="inline"
      defaultOpenKeys={routes
        .filter(route => Array.isArray(route.children))
        .map(route => route.path)}
      selectedKeys={selectKeys}
    >
      // 生成菜单 routes 通过接口获取菜单数据
      // 具体实现不过多赘述
      {recursionMenu(routes)}
    </Menu>
  );
};
```

## 微前端接入鉴权
随着项目体量不断的扩大, 打包的速度和项目的部署时间会变长, 代码之间的功能可能会出现耦合, 为了优化上述问题, 可以考虑接入微前端进行项目优化, 我们这里使用 [qiankun](https://qiankun.umijs.org/zh)

在设计微前端如何接入的时候, 本着企业管理系统体量比较大, 配置优于代码的结论, 决定使用权限中心的菜单配置化接入微前端子应用.

因为权限中心没有现成的方案去配置子应用, 所以我们采用了菜单配置的方式去配置子应用的数据, 再在项目中过滤, 筛选出这部分数据用于初始化子应用

实现如下:
 1. 首先在权限中心配置微前端的数据
<img url='' />

 2. 在主项目中初始化
 ```js
function init(micro) {
  const { NODE_ENV } = process.env;
  // 区分本地还是线上环境
  if (NODE_ENV === 'development') {
    require('./initFromLocal');
  } else {
    // micro.childList 就是筛选过滤的子应用配置数据
    if (Array.isArray(micro?.childList) && micro.childList.length > 0) {
      const initFormServer = require('./initFromServer');
      initFormServer.default(micro.childList);
    }
  }
}
```

初始化线上子应用配置
```js
import { prefetchApps, registerMicroApps, start } from 'qiankun';

type ENTRY_NAME = 'payment' | 'settle' | 'balance' | 'comprehensive-query';

const getActiveRule = (path: any) => (location: any) =>
  location.pathname.indexOf(path) > -1;

function initFormServer(list: any) {
  // 权限中心没有很多扩展配置 所以采用json的方式去配置 这里去转json数据
  const microList = formatList(list);
  // 格式化子应用配置数据
  const entryConfig: Record<
    string,
    {
      name: string;
      dev: string;
      line: string;
    }
  > = microList.reduce((config: any, micro: any) => {
    micro.entry &&
      (config[micro.entry] = {
        name: micro.entry,
        dev: `//localhost:${micro.devPort}`, // 子应用本地地址
        line: `${window.location.origin}${micro.line}`, // 子应用线上地址(约定式)
      });

    return config;
  }, {});

  function getEntry(name: ENTRY_NAME) {
    return isDev ? entryConfig[name].dev : entryConfig[name].line;
  }

  registerMicroApps(
    microList.map((entry: any) => ({
      name: `${entry.entry} microApp`, // 子应用名称
      entry: getEntry(entry.entry), // 入口地址
      container: entry.container, // 容器dom
      activeRule: getActiveRule(entry.activeRule), // 匹配规则
    }))
  );

  start();
}
```

## 页面鉴权
按钮权限的配置使用了权限中心的接口权限+页面权限配合
简单说就是配置一个 Json List 数据

可以配置到全局的状态管理中, 然后需要用到的地方去取出来控制页面功能的权限
微前端的话通过通讯的方式传递

## 总结
完成以上的配置后, 我们的项目鉴权基本就差不多了. 达到的效果如下
1. 权限中心配置, 控制菜单
2. 动态接入子应用+子应用菜单权限
3. 页面鉴权


本文内容比较简略，作为熟悉后台鉴权. 最主要的是如果有类似的需求, 大家需要知道我们可以利用公司已有的权限中心做配置, 不需要自己动手再开发一份, 大大节省了开发时间

<b>存在的问题</b>:
1. 动态接入子应用并没有跟子应用下的菜单做合并, 注册子应用和子应用菜单是分开处理的

## 思考
1. 假如说需要做嵌套路由权限控制, 该如何改造项目路由 期望效果如下

<img />
   我有一个左侧菜单 1, 右侧内容区域的右上角有一个下拉菜单 2, 右侧内容区域的左侧有个菜单 3
   json 伪代码如下:

```js
 [{
    "name": "菜单1",
    "children": [{
       "name": "菜单2",
        "children": [{
          "name": "菜单3",
        }]
    }]
   }]
```

权限中心获取菜单权限数据格式如下
```js
{
  "code": 1,
  "msg": "成功",
  "stackTrace": null,
  "data": {
    "opsId": "21777",
    "userName": "阿浪",
    "authorityList": {
      // 接口权限列表
      "nozzleList": [
        {
          "productCode": "***",
          "nozzleId": 391,
          "routeName": "/api/payment/getBillRecord",
          "description": "查询付款记录",
          "type": 0
        }
      ],
      // 菜单一维扁平化列表
      "menuList": [
        {
          "productCode": "****",
          "menuId": 462,
          "menuName": "主播账单下载",
          "menuLink": "isMain=1",
          "parentMenuName": "主播收益",
          "menuIcon": null,
          "menuUrl": "/earning/new1",
          "parentMenuId": 458,
          "menuLevel": 2,
          "menuOrder": "3",
          "description": null,
          "childList": null
        }
      ],
      // 页面权限列表
      "pagePowerList": [
        {
          "productCode": "****",
          "pagePowerId": 143,
          "nozzleId": 561,
          "parentPagePowerId": null,
          "routeName": "/dingtalkAudit"
        }
      ],
      // 菜单列表
      "hierarchyMenuList": [
        {
          "productCode": "****",
          "menuId": 528,
          "menuName": "综合查询",
          "menuLink": null,
          "parentMenuName": null,
          "menuIcon": null,
          "menuUrl": "/comprehensive-query",
          "parentMenuId": null,
          "menuLevel": 1,
          "menuOrder": "5",
          "description": null,
          "childList": [
            {
              "productCode": "****",
              "menuId": 529,
              "menuName": "订单查询",
              "menuLink": "",
              "parentMenuName": "综合查询",
              "menuIcon": null,
              "menuUrl": "/comprehensive-query/order-query",
              "parentMenuId": 528,
              "menuLevel": 2,
              "menuOrder": "1",
              "description": null,
              "childList": null
            }
          ]
        }
      ]
    }
  },
  "logs": null
}
```

链接导航
●  权限中心接入指南
●  权限系统-（新版本）权限验证前端接入文档
●  获取权限数据 SDK
