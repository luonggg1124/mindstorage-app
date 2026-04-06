
export enum UserGender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}
export interface IUser {
    id: number;
    username: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    verified: boolean;
    gender: UserGender | null;
    hobbies: string | null;
    createdAt: string;
    updatedAt: string;
}