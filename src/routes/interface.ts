export interface UserInt { 
    id?: number;
    fullname: string; 
    email: string
    gender: string; 
    phone: string; 
    address: string; 
    notes: string; 
}
// interface ErrorInt { 
//     success:boolean
//     status:number;
//     message: string; 
//     data: object;
// }

 

 export interface UserObject{
    [key: string]: string | any
  }
  
//   export interface Customer{  
//     id?: number;
//     fullname: string; 
//     email: string
//     gender: string; 
//     phone: string; 
//     address: string; 
//     notes: string;  
// }

export interface User{
    id: number;
    username: string;
    email: string;
    password: string
    authData: any
    token: string,
    jwt: string,
    hash: any,
    err: any
}