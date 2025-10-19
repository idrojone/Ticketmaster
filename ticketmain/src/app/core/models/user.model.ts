export interface User {
    _id?: string;
    public_id?: string;
    email: string;
    token: string;
    username: string;
    password?: string;
    bio: string;
    image: string;
    favouriteConciertos?: string[];
    followingUsers?: string[];
}