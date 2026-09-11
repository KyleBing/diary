/** 与 portal `entity/User` 中 `EnumUserGroup.ADMIN` 一致 */
export const USER_GROUP_ADMIN = 1

export interface AuthorizationEntity{
    nickname: string
    uid: number
    email: string
    phone: string
    avatar: string
    token: string // JWT（登录接口 data.token）
    group_id: number
    city: string
    geolocation: string
}
