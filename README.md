# " 标题日记 "
> 用一句话概括你的一天


## 线上地址
> 点击登录界面右下角的体验账号登录即可
> [https://kylebing.cn/diary](https://kylebing.cn/diary) 



## 界面

PC

<img width="1512" alt="登录" src="https://user-images.githubusercontent.com/12215982/185168128-ec2d092f-85f6-4ffd-a510-dfcff5daf926.png">
<img width="1512" alt="编辑" src="https://user-images.githubusercontent.com/12215982/185168137-831ff4f8-82ea-47f1-b092-3c66a86cdb4b.png">
<img width="1512" alt="长列表" src="https://user-images.githubusercontent.com/12215982/185168051-b19223f9-2df8-42d1-a39c-823f772426e0.png">
<img width="1512" alt="统计" src="https://user-images.githubusercontent.com/12215982/185168085-bb97e434-132c-44be-b3f8-db55e25816e5.png">
<img width="1512" alt="列表" src="https://user-images.githubusercontent.com/12215982/185168097-94161d53-5761-4c08-827f-31440a7c17b6.png">
<img width="1512" alt="银行卡列表" src="https://user-images.githubusercontent.com/12215982/185167943-87c84107-dde5-4119-b8c2-25de09685f3b.png">
<img width="1512" alt="账单列表" src="https://user-images.githubusercontent.com/12215982/185167980-4c9b8f72-74f7-41d9-9c80-7c8d8c2c73bf.png">
<img width="1512" alt="菜单" src="https://user-images.githubusercontent.com/12215982/185167988-a9929018-c420-4e13-b4fc-a681c2458efc.png">
<img width="1512" alt="类别" src="https://user-images.githubusercontent.com/12215982/185168041-2148d489-aaf1-4382-8116-6737b15b6014.png">
<img width="1512" alt="分享" src="https://user-images.githubusercontent.com/12215982/185168108-1647c59e-8fba-4369-a226-9279685e6844.png">
<img width="1512" alt="分享" src="https://user-images.githubusercontent.com/12215982/185168118-e38b3cb9-d96a-428e-b9d6-73d976872f77.png">


移动端

<img src="https://user-images.githubusercontent.com/12215982/185166461-4696dc21-89b5-4c54-ad1f-8657bf9e3106.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166481-bbf95e76-1d5b-4054-98ee-2bd3b5603094.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166500-1817f0eb-7f65-420f-bd81-9afede94dc87.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166509-03df6525-0ddb-4f71-be8c-004599a10b4d.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166519-984f993c-783e-4b78-9cb0-3628af10935a.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166526-ae43b775-4eac-4c5a-a6b0-dc428500806c.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166532-a123b897-882e-4ff5-8df1-4f24f0cf8cb4.PNG" alt="" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/185166549-a90a5091-7b35-4ad9-ac62-f22515e6a8d8.PNG" alt="" width="240"/>


---

## 一、项目介绍
《标题日记》是一款自己开发已久的日记 web 应用

也是自己一直以来想实现的这么个工具，从 2017 年开始，时至今日也还在不断的完善中。
之前是没有开源的，后台心想还是开源给更多人用吧，可能有需要用的。

#### 1. 初衷
一天记录一条记录，一目了然的查看近一个月以来经历的事。

#### 2. 主要功能

- 可以同时记录当天的室内、室外温度、天气情况
- 可以指定日记的类别：生活、学习、工作、运动、游戏、电影、大事、周报、文章、账单
- 列表中同日的日记只显示一个日期时间。
- 可以根据关键字搜索日记标题或内容。
- 菜单中可以根据日期、类别对日记进行筛选。
- 支持日记分享功能
- 适应设备的暗黑模式，自动切换黑白两个样式
- 所有日记统计信息
  > 编辑日记时，将分享的开关打开，保存日记后，在日记详情页的工具栏中会多出一个分享按钮，点击会复制这篇日记的共享链接，这个链接是公开的，任何人都可以通过链接查看此篇日记。
比如当前这篇日记的分享链接是：[https://kylebing.cn/diary/#/share/5587](https://kylebing.cn/diary/#/share/5587)

#### 3. 支持平台
支持 PC 和 移动端

#### 4. 暗黑模式支持
当电脑或手机处于暗黑模式时，会自动切换到暗黑主题色上

#### 5. 项目历史
我本来就是做前端的，2017 年的时候想学 iOS 了顺便做了个不太成熟的 iOS 版 app，当时日记是存储在 iCloud 中的，有了 app 的界面样子，但并不能很完美的使用。
后来过了很久，到 2019 年的时候感觉自己前端技术差不多了，就想把它实现了，最初使用的是 `HTML` + `jQuery`。
后来对 `Vue` 了解的足够多之后，就改成了 `HTML` + `Vue`。最初只有移动端的，后来添加了 PC 版界面。
再后来就大改了，改成了纯 Vue 模式，此时的PC版 和移动端还是在两个分支上的。
又过了好久，想把这两个版本整合到一起，最终还是想到办法把它实现了，也就是现在的版本。



## 二、安装使用
该项目包含两个部分：

> 前端：[https://github.com/KyleBing/diary-vue](https://github.com/KyleBing/diary-vue) `vue`

> 后台：[https://github.com/KyleBing/diary-portal](https://github.com/KyleBing/diary-portal) `nodejs`


## 三、开发说明
配置存储：
所有配置信息都保存在 `LocalStorage` 中
- `DiaryConfig`: 用户的配置信息（类别筛选，日期筛选，关键字）
- `DiaryAuthorization`: 用户信息（用户名，token，uid）

## 四、使用插件
- `vue3` 
- `vue-router` 
- `vuex` 
- `axios` 
- `qs` 
- `clipboard` 
- `@vuepic/vue-datepicker` 
- `moment`


## 五、支持
感谢 [JetBrains](https://www.jetbrains.com/?from=diary-vue@KyleBing) 提供的工具支持

![JetBrains](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg?_ga=2.54620846.401568951.1648434626-301403838.1648434626)


## 六、项目周期

`2017-09-27` ~ `2018.08.14` ~ `作者离世的那一天`
