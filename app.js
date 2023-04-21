const express = require('express')
require("express-async-errors");
const app = express()
const {MONGODB_URI,PORT} = require("./utils/config")
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require("./controllers/blog")
const userRouter = require("./controllers/user");
const {requestLogger,unknownEndpoints,errorHandler} = require("./utils/middleware")
const loginRouter = require("./controllers/login");
mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(requestLogger);

app.use("/api/login",loginRouter)
app.use("/api/blogs",blogRouter);
app.use("/api/users",userRouter);


app.use(unknownEndpoints);
app.use(errorHandler);

module.exports = app;