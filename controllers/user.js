const userRouter = require("express").Router();
const User = require("../models/user")
const bcrypt = require('bcryptjs')
userRouter.get("/",async(request,response) => {
    const users  = await User.find({}).populate("blogs",{url: 1,author: 1,title: 1,id: 1})
    response.json(users);
})

userRouter.post("/",async(request,response,next) => {
    const {body} = request;
    if(!body.password) return next({name: "ValidationError",message: "password can not be empty"});
    if(body.password.length < 3) return next({name: "ValidationError",message: "minimum password length is 3"})
    const passwordHash = await bcrypt.hash(body.password,10);
    const newUser = new User({
        ...body,
        passwordHash,
    })
    const savedUser = (await newUser.save());
    response.status(201).json(savedUser);
})


module.exports = userRouter;
