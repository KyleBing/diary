export default {
    adminEmail: 'kylebing@163.com', // 网站管理员邮箱帐号，用于向其申请注册邀请码

    // 七牛云
    // 地址： https://portal.qiniu.com/kodo/overview
    QiniuImgBaseURL: 'https://diary-container.kylebing.cn/', // 空间域名，最后面带 `/`
    QiniuBucketName: 'diary-container', // 七牛云对象存储空间的名称
    QiniuStyleSuffix: 'thumbnail_600px', // 七牛云图片样式后缀，缩放图片尺寸

    // 和风天气开发 key
    // 地址：https://console.qweather.com/
    HefengWeatherKey: 'c5894aea6ce2495ca0f78a2963c04d57',


    // 注册说明 HTML 格式
    registerTip: `
            <h3>暂不开放注册</h3>
            <p>如果你试用过之后感觉这个日记体验不错，能在你的生活中有所帮助，并想长期使用，请发邮件到此邮箱免费获取： <a href="mailto:kylebing@163.com">kylebing@163.com</a></p> 
            <p>否则，请勿打扰</p>
            `
}
