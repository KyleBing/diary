export interface UserConfig {
    uid: number
    theme: string
    default_diary_category: string
    editor_mode: string
    config_json: UserConfigJson
    date_modify: string | null
}

export interface UserConfigJson {
    isHideCompletedTodos?: boolean
    [key: string]: unknown
}

export interface UserConfigPayload {
    theme?: string
    default_diary_category?: string
    editor_mode?: string
    config_json?: UserConfigJson
}
