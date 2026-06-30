import request from "@/request"
import {UserConfig, UserConfigPayload} from "@/entity/UserConfig"

export interface UserConfigResponse {
    success: boolean
    message: string
    data: UserConfig
}

export default {
    get(): Promise<UserConfigResponse> {
        return request('get', null, null, 'user-config') as Promise<UserConfigResponse>
    },
    save(requestData: UserConfigPayload): Promise<UserConfigResponse> {
        return request('put', null, requestData, 'user-config') as Promise<UserConfigResponse>
    }
}
