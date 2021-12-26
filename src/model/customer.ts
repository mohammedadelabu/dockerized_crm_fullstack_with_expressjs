import fs from "fs";
import path from 'path'
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

let pathOut=path.join(__dirname,'../../data/login.json')
let pathOutcust=path.join(__dirname,'../../data/customer.json')

const saltRounds = 10;


export function readData() {
    let data=fs.readFileSync(pathOutcust,{encoding:'utf-8'})
    return data
}

export function validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
// console.log(validateEmail("m2hasmond@gmail.com"))

export function checkDublicate(email:any) {
    let response=false
   let data= JSON.parse(readData())
    let dubData=data.find((customer:any)=> customer.email == email)
    // console.log(dubData); 
    if(dubData){
        console.log(dubData.email); 
        response=true
    }
    return response
}



export function register(name:string, email:string, password:string ){
    let id = uuidv4()
    password= bcrypt.hashSync(password, saltRounds);
    let data={id, name, email, password}
    //console.log(data);
    let dataNow=fs.readFileSync(pathOut,{encoding:'utf-8'})
    if (!dataNow) {
        fs.writeFileSync(pathOut, JSON.stringify([data], null ,3))
    }else if(dataNow){
        let checkDub=JSON.parse(dataNow).find((db:any)=>db.email==email)
        console.log(checkDub);
        if (checkDub) {
            return false
        }
        if (dataNow) {
            let dataParsed=JSON.parse(dataNow)
            dataParsed.push(data)
            fs.writeFileSync(pathOut, JSON.stringify(dataParsed, null ,3))
        }

    }
    return true
}

export function login(email:string,password:string) {
    let data= fs.readFileSync(pathOut,{encoding:'utf-8'})
    let foundData=JSON.parse(data).find((a:any)=>a.email==email)
    let response="No account found"
    if (foundData) {
        console.log('found');
        if (bcrypt.compareSync(password, foundData['password'])) {
            response='correct password'  
        } else{
            response='password incorrect'
        }  
    }
    return response
    
}




// console.log(register('ursula','sula@gmail.com','1234'));


// console.log(checkDublicate('john@example.com'))
