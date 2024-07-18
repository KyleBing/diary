export default {
    adminEmail: 'kylebing@163.com', // 网站管理员邮箱账号，网站遇到错误时会显示这个邮箱账号
    isShowDemoAccount: false, // 是否显示登录页右下角的 “演示账户”

    // 演示账户
    demoAccount : "test@163.com",
    demoAccountPassword : "test",

    // 七牛云
    // 地址： https://portal.qiniu.com/kodo/overview
    QiniuImgBaseURL: 'https://diary-container.kylebing.cn/', // 空间域名，最后面带 `/`
    QiniuBucketName: 'diary-container', // 七牛云对象存储空间的名称
    QiniuStyleSuffix: 'thumbnail_600px', // 七牛云图片样式后缀，缩放图片尺寸

    // 和风天气开发 key
    // 官网地址：https://console.qweather.com/
    // API文档：https://dev.qweather.com/docs/api/weather/
    HefengWeatherKey: 'c5894aea6ce2495ca0f78a2963c04d57',

    // 注册说明： HTML格式
    registerTip: `
            <h3>暂不开放注册</h3>
            <hr>
            <p>如果你有开发能力，可以自己部署一套自己的日记系统。</p>
            <p>已开源 <a href="https://github.com/KyleBing/diary">Github: Diary</a></p>
        `
}

