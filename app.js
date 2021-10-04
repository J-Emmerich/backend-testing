const express = require('express')
const cors = require('cors')
require("express-async-errors")
const mongoose = require('mongoose')
const { info } = require("./utils/logger")
const Blog = require("./models/Blog")
const errorHandler = require("./utils/middleware")
const { 
  MONGODB_URI,
  PORT
 } =require('./utils/config')
  const blogRouter = require('./controllers/blog')
  const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const getToken = require('./utils/get-token')
  

  if(process.env.NODE_ENV !== "test") {
    const mongoUrl = MONGODB_URI;
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true})
  }


mongoose.connection.on("connected", ()=> {
  info("Database connected");
})
const app = express()
app.use(cors())
app.use(express.json())
app.use(getToken)
app.use("/api", loginRouter)
app.use("/api", blogRouter)
app.use("/api", userRouter)

app.use(errorHandler)


module.exports = app