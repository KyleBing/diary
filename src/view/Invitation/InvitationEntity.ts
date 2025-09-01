export interface InvitationEntity {
    id: string,
    date_create: string | Date,
    date_register: string | Date,
    binding_uid: number,
    is_shared: 0|1
}

