const { 
    MONGODB_URI,
    
   } =require('../utils/config')
  const mongoose = require("mongoose")

  const User = require("../models/User")

const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)


beforeEach(async()=> {
    const mongoUrl = MONGODB_URI;
await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true})
  await User.deleteMany({})

})

describe("Adding user to database", ()=> {
    test("Database is empty when start the test", async() => {
        const db = await User.find({}).count();
        expect(db).toBe(0)
    })
    test("user is created", async() => {
        const newUser = {
            name: "johnny x",
            username: "candySwim",
            password: "1234secret"
        }
       const response = await api.post("/api/users").send(newUser).set('Content-Type', 'application/json')
        const db = await User.find({}).count();
        console.log("This to be first")
        expect(db).toBe(1)
    });
    test("hash function is aplied", async()=> {
        const newUser = {
            name: "johnny x",
            username: "candySwim",
            password: "1234secret"
        }
        const response = await api.post("/api/users")
        .send(newUser)
        .set('Content-Type', 'application/json');
        console.log("This to be second")
        delete response.body._id;
        delete response.body.__v;
        
        expect(response.body).not.toEqual(newUser)
    })

    test("GET users", async()=> {
        const newUser = {
            name: "johnny x",
            username: "candySwim",
            password: "1234secret"
        }
        const response = await api.post("/api/users")
        .send(newUser)
        .set('Content-Type', 'application/json')
        const users = await api.get("/api/users");
        
        expect(users.body).toHaveLength(1)
    });

    test("Unique username constraint is applied", async () => {
        const newUser = {
            name: "johnny x",
            username: "candySwim",
            password: "1234secret"
        };
        const newUser2 = {
            name: "johnny x",
            username: "candySwim",
            password: "1234secret"
        }
        // Set error to be catched
let err;
        const response1 = await User.create(newUser)
        try {
            const response2 = await User.create(newUser2)

        } catch (error)
        {
            // Asign error to the function scoped variable
err = error
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    })
test("Status 400 when password has less than 3 chars", async()=> {
    const newUser = {
        name: "johnny x",
        username: "candySwim",
        password: "12"
    };

    const response = await api.post("/api/users").send(newUser).set("Content-Type", "application/json")
expect(response.status).toBe(400);


})
})


afterAll(async()=>{
    await mongoose.disconnect()
  });