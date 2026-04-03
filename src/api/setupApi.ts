import request from "@/request"

export interface SetupStatusResponse {
    success: boolean
    message: string
    data: {
        isInitialized: boolean
        lockFileName: string
        configFiles: string[]
        restartTips: string[]
        config: null | {
            databaseConfig: {
                host: string
                user: string
                password: string
                port: number
                multipleStatements?: boolean
                timezone: string
            }
            projectConfig: {
                invitation_code: string
                year_data_start: number
                qiniu_access_key: string
                qiniu_secret_key: string
            }
        }
    }
}

export default {
    status(): Promise<SetupStatusResponse> {
        return request('get', null, null, 'setup/status')
    },
    saveConfig(requestData: {
        databaseConfig: {
            host: string
            user: string
            password: string
            port: number
            multipleStatements?: boolean
            timezone: string
        }
        projectConfig: {
            invitation_code: string
            year_data_start: number
            qiniu_access_key: string
            qiniu_secret_key: string
        }
    }) {
        return request('post', null, requestData, 'setup/config')
    },
    init() {
        return request('post', null, null, 'setup/init', 120000)
    }
}
