export interface User {
    public_id?: string;
    email: string;
    token: string;
    username: string;
    password?: string;
    bio: string;
    image: string;
    favouriteConciertos?: string[];
    followeredUsers?: string[];
}