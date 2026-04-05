export interface SystemConfig {
    admin_email: string
    is_show_demo_account: boolean
    demo_account: string
    demo_account_password: string
    qiniu_img_base_url: string
    qiniu_bucket_name: string
    qiniu_style_suffix: string
    hefeng_weather_api_key: string
    hefeng_weather_api_host: string
    register_tip: string
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
    admin_email: "xxx@163.com",
    is_show_demo_account: false,
    demo_account: "test@163.com",
    demo_account_password: "test",
    qiniu_img_base_url: "",
    qiniu_bucket_name: "",
    qiniu_style_suffix: "",
    hefeng_weather_api_key: "",
    hefeng_weather_api_host: "",
    register_tip:
        "<p>长期未使用的用户将定期进行清理，大概一年清一次。</p>"
}
