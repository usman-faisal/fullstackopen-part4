const loginRouter =require("express").Router();
const User = require('../models/user')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const {SECRET} = require("../utils/config")
loginRouter.post('/',async(request,response) => {
    const {username,password} = request.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = user === null ? false : await bcrypt.compare(password,user.passwordHash);
    if(!user || !isPasswordCorrect){
        return response.status(401).json({
            error: "incorrect email or password"
        })
    }

    const token = jwt.sign({username: user.username,id: user._id},SECRET)
    response.send({token, username: user.username});
})

module.exports = loginRouter;