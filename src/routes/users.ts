import express, { Request, Response,NextFunction } from 'express';
const router = express.Router();
import fsPromises from 'fs';
import { UserInt, UserObject, User } from './interface'
import {readData,validateEmail,checkDublicate,register,login} from '../model/customer'
import jwt from 'jsonwebtoken';


function verifyToken(req: any, res: Response, next: NextFunction) {
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
      const bearerToken = bearerHeader.split(' ')[1]
      req.token = bearerToken
      next()
  } else {
      res.sendStatus(403) //forbidden
  }
}


// Get all customer
router.get('/customer', verifyToken, (req: any, res: Response, next: NextFunction)=>{
  
  jwt.verify(req.token,'mysecret',async(err:any,data:any)=>{
    if (err) {
      res.sendStatus(403)
    }else{
  
  let data=readData()
  let dataParsed=JSON.parse(data)
  res.status(200).json(dataParsed)
  }
})
})
  

// Get single customer
router.get('/customer/:id', verifyToken, (req: any, res: Response, next: NextFunction) => {

  jwt.verify(req.token,'mysecret',async(err:any,data:any)=>{
    if (err) {
      res.sendStatus(403)
    }else{
  let data=readData()
  let dataParsed=JSON.parse(data)
 const index = dataParsed.find((customer:UserObject)=> customer.id === parseInt(req.params.id));
 if(!index) res.status(404).send("Customer not found")
   res.status(200).json(index)
    }
  })
})

// Create new customer
router.post('/customer', verifyToken, async (req: any, res: Response, next: NextFunction)=>{

  jwt.verify(req.token,'mysecret',async(err:any,data:any)=>{
    if (err) {
      res.sendStatus(403)
    }else{
  let data=readData()
  let dataParsed=JSON.parse(data)
 let isValid= validateEmail(req.body.email)

  if(!isValid){
    return res.status(400).send({response:'invalid email',data:req.body.email})
  } 

  const emailDuplicate = checkDublicate(req.body.email)
  if(emailDuplicate){
    return res.status(400).send({response: 'account already exist', data: req.body.email})
  }
  
  const postdata: UserInt = {
    id: dataParsed[dataParsed.length-1]['id'] + 1,
    fullname: req.body.fullname,
    email: req.body.email,
    gender: req.body.gender,
    phone: req.body.phone,
    address: req.body.address,
    notes: req.body.notes
  }
  dataParsed.push(postdata)
  await fsPromises.writeFile('./data/customer.json', JSON.stringify(dataParsed, null, 3),
  (err:any)=>{
     if(err) throw err;
  })
  // res.status(201).send(postdata)
  res.status(201).json({status:"success",data:postdata})
}
})
})






/* GET users listing. */
router.post('/register', function(req: Request, res: Response, next: NextFunction) {
  let regStatus=register(req.body.name,req.body.email,req.body.password)
  if (regStatus) {
      res.status(200).send({response:'signup successful'})
  }
  else{
    res.status(400).send({response:'Account exist'})
  }
})

router.post('/login', async function(req:Request, res:Response, next:NextFunction){
    console.log(req.body.email);
    let response= login(req.body.email, req.body.password)
    let email=req.body.email
    if (response=='correct password') {
     jwt.sign({email},'mysecret',(err:any,token:any)=>{
        res.json({response,token});
      })
    }else{
      res.json({response});
    }
})



// Update Customers
router.put('/customer/:id', verifyToken, async(req: any, res: Response, next: NextFunction)=>{

    jwt.verify(req.token,'mysecret',async(err:any,data:any)=>{
      if (err) {
        res.sendStatus(403)
      }else{
        
          let data=readData()
          let dataParsed=JSON.parse(data)
        
        const body: UserInt = {
          fullname: req.body.fullname,
          email: req.body.email,
          gender: req.body.gender,
          phone: req.body.phone,
          address: req.body.address,
          notes: req.body.notes
        }  
          let customerMatch = dataParsed.find((user:UserObject)=>user.id == req.params.id);
        
          customerMatch.fullname = body.fullname || customerMatch.fullname;
          customerMatch.email = body.email || customerMatch.email;
          customerMatch.gender = body.gender || customerMatch.gender;
          customerMatch.phone = body.phone || customerMatch.phone;
          customerMatch.address = body.address || customerMatch.address;
          customerMatch.notes = body.notes || customerMatch.notes;
           
          fsPromises.writeFile('./data/customer.json', JSON.stringify(dataParsed, null, 3), (error:any)=>{
              if(error) throw error;
            })  
            res.status(201).json({status:"success",data:dataParsed})

      }
    })
  

})


// Delete
router.delete('/customer/:id',verifyToken, (req: any, res: Response) =>{
  jwt.verify(req.token,'mysecret',async(err:any,data:any)=>{
    if (err) {
      res.sendStatus(403)
    }else{
      let data=readData()
      let dataParsed=JSON.parse(data)
      const index = dataParsed.find((cv:UserObject)=>cv.id === parseInt(req.params.id));
      if(!index){
       res.status(404).send("Customer not found")
     }else{
       dataParsed = dataParsed.filter((data:UserObject)=>data.id !== +req.params.id);
       fsPromises.writeFile('./data/customer.json', JSON.stringify(dataParsed, null, ' '),(err:any)=>{
         if(err) throw err;
       })
       res.status(200).json({status:"success", data:"Customer deleted!"})
     }
    }
  })


})

export default router;