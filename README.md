
# 标题日记


> “ 用一句话概括你的一天 ”

在线试用地址： [https://kylebing.cn/diary](https://kylebing.cn/diary) 点击右下角体验账号登录即可


## 使用插件
`vue` `vue-router` `vuex` `Axios` `qs` `clipboard` `vue2-datepicker` `moment`


## 截图

PC 

![2021-09-01 17 26 25](https://user-images.githubusercontent.com/12215982/131647475-149d1c2a-bfad-4c9a-baf2-24ad48bfca32.png)
![2022-05-11 105631](https://user-images.githubusercontent.com/12215982/167760064-6fa7b2ba-e165-4062-85b7-817a9bd250b0.png)


移动端

<img src="https://user-images.githubusercontent.com/12215982/158507431-a2d4f039-7aca-4cbb-a95a-525ba54ecd75.PNG" alt="login" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/158507424-919432c7-d348-4ce8-9787-231be88abb11.PNG" alt="list-long-black" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/158507428-a98c0e50-0648-409d-a1b1-c0ca98a861cd.PNG" alt="list-black" width="240"/>
<img src="https://user-images.githubusercontent.com/12215982/158507449-f259c295-f1e6-4ac9-9df5-d2d15c676b73.PNG" alt="list" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/158507451-214f7258-26c4-4437-8059-c6054d164808.PNG" alt="list" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/158507443-93df063b-f350-408f-a409-cbb59fa8f04f.PNG" alt="detail" width="240"/> 
 <img src="https://user-images.githubusercontent.com/12215982/158507433-98f84209-0a56-4c82-8d1c-5f6881c178ef.PNG" alt="menu" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/158507436-6d0f06bd-d79c-4afe-b107-5ee5ae11fa33.PNG" alt="years" width="240"/>
<img src="https://user-images.githubusercontent.com/12215982/158507445-5ce1d2a2-1d45-4954-b628-cf13a998e830.PNG" alt="edit" width="240"/> <img src="https://user-images.githubusercontent.com/12215982/158507442-30b655db-7ced-44fb-80e0-de0c018fffa4.PNG" alt="category" width="240"/>  <img src="https://user-images.githubusercontent.com/12215982/158507439-81f27c14-872b-4a30-bae2-4d6274c6f955.PNG" alt="about" width="240"/>

---

## 一、项目介绍
《标题日记》是一款自己开发已久的日记 web 应用

也是自己一直以来想实现的这么个工具，从 2017 年开始，时至今日也还在不断的完善中。
之前是没有开源的，后台心想还是开源给更多人用吧，可能有需要用的。

#### 1. 初衷
一天记录一条记录，一目了然的查看近一个月以来经历的事。

#### 2. 主要功能
每天记录一句话，或添加大片的日记内容。
- 可以同时记录当天的室内、室外温度、天气情况
- 可以指定日记的类别：生活、学习、工作、运动、游戏、电影、大事、周报、文章
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
该项目包含两个部分，前端和后台。
- 前端：[https://github.com/KyleBing/diary-vue](https://github.com/KyleBing/diary-vue) `vue`
- 后台：[https://github.com/KyleBing/diary-portal-node](https://github.com/KyleBing/diary-portal-node) `nodejs`


## 三、开发说明
配置存储：
所有配置信息都保存在 LocalStorage 中
- `DiaryConfig`: 用户的配置信息（类别筛选，日期筛选，关键字）
- `DiaryAuthorization`: 用户信息（用户名，token，uid）


## 四、支持
感谢 [JetBrains](https://www.jetbrains.com/?from=diary-vue@KyleBing) 提供的工具支持

![JetBrains](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg?_ga=2.54620846.401568951.1648434626-301403838.1648434626)


## 五、项目周期

> `2018.08.14` 至 `作者逝世`
