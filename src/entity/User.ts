interface UserEntity {
    name: string,
    name_en: string,
    color: string,
}

interface UserRegisterEntity {
    nickname: string,
    invitationCode: string,
    email: string,
    password: string,
}

interface UserProfileEntity{
    nickname: string,
    phone: string,
    avatar: string,
    city: string,
    geolocation: string,
}


export {
    type UserEntity,
    type UserRegisterEntity,
    type UserProfileEntity
}
