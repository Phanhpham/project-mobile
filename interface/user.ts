export interface User{
    id : number;
    username: string;
    email:string;
    password: string;
    avatar:string;
    phone:string;
    gender:boolean;
    dob:string
}
export interface UserRequest extends Omit<User,"id">{
  
}
export interface LoginUser extends Omit<User,"id" | "username" | "avatar" | "phone" |"gender" | "dob">{
    
}