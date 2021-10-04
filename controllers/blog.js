const router = require("express").Router()
const Blog = require("../models/Blog");
const User = require("../models/User");

const jwt = require("jsonwebtoken")


router.get('/blogs', async (request, response) => {
   const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
      response.status(200).json(blogs)
  
 })
 
 router.post('/blogs', async (request, response) => {
   
   if(!request.body.title && !request.body.url ){
     response.status(400).end()
    } else {
     const { token } = request;
     const decodedToken = jwt.verify(token, process.env.SECRET);
     if(!token || !decodedToken.id){
       return response.status(401).json({error: "token missing or invallid"})
     }
     const user = await User.findById(decodedToken.id);

 const {likes, url, title, author} = request.body
     let blog = new Blog({likes, url, title, author, user: user._id})
     const savedBlog = await blog.save();
    
     user.blogs = user.blogs.concat(savedBlog._id);
     console.log("Validation error here")
     await user.save()
     console.log("Validation error if this doesnt show")
     response.status(201).json(blog); 
   }
 })
 router.put('/blogs/:id', async (req, res) => {
   const { id } = req.params;
   const { likes } = req.body;
   const updated = await Blog.findOneAndUpdate({_id: id}, {likes: likes},{useFindAndModify: true,new: true})
   if(typeof updated === Error) throw Error("No such user");
   res.status(200).json(updated);
 })


 router.delete('/blogs/:id', async (req, res) => {
  const { id }= req.params;
  const isDeleted = await Blog.findByIdAndRemove(id);
  if(typeof isDeleted === Error) throw Error("No such user");
  res.status(204).json(isDeleted);

 })
  module.exports = router