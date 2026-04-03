import {defineStore} from "pinia"

import systemConfigApi from "@/api/systemConfigApi"
import {DEFAULT_SYSTEM_CONFIG, SystemConfig} from "@/entity/SystemConfig"

function parseBoolean(value: unknown) {
    return value === true || value === 1 || value === '1' || value === 'true'
}

function normalizeSystemConfig(rawConfig: Partial<SystemConfig> = {}): SystemConfig {
    return {
        admin_email: String(rawConfig.admin_email || '').trim(),
        is_show_demo_account: parseBoolean(rawConfig.is_show_demo_account),
        demo_account: String(rawConfig.demo_account || '').trim(),
        demo_account_password: String(rawConfig.demo_account_password || ''),
        qiniu_img_base_url: String(rawConfig.qiniu_img_base_url || '').trim(),
        qiniu_bucket_name: String(rawConfig.qiniu_bucket_name || '').trim(),
        qiniu_style_suffix: String(rawConfig.qiniu_style_suffix || '').trim(),
        hefeng_weather_api_key: String(rawConfig.hefeng_weather_api_key || '').trim(),
        hefeng_weather_api_host: String(rawConfig.hefeng_weather_api_host || '').trim(),
        register_tip: String(rawConfig.register_tip || '').trim()
    }
}

export const useSystemConfigStore = defineStore('systemConfigStore', {
    state: () => ({
        config: {...DEFAULT_SYSTEM_CONFIG} as SystemConfig,
        isLoaded: false,
        isLoading: false
    }),
    actions: {
        APPLY_CONFIG(config: Partial<SystemConfig>) {
            this.config = normalizeSystemConfig({
                ...this.config,
                ...config
            })
            this.isLoaded = true
        },
        async fetchConfig(force = false) {
            if (this.isLoading) {
                return this.config
            }
            if (this.isLoaded && !force) {
                return this.config
            }

            this.isLoading = true
            try {
                const res = await systemConfigApi.get()
                this.APPLY_CONFIG(res.data)
                return this.config
            } finally {
                this.isLoading = false
            }
        },
        async saveConfig(payload: Partial<SystemConfig>) {
            const requestData = normalizeSystemConfig({
                ...this.config,
                ...payload
            })
            const res = await systemConfigApi.save(requestData)
            this.APPLY_CONFIG(res.data)
            return res
        }
    }
})
