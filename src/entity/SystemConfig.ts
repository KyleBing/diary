export interface PublicSystemConfig {
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

export interface AdminSystemConfig extends PublicSystemConfig {
    invitation_code: string
    qiniu_access_key: string
    qiniu_secret_key: string
}

export const DEFAULT_SYSTEM_CONFIG: PublicSystemConfig = {
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

export const DEFAULT_ADMIN_SYSTEM_CONFIG: AdminSystemConfig = {
    ...DEFAULT_SYSTEM_CONFIG,
    invitation_code: "",
    qiniu_access_key: "",
    qiniu_secret_key: ""
}
