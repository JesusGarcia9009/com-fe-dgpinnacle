export interface LoginResponseModel {
    idUsuario: string;
    nombre: string;
    token: string;
    profile: string;
    nombrePaterno: string;
    nombreMaterno: string;
    email: string;
}

export interface LoginRequestModel {
    username: string;
    password: string;
}

