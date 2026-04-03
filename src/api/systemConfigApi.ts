import request from "@/request"
import {SystemConfig} from "@/entity/SystemConfig"

export interface SystemConfigResponse {
    success: boolean
    message: string
    data: SystemConfig
}

export default {
    get(): Promise<SystemConfigResponse> {
        return request('get', null, null, 'system-config') as Promise<SystemConfigResponse>
    },
    save(requestData: SystemConfig): Promise<SystemConfigResponse> {
        return request('put', null, requestData, 'system-config') as Promise<SystemConfigResponse>
    }
}
