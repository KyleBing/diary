import request from "@/request"
import {AdminSystemConfig, PublicSystemConfig} from "@/entity/SystemConfig"

export interface PublicSystemConfigResponse {
    success: boolean
    message: string
    data: PublicSystemConfig
}

export interface AdminSystemConfigResponse {
    success: boolean
    message: string
    data: AdminSystemConfig
}

export default {
    get(): Promise<PublicSystemConfigResponse> {
        return request('get', null, null, 'system-config') as Promise<PublicSystemConfigResponse>
    },
    getAdmin(): Promise<AdminSystemConfigResponse> {
        return request('get', null, null, 'system-config/admin') as Promise<AdminSystemConfigResponse>
    },
    save(requestData: AdminSystemConfig): Promise<AdminSystemConfigResponse> {
        return request('put', null, requestData, 'system-config') as Promise<AdminSystemConfigResponse>
    }
}
