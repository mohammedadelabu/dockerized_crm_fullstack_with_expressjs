import request from 'supertest';
const app = require('../dist/app').default;

interface UserObject{
    [key: string]: string | any | number
  }
let database: UserObject;
 try{
     database = require("../data/customer.json");
 }catch(err){
    console.log("No database")
    database =[]
 }

 describe("Test for Get all functionalities",()=>{
    test("It should get all customer and return 200 if there is a database", async()=>{
        if(database.length > 0){
            await request(app)
            .get('/users/customer')
            .set('Accept', 'application/json')
            .expect(200);
        }
    });

    test("It should return 404 if there is no database", async ()=>{
        if(database.length === 0){
            await request(app)
            .get('/users/customer')
            .set('Accept', 'application/json')
            .expect(404);
        }
    });

    test("It should return 404 if there is no user with such id", async () => {
        const id = "1";
            const idObj = database.filter((elem:any)=> elem.id ===id);
            if(idObj.length === 0){
                await request(app)
                .get(`/users/customer/${id}`)
                .set('Accept', 'application/json')
                .expect(404);
            }
    });


    test("It should return 200 if there is  customer with id", async () => {
        const id = 1;
            const idObj = database.filter((elem:any)=> elem.id ===id);
            if(idObj.length > 0){
                await request(app)
                .get(`/users/customer/${id}`)
                .set('Accept', 'application/json')
                .expect(200);
            }
    });
})

describe('Test for post functionality', ()=>{
    test('It should post a customer', async ()=>{
        await request(app)
        .post('/users/customer')
        .send({ 
         fullname: 'john doe',
         email: 'john@example.com',
          gender:'m',
          phone:'+2347085647535',
          address:'1, rantech stop, ',
          notes:'This Customer is owing 10k' 
        })
        .set('Accept', 'application/json')
        .expect(201)
    })
})


describe('Test for update functionality', ()=>{
    const id = 1;
    const idObj = database.filter((elem:UserObject)=> elem.id ===id);
    test('It should return 201 when it update customer', async ()=>{
       if(idObj.length > 0){
        await request(app)
        .patch(`/users/customer/${id}`)
        .send({ 
         fullname: 'john doe',
         email: 'john@example.com',
          gender:'m',
          phone:'+2347085647535',
          address:'1, rantech stop, ',
          notes:'This Customer is owing 10k' 
        })
        .set('Accept', 'application/json')
        .expect(201)
       }
    })


    
    test('It should return 404 if id is not found ', async ()=>{
       if(idObj.length === 0){
        await request(app)
        .patch(`/users/customer/fakeId`)
        .send({ 
         fullname: 'john doe',
         email: 'john@example.com',
          gender:'m',
          phone:'+2347085647535',
          address:'1, rantech stop, ',
          notes:'This Customer is owing 10k' 
        })
        .set('Accept', 'application/json')
        .expect(404)
       }
    })
})

describe("Test for Delete functionalities", () => {
    const id = 1;
    const idObj = database.filter((x:UserObject) => x.id === id);
    test("it should return 201 if id is found", async () => {
      if (idObj.length > 0) {
        await request(app)
          .delete(`/users/customer/${id}`)
          .set("Accept", "application/json")
          .expect(200);
      }
    });
    test("it should return 404 if id is not found", async () => {
      if (idObj.length === 0) {
        await request(app)
          .delete(`/users/customer/${id}`)
          .set("Accept", "application/json")
          .expect(404);
      }
    });
  });

