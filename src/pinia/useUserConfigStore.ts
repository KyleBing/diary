import {defineStore} from "pinia"
import userConfigApi from "@/api/userConfigApi"
import {UserConfig, UserConfigJson} from "@/entity/UserConfig"

// 用户配置的安全默认值，避免接口返回字段缺失时组件读取到 undefined。
const DEFAULT_USER_CONFIG: UserConfig = {
    uid: 0,
    theme: '',
    default_diary_category: '',
    editor_mode: '',
    config_json: {},
    date_modify: null,
}

// 后端可能返回 null、字符串等异常值，这里统一兜底为对象配置。
function normalizeConfigJson(value: unknown): UserConfigJson {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as UserConfigJson
    }
    return {}
}

export const useUserConfigStore = defineStore('userConfigStore', {
    state: () => ({
        config: {...DEFAULT_USER_CONFIG} as UserConfig,
        // 标记是否已拉取，避免同一页面生命周期内重复请求。
        isFetched: false,
        // 保存中状态供页面禁用按钮或展示 loading。
        isSaving: false,
    }),
    getters: {
        isHideCompletedTodos(state): boolean {
            return state.config.config_json.isHideCompletedTodos === true
        },
    },
    actions: {
        APPLY_CONFIG(config: UserConfig) {
            // 接口配置覆盖默认值，并单独规范化可扩展的 config_json 字段。
            this.config = {
                ...DEFAULT_USER_CONFIG,
                ...config,
                config_json: normalizeConfigJson(config.config_json),
            }
            this.isFetched = true
        },
        async fetchConfig(force = false) {
            if (this.isFetched && !force) {
                return this.config
            }
            const res = await userConfigApi.get()
            this.APPLY_CONFIG(res.data)
            return this.config
        },
        async saveConfigJson(configJson: Partial<UserConfigJson>) {
            this.isSaving = true
            // 只合并本次修改的配置项，保留已有的用户配置。
            const nextConfigJson = {
                ...this.config.config_json,
                ...configJson,
            }
            try {
                const res = await userConfigApi.save({config_json: nextConfigJson})
                this.APPLY_CONFIG(res.data)
                return this.config
            } finally {
                this.isSaving = false
            }
        },
    },
})
