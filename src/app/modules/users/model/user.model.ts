export interface UserModel {
    id: number;
    name: string;
    lastName: string;
    email: string;
    cellphone: string;
    username?: string;
    pass: string;
    mailingAdd?: string;
    profileId: number;
    profileCode?: string;
    profileName?: string;
}

export interface ChangePasswordModel {
    id: number;
    password: string;
}

