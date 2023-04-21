const logger = require('./logger');
const jwt = require('jsonwebtoken');
const Blog = require("../models/blog")
const {SECRET} = require("../utils/config")
const requestLogger = (req,res,next) => {
    logger.info("method",req.method);
    logger.info("path",req.path);
    logger.info("body",req.body);
    logger.info("content-type",req.contentType);
    logger.info("--------")
    next();
}

const unknownEndpoints = (req,res) => {
    res.status(404).json({error: "unknown endpoint"});
}

const tokenExtractor = (request,response,next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        response.locals.token = authorization.replace('Bearer ', '')
        return next();
    }
    next();
}

const userExtractor = (request,response,next) => {
    const decodedToken = jwt.verify(response.locals.token,SECRET);
    if(decodedToken?.id){
        response.locals.user = decodedToken;
        next();
        return;
    }
    if(!decodedToken?.id){
        return response.status(401).json({error: "unauthorized"})
    }
}

const checkAuth = async(request,response,next) => {
    const {id} = request.params
    const blogToUpdate = await Blog.findById(id);
    if(blogToUpdate?.user?.toString() === response?.locals?.user?.id.toString()){
        next();
    }
    else {
        return response.status(401).json({error: "Unauthorized"})
    }
}

const errorHandler = (err,req,res,next) =>{
    logger.error("message",err.message);
    console.log(err.name);
    if(err.name === "CastError"){
        return res.status(400).json({error: "malformatted id"})
    }
    if(err.name === "ValidationError"){
        return res.status(400).json({error: err.message});
    }
    if(err.name === "JsonWebTokenError"){
        return res.status(401).json({error: err.message})
    }
    next(err);
}

module.exports = {
    requestLogger,
    unknownEndpoints,
    errorHandler,
    tokenExtractor,
    userExtractor,
    checkAuth
}