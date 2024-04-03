export interface LoginData {
  idUser: number;
  fullName: string;
  email: string;
  username: string;
  password: string;
  exp: number;
  iat: number;
  sub: string;
  authorities: Array<Authorities>;
  profiles: Array<Profile>;
}

export interface Profile {
  id: number;
  code: string;
  name: string;
}

export interface Authorities {
  authority: string;
}
