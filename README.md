<img width="120px" alt="project_logo" src="https://user-images.githubusercontent.com/12215982/225367174-f967aa05-5f35-474e-8ae2-0ea0619bd5d8.svg"/>

# 标题日记

一个纯文本 web 日记应用，专注记录生活琐事。  
[http://kylebing.cn/diary](http://kylebing.cn/diary)



## 一、界面

<img width="2032" alt="list-diary" src="https://github.com/user-attachments/assets/4c3efa8f-322c-41ae-bb0d-0b20c6143bea">


## 二、日记的使用

### 1. 推荐使用方式

**标题**：20 字以内，概括  
**内容**：事件详情

记录一天中你感觉值得记录的事，生活、学习、工作、运动 等等方面。  
记下此刻，记下你怕忘的内容，日后好查找。

### 2. 主要特性

- 纯文本为主
- 支持 Markdown __*不提供图片存储服务，图床自行解决*__
- 关键字搜索 标题、内容
- 日期、类别筛选日记
- 自动设置**当天**天气、室外环境温度 __*需要资料里提前设置好地址*__
- 分享某篇日记  
  > 比如当前这篇日记的分享链接是：  
  > [http://kylebing.cn/diary/#/share/6766](http://kylebing.cn/diary/#/share/6766)  
  > 这是我非常喜欢的一种使用方式：作为其它独立页面的数据源使用。  
  > 比如：[iPhone参数](http://kylebing.cn/tools/iphone/) 中的 `赞赏列表` 就是从日记中获取的数据，可以实时更新。
- 适配暗黑模式
- 日记统计：类别统计、账单统计、温湿度变化曲线
- 日记完整导出 `json`, `txt`, `json`, `csv`
- 账单（严格按指定格式书写）
  - 选择 `账单` 类别
  - 标题无所谓
  - 内容为账单条目
  - 格式
    ```bash
    条目[空格][+-]花费
    # 如
    早餐 -3
    午餐 -45
    生活-电费 -100
    话费 -100
    ```
    > 我一般每周整理一次账单  
    为了方便整理，建议你统一支付出口，只用一个作为主要支付手段：支付宝、微信，这样在统计的时候好统计，不然还需要去多个地方统计。
- 当你把某篇日记设置成共享模式后，这条数据可以被公开访问，作为小的数据池也挺好。比如：[http://kylebing.cn/portal/diary/detail?diaryId=6766](http://kylebing.cn/portal/diary/detail?diaryId=6766)

### 3. 适配电脑、手机

浏览器访问，电脑、移动端 都能完美显示。  
iPhone Safari 中选择 <kbd>添加到主屏幕</kbd> 会添加一个类似 app 的入口到桌面。

### 4. 文本编辑时支持 `JetBrains` 相关快捷键


| 快捷键                               | 功能                                 |
|-----------------------------------|------------------------------------|
| <kbd>CTRL</kbd>+ <kbd>D </kbd>    | 复制当前行。                             |
| <kbd>Tab</kbd>                    | 在前面插入 4 个空格。                       |
| <kbd>Shift</kbd> + <kbd>Tab</kbd> | 删除行前的空格，多于4个，一次性删除4个，小于四个，清除前面的空格。 |
| <kbd>CTRL</kbd>+ <kbd>← </kbd>    | 移动到行最左端                            |
| <kbd>CTRL</kbd>+ <kbd>→ </kbd>    | 移动到行最右端                            |




## 三、项目历程

1. 2017 年的时候学 iOS 顺便做了个不太成熟的 iOS 版 app，当时日记是存储在 `iCloud` 中，有了 app 的界面样子，但并不能很完美的使用。
2. 后来到 2019 年的时候感觉自己前端技术差不多了，就想以前端的方式实现它，最初用的是 `HTML` + `jQuery`。
3. 之后对 `Vue` 了解的足够多之后，就改成了 `HTML` + `Vue`。最初只有移动端的，添加了 PC 版界面。
4. 再后来就大改了，改成了纯 `Vue` 模式，此时的 PC 版和移动端还是在两个分支上。
5. 又过了好久，总算把移动端和 PC 两个版本融合到了一起。
6. 2024年1月，改写成 `vite` + `ts` 版本


## 四、项目周期

`2017-09-27` ~ `现在`

这是自己最喜欢、使用频率最高的项目，所以只要我还健在，这个项目就会被一直维护下去。

--- 

# 部署自己的日记系统

## 一、部署自己的日记系统
前后端完全开源，你可以部署一套自己的日记系统。

该项目包含两个部分：

- 前端：[https://github.com/KyleBing/diary-vue](https://github.com/KyleBing/diary-vue) `vue3`、`ts`、`vite`  `v9.20`
- 后台：[https://github.com/KyleBing/portal](https://github.com/KyleBing/portal) `nodejs` `v9.20`
> 具体的部署方式在各个项目中都有介绍


> **`http` `https` 不同部署环境对功能的影响**  
> - 编辑页面中，内容输入区在 <kbd>ctrl</kbd> + <kbd>x</kbd> 的时候无法将内容放置到剪贴板上。
> - 整个程序在打开的时候无法以 `ServiceWorker` 的形式快速载入，只有完整的从服务器再次载入。
> - `ServiceWorker` 和  `navigator.clipboard` 只在环境是 `https` 或 `localhost` 的时候生效。


## 二、邀请码

新用户注册需要邀请码，邀请码分为两种：  
- **万能的**：在后台系统的配置文件中配置
- **一次性**：一人一码

1. 登入系统后，点开菜单，选择邀请码菜单（用户默认注册后的 `group_id` 为 `2`，只有用户 `group_id` 为 `1` 的用户才能看到，需要手动去数据库中指定管理员账户），可以生成新的邀请码，点击邀请码就可以复制内容，分享给别人就可以了。
2. 邀请码页面中显示的是都是未注册的码，复制后邀请码变为绿色，表示已被分享还未使用。
3. 已使用的将会隐藏，不再显示在列表中。

> 目前初始化的过程还不是很好，还是代码层面的，所以先手动修改数据吧


## 三、项目配置

### 1. 图片存储配置 `[选配]`
> 如若不配置：只是不能显示用户头像而已  
头像文件是存储到 [七牛云](https://www.qiniu.com/) 上的，免费注册会有免费额度，够用。  
需要修改 `/config/projectConfig.json` 文件内容，改成你的七牛云配置。

```json
  "QiniuImgBaseURL": "", // 空间域名，最后面带 `/`
  "QiniuBucketName": "", // 七牛云对象存储空间的名称
  "QiniuStyleSuffix": "", // 七牛云图片样式后缀，缩放图片尺寸
```

### 2. 和风天气配置 `[选配]`
> 如若不配置：只是不能自动获取当地天气和温度而已  
用于从 [和风天气](https://www.qweather.com/) 中获取地域的天气和温度信息，也是在 `/config/projectConfig.json` 文件中

```json
  // 和风天气开发 key
  // 官网地址：https://console.qweather.com/
  // API文档：https://dev.qweather.com/docs/api/weather/
  "HefengWeatherKey": "",
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

## 四、开发说明

所有配置信息都保存在 `LocalStorage` 中
- `DiaryConfig`: 用户的配置信息
  - 类别筛选
  - 日期筛选
  - 关键字
- `Authorization`: 用户信息
  - `avatar`
  - `city`
  - `email`
  - `geolocation`
  - `group_id`
  - `nickname`
  - `phone`
  - `token`
  - `uid`

## 五、用到的 npm 包

- `vue3`、`ts`、`vite` 
- `axios` 数据请求
- `clipboard` 剪贴板
- `moment` 时间处理
- `v-calendar` 日期选择
- `marked` MarkDown 渲染
- `echarts` 图表
- `floating-vue` 悬窗
- `qiniu-js` 七牛云相关文件
- `js-base64` base64 处理
- `js-yaml` 转换 yaml to js


---

# 支持

感谢 [JetBrains](https://www.jetbrains.com/?from=diary-vue@KyleBing) 提供的工具支持

![JetBrains](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg?_ga=2.54620846.401568951.1648434626-301403838.1648434626)

---

# 界面截图 - 详细

<img width="2032" alt="login" src="https://github.com/user-attachments/assets/234429c0-4d86-4969-ac8f-60013a1e970a">
<img width="2032" alt="list-diary" src="https://github.com/user-attachments/assets/4c3efa8f-322c-41ae-bb0d-0b20c6143bea">
<img width="2032" alt="detail" src="https://github.com/user-attachments/assets/e702f377-fd4f-4b15-ae88-17b9971b8bd3">
<img width="2032" alt="todo-list" src="https://github.com/user-attachments/assets/5064f46f-c0ee-4e80-bb50-b04d7a6c516a">
<img width="2032" alt="diary-filter" src="https://github.com/user-attachments/assets/52a64cf6-512f-4338-bd3f-de208652b996">
<img width="2032" alt="bill" src="https://github.com/user-attachments/assets/c1ba8b28-a201-422e-bcda-063aa506f852">
<img width="2032" alt="bill-filter" src="https://github.com/user-attachments/assets/3511c0aa-85e0-4df0-84ed-a0f8960ecc26">
<img width="2032" alt="function" src="https://github.com/user-attachments/assets/f315c3e8-5498-4cd4-afd1-1a6deb3910c8">
<img width="2032" alt="statistic" src="https://github.com/user-attachments/assets/3bb1e1e8-8d5b-4253-bd5c-29e33ca3b763">
