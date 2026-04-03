import defaultSystemConfig from "../../config/project_config.json"

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
    admin_email: defaultSystemConfig.admin_email,
    is_show_demo_account: defaultSystemConfig.is_show_demo_account,
    demo_account: defaultSystemConfig.demo_account,
    demo_account_password: defaultSystemConfig.demo_account_password,
    qiniu_img_base_url: defaultSystemConfig.qiniu_img_base_url,
    qiniu_bucket_name: defaultSystemConfig.qiniu_bucket_name,
    qiniu_style_suffix: defaultSystemConfig.qiniu_style_suffix,
    hefeng_weather_api_key: defaultSystemConfig.hefeng_weather_api_key,
    hefeng_weather_api_host: defaultSystemConfig.hefeng_weather_api_host,
    register_tip: defaultSystemConfig.register_tip
}
