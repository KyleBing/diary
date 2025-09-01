export interface UserEntity {
    name: string,
    name_en: string,
    color: string,
}

export interface UserRegisterEntity {
    nickname: string,
    invitationCode: string,
    email: string,
    password: string,
}

export interface UserProfileEntity{
    nickname: string,
    phone: string,
    avatar: string,
    city: string,
    geolocation: string,
}


