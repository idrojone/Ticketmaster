import { Profile } from "src/app/pages/profile/profile";

export interface Comment {

    id:number;
    body: string;
    createdAt: String;
    author:Profile;

}