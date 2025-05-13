export default {
    adminEmail: 'xxx@163.com', // 网站管理员邮箱账号，网站遇到错误时会显示这个邮箱账号
    isShowDemoAccount: true, // 是否显示登录页右下角的 “演示账户”

    // 演示账户
    demoAccount : "test@163.com",
    demoAccountPassword : "test",

    // 七牛云
    // 地址： https://portal.qiniu.com/kodo/overview
    QiniuImgBaseURL: '', // 空间域名，最后面带 `/`
    QiniuBucketName: '', // 七牛云对象存储空间的名称
    QiniuStyleSuffix: '', // 七牛云图片样式后缀，缩放图片尺寸

    // 和风天气开发 key
    // 官网地址：https://console.qweather.com/
    // API文档：https://dev.qweather.com/docs/api/weather/
    HefengWeatherKey: '',

    // 注册说明： HTML格式
    registerTip: `
            <p>长期未使用的用户将定期进行清理，大概一年清一次。</p>
            <p>项目已开源 <a href="https://github.com/KyleBing/diary">github: Diary</a></p>
        `
}
