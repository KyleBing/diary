
# 标题日记
2018.08.14 - 2022.03.05

> “ 用一句话概括你的一天 ”

在线试用地址： [https://kylebing.cn/diary](https://kylebing.cn/diary) 点击右下角体验账号登录即可


## 使用插件
`vue` `vue-router` `vuex` `vue-cookie` `Axios` `qs` `clipboard` `vue2-datepicker` `moment`


## 截图

![2021-09-01 17 26 25](https://user-images.githubusercontent.com/12215982/131647475-149d1c2a-bfad-4c9a-baf2-24ad48bfca32.png)

<img src="https://user-images.githubusercontent.com/12215982/158507431-a2d4f039-7aca-4cbb-a95a-525ba54ecd75.PNG" alt="login" width="400"/> <img src="https://user-images.githubusercontent.com/12215982/158507424-919432c7-d348-4ce8-9787-231be88abb11.PNG" alt="list-long-black" width="400"/> <img src="https://user-images.githubusercontent.com/12215982/158507428-a98c0e50-0648-409d-a1b1-c0ca98a861cd.PNG" alt="list-black" width="400"/>
<img src="https://user-images.githubusercontent.com/12215982/158507449-f259c295-f1e6-4ac9-9df5-d2d15c676b73.PNG" alt="list" width="400"/> <img src="https://user-images.githubusercontent.com/12215982/158507451-214f7258-26c4-4437-8059-c6054d164808.PNG" alt="list" width="400"/> <img src="https://user-images.githubusercontent.com/12215982/158507443-93df063b-f350-408f-a409-cbb59fa8f04f.PNG" alt="detail" width="400"/> 
 <img src="https://user-images.githubusercontent.com/12215982/158507433-98f84209-0a56-4c82-8d1c-5f6881c178ef.PNG" alt="menu" width="400"/> <img src="https://user-images.githubusercontent.com/12215982/158507436-6d0f06bd-d79c-4afe-b107-5ee5ae11fa33.PNG" alt="years" width="400"/>
<img src="https://user-images.githubusercontent.com/12215982/158507445-5ce1d2a2-1d45-4954-b628-cf13a998e830.PNG" alt="edit" width="400"/> <img src="https://user-images.githubusercontent.com/12215982/158507442-30b655db-7ced-44fb-80e0-de0c018fffa4.PNG" alt="category" width="400"/>  <img src="https://user-images.githubusercontent.com/12215982/158507439-81f27c14-872b-4a30-bae2-4d6274c6f955.PNG" alt="about" width="400"/>

---

## 项目介绍
《标题日记》是一款自己开发已久的日记 web 应用

也是自己一直以来想实现的这么个工具，从 2017 年开始，时至今日也还在不断的完善中。
之前是没有开源的，后台心想还是开源给更多人用吧，可能有需要用的。

#### 初衷
一天记录一条记录，一目了然的查看近一个月以来经历的事。

#### 主要功能
每天记录一句话，或添加大片的日记内容。
- 可以同时记录当天的室内、室外温度、天气情况
- 可以指定日记的类别：生活、学习、工作、运动、游戏、电影、大事、周报、文章
- 列表中同日的日记只显示一个日期时间。
- 可以根据关键字搜索日记标题或内容。
- 菜单中可以根据日期、类别对日记进行筛选。
- 支持日记分享功能
- 适应设备的暗黑模式，自动切换黑白两个样式
  > 编辑日记时，将分享的开关打开，保存日记后，在日记详情页的工具栏中会多出一个分享按钮，点击会复制这篇日记的共享链接，这个链接是公开的，任何人都可以通过链接查看此篇日记。
比如当前这篇日记的分享链接是：[https://kylebing.cn/diary/#/share/5312](https://kylebing.cn/diary/#/share/5312)

#### 支持平台
支持 PC 和 移动端

#### 暗黑模式支持
当电脑或手机处于暗黑模式时，会自动切换到暗黑主题色上

#### 项目历史
我本来就是做前端的，2017 年的时候想学 iOS 了顺便做了个不太成熟的 iOS 版 app，当时日记是存储在 iCloud 中的，有了 app 的界面样子，但并不能很完美的使用。
后来过了很久，到 2019 年的时候感觉自己前端技术差不多了，就想把它实现了，最初使用的是 `HTML` + `jQuery`。
后来对 `Vue` 了解的足够多之后，就改成了 `HTML` + `Vue`。最初只有移动端的，后来添加了 PC 版界面。
再后来就大改了，改成了纯 Vue 模式，此时的PC版 和移动端还是在两个分支上的。
又过了好久，想把这两个版本整合到一起，最终还是想到办法把它实现了，也就是现在的版本。

---

## 安装使用
该项目包含两个部分，前端和后台。
- 前端：[https://github.com/KyleBing/diary-vue](https://github.com/KyleBing/diary-vue) `vue`
- 后台：[https://github.com/KyleBing/diary-portal](https://github.com/KyleBing/diary-portal) `php`

### 1. 前端设置
1. 修改前端项目中 `utility.js` 的 `URL` 变量为后台的路径
2. `vue.config.js` 中设置了 build 后的项目文件路径为 `../diary`，可以根据自己需要修改
3. 注册界面中的邀请码对应后台 `config.php` 设置的邀请码

### 2. 后台设置
1. 数据库的结构在项目的根目录下 `diary.sql`

2. 修改 `./class/config.php` 中的变量。

    > `INVITATION` 是前端注册时使用的邀请码，只有对应上才能正常注册用户
    ```php
    define('HOST',          '127.0.0.1');       // 数据库地址
    define('PORT',          '3306');            // 数据库端口
    define('DATABASE',      'diary');           // 数据库名
    define('USER',          '----');            // 数据库用户名
    define('PASSWORD',      '----');            // 数据库密码
    define('INVITATION',    '----');            // 邀请码，注册用户时使用，
    ```
