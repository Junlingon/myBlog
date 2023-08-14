---
title: useShouldRenderModel
description: 这是一个关于3D兼容性检测的hooks钩子
date: 2023-07-30
random: iPhone
tags:
    - REACT
---

这是一个关于3D兼容性检测的hooks钩子，主要考虑了设备类型、浏览器类型、设备性能等因素，以确保在合适的设备和浏览器上渲染模型。以确保良好的兼容性和用户体验。

# 先对主要的hook函数进行分析
```js
export const useShouldRenderModel = (): [boolean, Function] => { 
 // 默认情况下，我们假设应该渲染模型。
  const [shouldRenderModel, setShouldRenderModel] = useState(true);  
  useEffect(() => {   
  //在组件挂载后立即检测设备和浏览器的性能。 
    detect();  
  }, []);  
  async function detect() { 
    //以确定设备是否支持渲染模型
     if (!checkIsUsableDevice()) {
           setShouldRenderModel(false);
           return;
     } 
     //检测设备的帧速率。如果帧速率较低,也不适合渲染   
     if (await checkIsLowFPS()) {      
       setShouldRenderModel(false);      
       // @ts-ignore      
       if (window.aegisIns) {        
       // @ts-ignore 
       //如果有这个对象，那么上报这个事件记录下来，类似埋点？？       
         window.aegisIns.reportEvent({ name: 'DEGRADE_HOME_BANNER' }); 
       }    
     }  
    }  
    return [shouldRenderModel, detect];
    //它返回一个包含两个元素的数组：shouldRenderModel（布尔值，表示是否应该渲染模型）和 detect（函数，用于检测设备和浏览器的性能）。
 };
 ```
useState 用于初始化 shouldRenderModel 的值为 true。这意味着默认情况下，我们假设应该渲染模型。useEffect 在组件首次渲染时调用 detect 函数。这是为了确保我们在组件挂载后立即检测设备和浏览器的性能。 当不满足能够支持渲染，或者支持渲染但帧速率低的话都不渲染

# 工具函数
```js
export const isClientSide = (): boolean => Boolean(typeof window !== 'undefined' && window.document);

export const checkIsMobile = () => {
  if (!isClientSide()) {
      return false;
    }  
    // 与 nodejs 保持一致  
    // 保证初始渲染内容的一致性，后续再根据宽度来判定是否需要重新渲染  
 const ua = navigator.userAgent.toLocaleLowerCase();  
 //navigator.userAgent中是否包含移动设备类型字符串  
 const types = ['android', 'ipad', 'iphone', 'windows phone'];
   return types.some((type) => ua.indexOf(type) !== -1);
};

export const checkIsSafari = () => {
  if (!isClientSide()) {
      return false;  
  }  
  const ua = navigator.userAgent.toLocaleLowerCase();  
  return ua.includes('safari') && !ua.includes('chrome');
};

export const isEmptyObject = (obj: object) => Object.keys(obj).length === 0;

//它接受一个图片 URL 作为参数，并返回一个 Promise。
//当图片加载完成或加载失败时，Promise 将被解析（resolve）
export const preloadImage = (url: string) =>  
    new Promise<void>((resolve, _) => {
        const img = new Image();
        img.onload = img.onerror = () => {      
          resolve();    
     };    
    img.src = url;
});

//十六进制颜色值转换为 RGBA 格式
export const hexToRgbA = (hex: string, opacity = 1) => {  
    hex = hex.replace(/^#/, '');  
    if (hex.length === 3) {    
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];  
    }  
    const number = Number.parseInt(hex, 16);  
    const red = number >> 16;  
    const green = (number >> 8) & 255;  
    const blue = number & 255;  
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

// https://github.com/faisalman/ua-parser-js/blob/master/src/ua-parser.js
export const checkIsQQBrowser = (ua: string) => ua?.toLowerCase().indexOf('qqbrowser') !== -1;
export const checkIs360 = (ua: string) => /\bqihu|(qi?ho?o?|360)browser/i.test(ua);
export const checkIsSougou = (ua: string) => /(metasr)[/ ]?([\w.]+)/i.test(ua);
```
完整代码
```javascript
import { useState, useEffect } from 'react';
import { checkIsMobile, checkIsQQBrowser, checkIs360, checkIsSougou } from '../util';

// 首次渲染时的 dom 结构和 renderToString 保持一致
// 最终值需要在 useEffect 中确认，hydrate 才没问题
export const useShouldRenderModel = (): [boolean, Function] => {
  const [shouldRenderModel, setShouldRenderModel] = useState(true);

  useEffect(() => {
    detect();
  }, []);

  async function detect() {
    if (!checkIsUsableDevice()) {
      setShouldRenderModel(false);
      return;
    }

    if (await checkIsLowFPS()) {
      setShouldRenderModel(false);
      // @ts-ignore
      if (window.aegisIns) {
        // @ts-ignore
        window.aegisIns.reportEvent({ name: 'DEGRADE_HOME_BANNER' });
      }
    }
  }

  return [shouldRenderModel, detect];
};

function checkIsUsableDevice() {
  return (
    // 模型在移动端不显示，此处移动端的判断不由宽度决定
    !checkIsMobile() &&
    !checkIsQQBrowser(navigator.userAgent) &&
    !checkIsSougou(navigator.userAgent) &&
    !checkIs360(navigator.userAgent) &&
    !checkIsLowVersion() &&
    isSupportWebgl() &&
    checkHardwareAccelerate()
  );
}

// For debug: 模拟第n次后调用为 FPS 低的情况
// let time = 0;
// async function checkIsLowFPS(): Promise<boolean> {
//   return new Promise<boolean>((resolve) => {
//     setTimeout(() => {
//       time -= 1;
//       resolve(time < 0);
//     }, 4000);
//   });
// }

async function checkIsLowFPS(): Promise<boolean> {
  const records = await calcFPS();
  return records.every((record) => record < 50);
}

function calcFPS(): Promise<number[]> {
  //calcFPS 函数用于计算设备的帧速率。
  //它使用 requestAnimationFrame 在每一帧渲染时调用 load 函数。
  //load 函数会计算当前帧和上一帧之间的时间间隔，以计算帧速率。
  return new Promise((resovle) => {
    const records: number[] = []; //用于存储帧速率记录

    let prevTime = (performance || Date).now(); //上一帧的时间戳
    let frames = 0; //帧计数器

    function load() {
      frames += 1; //递增 1，表示渲染了一帧。
      const time = (performance || Date).now();

      if (time > prevTime + 1000) { //如果已经过去了 1 秒
//计算过去这 1 秒内的平均帧速率，并将其添加到 records 数组中
        const fps = Math.round((frames * 1000) / (time - prevTime));
        records.push(fps);
//更新 prevTime 为当前时间戳，并将 frames 计数器重置为 0。
        prevTime = time;
        frames = 0;
      }

      // 采样 4s，banner 一屏切换的时间 4s
      if (records.length >= 4) {
//解析为 records 数组
        resovle(records);
      } else {
//继续在下一帧渲染时调用 load 函数。
        window.requestAnimationFrame(load);
      }
    }
    load();
  });
}

//isSupportWebgl 函数检查设备是否支持 WebGL。如果设备支持 WebGL，则返回 true；否则，返回 false。
function isSupportWebgl() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// https://gist.github.com/cvan/042b2448fcecefafbb6a91469484cdf8#file-webgl-detect-gpu-js-L8
// https://gist.github.com/gkjohnson/9ee8b40bd9475576a1ab5c2ca9c6121d
// 检测是否开启硬件加速 (不能准确判断)
// 在 chrome 浏览器中，如果开启硬件加速，renderer 的值为 GPU 信息，否则为其他值
// 有一些老的苹果电脑 renderer 的值是 Apple GPU，新的电脑是 Apple M1
// 在 firefox 中，是否开启硬件加速， renderer 的值均为 GPU 信息
function checkHardwareAccelerate() {
  const canvas = document.createElement('canvas');
  let gl;
  let debugInfo;
  let renderer: string;

  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch (e) {}

  if (gl) {
    //获取 WebGL 调试渲染器信息扩展。这个扩展提供了关于 GPU 的详细信息。
    debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    //获取 GPU 的渲染器信息
    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    //如果包含其中任何一个厂商名称，说明设备支持硬件加速，返回 true；
    return ['AMD', 'Intel', 'NVIDIA', 'Apple'].some((d) => renderer.indexOf(d) !== -1);
  }

  return false;
}

// https://stackoverflow.com/questions/23242002/css-class-for-only-safari-on-windows
function checkIsLowVersion() {
  const nAgt = navigator.userAgent; //关于浏览器的信息
  let fullVersion = `${parseFloat(navigator.appVersion)}`; //版本号
  let majorVersion;
  let verOffset;
  let ix;
  const getVersion = () => {
    // 提取浏览器的完整版本号和主要版本号。
    if ((ix = fullVersion.indexOf(';')) != -1) fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(' ')) != -1) fullVersion = fullVersion.substring(0, ix);
    majorVersion = parseInt(`${fullVersion}`, 10);
    // @ts-ignore
    fullVersion = parseFloat(fullVersion);
    if (isNaN(majorVersion)) {
      // @ts-ignore
      fullVersion = parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }
  };

//对于每种浏览器类型，都有一个预设的最低版本阈值。
//如果当前浏览器版本低于阈值，则返回 true，表示浏览器版本过低；
  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset = nAgt.indexOf('Opera')) != -1) {
    fullVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
    getVersion();
    return majorVersion < 45;
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
    return true;
  }
  // In edge, the true version is after "Chrome"
  if ((verOffset = nAgt.indexOf('Edge')) != -1) {
    fullVersion = nAgt.substring(verOffset + 5);
    getVersion();
    return majorVersion < 50;
  }
  // In Chrome, the true version is after "Chrome"
  if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
    fullVersion = nAgt.substring(verOffset + 7);
    getVersion();
    return majorVersion < 56;
  }
  // In Safari, the true version is after "Safari" or after "Version"
  if ((verOffset = nAgt.indexOf('Safari')) != -1) {
    fullVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
    getVersion();
    // @ts-ignore
    return fullVersion < 15.1;
  }
  // In Firefox, the true version is after "Firefox"
  if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
    fullVersion = nAgt.substring(verOffset + 8);
    getVersion();
    return majorVersion < 80;
  }
//如果所有浏览器类型的检查都完成，但没有找到匹配的类型，那么默认返回 true，表示浏览器版本过低。
  return true;
}
```

# 思维导图
图片: https://uploader.shimo.im/f/qjMkjst651jkUhyz.png!thumbnail?accessToken=eyJhbGciOiJIUzI1NiIsImtpZCI6ImRlZmF1bHQiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE2OTIwMjU4NTQsImZpbGVHVUlEIjoiNDczUU1FTWVaanU4T28zdyIsImlhdCI6MTY5MjAyNTU1NCwiaXNzIjoidXBsb2FkZXJfYWNjZXNzX3Jlc291cmNlIiwidXNlcklkIjo3MjA3MjQwN30.BUnFiAM-IOLg-wTQZ_RAMM33SpIBMrrSlyfCCPd835o
