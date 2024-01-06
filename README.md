<img width="120px" src="https://user-images.githubusercontent.com/12215982/225367174-f967aa05-5f35-474e-8ae2-0ea0619bd5d8.svg"/>

# 标题日记
一个纯文本的日记 web 应用，专注记录生活琐事。


> [http://kylebing.cn/diary](http://kylebing.cn/diary)  
> _右下角，体验账号登录试用_



## 界面

![2023-08-31 11 27 29](https://github.com/KyleBing/diary/assets/12215982/1c9e40d1-d175-42d6-aed6-266a18cbbe3b)


---

## 一、日记的使用

### 1. 正确使用方式


> 用概括的标题列表来概览你的近期生活。  
建议标题字数控制在 20 字以内，这样更方便从列表概览内容。

不要流水帐一样记录很多内容，每天记录一下当天比较重要的事，需要记录的点，比如：

- 今天干嘛了？理发了？
- 学习了什么？
- 看了什么电影，感觉如何
- 加油了#92 加了多少？油价多少？
- 回老家了，几点回的家，油耗多少？
- 等等。。。

其实我感觉最重要的功能就是搜索，搜索过去的某件事发生在什么时间：
- 上次理发什么时候
- 上次回老家什么时候
- 6月12日我做了什么工作
- 我这个月的支出/收入分别是多少

当你用它记录了足够多小事的时候，就知道这个日记该怎么用了。  
就是记下你一天的重要时刻，你怕忘的内容，日后好查找。

### 2. 主要特性

- 记录天气、环境温度。
- 多个关键字搜索日记标题、内容。
- 日期、类别筛选日记。
- 分享某篇日记
  比如当前这篇日记的分享链接是：[http://kylebing.cn/diary/#/share/6766](http://kylebing.cn/diary/#/share/6766)
- 自动切换黑白两种样式。
- 日记统计
- 日记导出，多种格式： `json`, `txt`, `json`, `csv`
- 账单（需要指定格式书写）
   我一般每周整理一次账单，为了方便整理，建议你统一支付出口，只用一个作为主要支付手段：支付宝、微信，这样在统计的时候好统计，不然你还需要去多个地方统计。

### 3. 适配多端

有浏览器就能访问，电脑 + 移动端：都能完美显示

### 4. 文本编辑时支持 JetBrains 相关快捷键


| 快捷键 | 功能 |
|---|---|
| <kbd>CTRL</kbd>+ <kbd>D </kbd> | 复制当前行。|
| <kbd>Tab</kbd> | 在前面插入 4 个空格。|
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | 删除行前的空格，多于4个，一次性删除4个，小于四个，清除前面的空格。|
| <kbd>CTRL</kbd>+ <kbd>← </kbd> | 移动到行最左端|
| <kbd>CTRL</kbd>+ <kbd>→ </kbd> | 移动到行最右端|


## 二、服务部署
该项目包含两个部分，具体的部署方式在各个项目中都有介绍：  

- 前端：[https://github.com/KyleBing/diary-vue](https://github.com/KyleBing/diary-vue) `vue3`+`ts`+`vite`
- 后台：[https://github.com/KyleBing/portal](https://github.com/KyleBing/diary-portal) `nodejs`

## 三、邀请码的使用
新用户注册需要邀请码，邀请码有两种：  
- 一种是万能的，在后台系统的配置文件中配置；
- 另外一种是一次性的，一人一码。  

1. 登入系统后，点开菜单，选择邀请码菜单（用户默认注册后的 `group_id` 为 `2`，只有用户 `group_id` 为 `1` 的用户才能看到，需要手动去数据库中指定管理员账户），可以生成新的邀请码，点击邀请码就可以复制内容，分享给别人就可以了。
2. 邀请码页面中显示的是都是未注册的码，复制后邀请码变为绿色，表示已被分享还未使用。

> 目前初始化的过程还不是很好，所以先手动修改数据吧


## 四、项目配置

### 1. 图片存储配置 `[选配]`
> 如若不配置：只是不能显示用户头像而已  
头像文件是存储到 [七牛云](https://www.qiniu.com/) 上的，免费注册会有免费额度，够用。  
需要修改 `/src/projectConfig.ts` 文件内容，改成你的七牛云配置。

```js
export default {
  // 七牛云
  // 地址： https://portal.qiniu.com/kodo/overview
  QiniuImgBaseURL: 'http://rnov15v13.hb-bkt.clouddn.com/', // 空间域名，最后面带 `/`
  QiniuBucketName: 'diary-container', // 七牛云对象存储空间的名称
}
```

### 2. 和风天气配置 `[选配]`
> 如若不配置：只是不能自动获取当地天气和温度而已  
用于从 [和风天气](https://www.qweather.com/) 中获取地域的天气和温度信息，也是在 `/src/projectConfig.ts` 文件中

```js
export default {
  // 和风天气开发 key
  // 地址：https://dev.qweather.com/
  HefengWeatherKey: '',
}
```

### 3. nginx gzip 配置
部署前端项目时，最好在 `nginx` 中添加 `gzip` 开关，这样能有效加快项目载入速度，比如我的 1.3M 的 `js` 文件，在 `gzip` 处理后压缩到了 360kb。
> 可以参阅：[1.3mb js 文件压缩至 360kb，加快 vue 项目的加载速度，nginx gzip设置](https://blog.csdn.net/KimBing/article/details/127934749)
```ini
gzip on;
gzip_static on;
gzip_min_length 1k;
gzip_http_version 1.1;
gzip_comp_level 9;
gzip_types  text/css application/javascript application/json;
```

## 五、开发说明

配置存储：  
所有配置信息都保存在 `LocalStorage` 中
- `DiaryConfig`: 用户的配置信息（类别筛选，日期筛选，关键字）
- `Authorization`: 用户信息（`avatar`,`city`,`email`,`geolocation`,`group_id`,`nickname`,`phone`,`token`,`uid`）

## 六、用到的 npm 包

- `vue3` + `ts` + `vite` 
- `vue-router`
- `pinia`
- `axios` 
- `clipboard` 
- `moment`
- `@vuepic/vue-datepicker` 
- `marked`
- `echarts`
- `floating-vue`
- `qiniu-js`


## 七、项目历程

1. 2017 年的时候想学 iOS 了顺便做了个不太成熟的 iOS 版 app，当时日记是存储在 `iCloud` 中的，有了 app 的界面样子，但并不能很完美的使用。
2. 后来过了很久，到 2019 年的时候感觉自己前端技术差不多了，就想把它实现了，最初使用的是 `HTML` + `jQuery`。
3. 后来对 `Vue` 了解的足够多之后，就改成了 `HTML` + `Vue`。最初只有移动端的，添加了 PC 版界面。
4. 再后来就大改了，改成了纯 `Vue` 模式，此时的 PC 版和移动端还是在两个分支上的。
5. 又过了好久，移动端和 PC 两个版本整合到一起。
6. 2024年1月，改写成 `vite` + `ts` 版本


## 八、项目周期

`2017-09-27` ~ `现在`

因为自己在用这个，也是自己最喜欢、使用频率最高的项目，所以只要我还健在，这个项目就会被一直维护下去。



## 九、支持
感谢 [JetBrains](https://www.jetbrains.com/?from=diary-vue@KyleBing) 提供的工具支持

![JetBrains](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg?_ga=2.54620846.401568951.1648434626-301403838.1648434626)



## 十、界面截图 - 详细

**PC**
![2023-08-31 11 25 31](https://github.com/KyleBing/diary/assets/12215982/1c633aaa-e7a4-4417-864f-52706cf9b445)
![2023-08-31 11 24 39](https://github.com/KyleBing/diary/assets/12215982/4f38e4bd-e5d3-4b55-aaa4-05ae245f3600)
![2023-08-31 11 23 48](https://github.com/KyleBing/diary/assets/12215982/4f181e5e-ec20-4564-b76b-a0b6d90991dd)



登录  
<img width="1512" alt="登录" src="https://user-images.githubusercontent.com/12215982/185168128-ec2d092f-85f6-4ffd-a510-dfcff5daf926.png">

编辑页面  
<img width="1920" alt="编辑页面" src="https://github.com/KyleBing/diary/assets/12215982/617f63a5-ec94-49f4-9c61-1761055e320c">

日记详情  
<img width="1920" alt="日记详情" src="https://github.com/KyleBing/diary/assets/12215982/69de00a4-d689-4a2f-9e89-92bdf78a89c8">

统计  
<img width="1512" alt="统计" src="https://user-images.githubusercontent.com/12215982/185168085-bb97e434-132c-44be-b3f8-db55e25816e5.png">

银行卡列表  
<img width="1920" alt="银行卡列表" src="https://user-images.githubusercontent.com/12215982/225222928-9bf993ef-39aa-4708-ba20-13f5f2b5f398.png">

共享日记  
<img width="1920" alt="共享日记" src="https://github.com/KyleBing/diary/assets/12215982/0143c6e2-e6fd-48dc-92ea-94d37c4afd67">

资料编辑  
<img width="1920" alt="资料编辑" src="https://github.com/KyleBing/diary/assets/12215982/ecffb47f-e114-46f6-8455-403d77fcfe9b">

一键隐藏所有内容  
<img width="1920" alt="一键隐藏所有内容" src="https://github.com/KyleBing/diary/assets/12215982/fb54c8b7-0abb-4490-9ecb-b3d7fd0c95bc">

账单  
<img width="1920" alt="账单" src="https://github.com/KyleBing/diary/assets/12215982/473093a7-f83e-422d-b32c-84f65fc9f9e8">

类别筛选  
<img width="1920" alt="类别筛选" src="https://github.com/KyleBing/diary/assets/12215982/6ad0596e-86a4-42f6-ab19-86465716fc0a">

菜单  
<img width="1920" alt="菜单" src="https://github.com/KyleBing/diary/assets/12215982/fd10285b-9ae6-493f-9321-940ad22fa052">


iPad Pro 截图

![主页](https://github.com/KyleBing/diary/assets/12215982/c2786d3c-f73e-4fb3-848a-089051ade2ea)


**移动端**

<img src="https://user-images.githubusercontent.com/12215982/185166461-4696dc21-89b5-4c54-ad1f-8657bf9e3106.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166481-bbf95e76-1d5b-4054-98ee-2bd3b5603094.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166500-1817f0eb-7f65-420f-bd81-9afede94dc87.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166509-03df6525-0ddb-4f71-be8c-004599a10b4d.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166519-984f993c-783e-4b78-9cb0-3628af10935a.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166526-ae43b775-4eac-4c5a-a6b0-dc428500806c.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166532-a123b897-882e-4ff5-8df1-4f24f0cf8cb4.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166549-a90a5091-7b35-4ad9-ac62-f22515e6a8d8.PNG" alt="" width="240"/>
