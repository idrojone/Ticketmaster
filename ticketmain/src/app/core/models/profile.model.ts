export interface Profile {
    public_id: string;
    username: string;
    bio: string;
    image: string;
    // following: boolean;
    followingUsers: string[];
}