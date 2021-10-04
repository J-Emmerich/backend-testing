const { 
  MONGODB_URI,
  
 } =require('../utils/config')
const mongoose = require("mongoose")
const Blog = require("../models/Blog")

const app = require('../app')

const supertest = require('supertest')

const initialBlog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const api = supertest(app)

beforeEach(async () => {
  const mongoUrl = MONGODB_URI;
await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true})
  await Blog.deleteMany({})
  let newBlog = new Blog(initialBlog[0]);
  await newBlog.save()
  newBlog = new Blog(initialBlog[1])
  await newBlog.save()
  newBlog = new Blog(initialBlog[5])
  await newBlog.save()
})

describe("http Get", ()=> {

  test('returns status 200 and notes as json', async () => {
    await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  }, 10000);
  
test("Has 3 blogs", async ()=> {
const response = await api.get("/api/blogs");
// console.log(response.body);
expect(response.body.length).toBe(3)
})

  test("First blog title is React patterns", async ()=> {
    
    const response = await api.get('/api/blogs');

    expect(response.body[0].title).toBe("React patterns")
  })

  test("Blog has property id", async ()=> {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined()
  } )
})
describe("HTTP put", ()=> {
  test("Update likes to 200000", async()=> {
    const toUpdate = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 200000,
      __v: 0
    }
    const updated = await api.put(`/api/blogs/${initialBlog[5]._id}`).send(toUpdate)
    .set('Content-Type', 'application/json');
    
    expect(updated.body.likes).toBe(200000)
  })
  test("responds with 400 if not found put", async ()=> {
    const updated = await api.put(`/api/blogs/2`).send({likes: 2}).set('Content-Type', 'application/json');
 expect(updated.status).toBe(400) 
  })
})
describe("HTTP post", ()=> {

 test("post route save a new blog post, in correct format", async ()=> {
const response = await api.post("/api/blogs").send(initialBlog[2]).set('Content-Type', 'application/json')

delete initialBlog[2]._id
delete initialBlog[2].__v
delete response.body.id
const getResponse = await api.get("/api/blogs")
expect(response.body).toEqual(initialBlog[2])
expect(getResponse.body.length).toBe(4)

})

test("Likes value default to 0", async ()=> {
  delete initialBlog[3].likes
  const response = await api.post("/api/blogs").send(initialBlog[3]).set('Content-Type', 'application/json')

  expect(response.body.likes).toBe(0)
})

test("Without title server responds status 201", async () => {
  delete initialBlog[4].title;
  const response = await api.post("/api/blogs").send(initialBlog[4]).set('Content-Type', 'application/json')
  expect(response.status).toBe(201)
})
test("Without URL server responds status 201", async () => {
  delete initialBlog[5].url;
  const response = await api.post("/api/blogs").send(initialBlog[5]).set('Content-Type', 'application/json')
  expect(response.status).toBe(201)
})
test("Without URL AND TITLE server responds status 400", async () => {
  delete initialBlog[5].title;
  const response = await api.post("/api/blogs").send(initialBlog[5]).set('Content-Type', 'application/json')
  expect(response.status).toBe(400)
})
})
 
describe("HTTP delete", () => {
  test("responds with 400 if not found", async() => {
    const response = await api.delete("/api/blogs/23");
    expect(response.status).toBe(400);
  })
  test("responds with 204 if success", async ()=> {
    const response = await api.delete(`/api/blogs/${initialBlog[0]._id}`);
    expect(response.status).toBe(204);
  })
})
  afterAll(async()=>{
    await mongoose.disconnect()


  })