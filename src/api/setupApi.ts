import request from "@/request"

export interface SetupStatusResponse {
    success: boolean
    message: string
    data: {
        isInitialized: boolean
        hasRegisteredUsers: boolean
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
    }) {
        return request('post', null, requestData, 'setup/config')
    },
    init() {
        return request('post', null, null, 'setup/init', 120000)
    }
}
