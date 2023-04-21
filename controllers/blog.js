const Blog = require("../models/blog");
const blogRouter = require("express").Router();
const User = require("../models/user")
const {userExtractor,tokenExtractor,checkAuth} = require("../utils/middleware");
blogRouter.get('/', (request, response) => {
    Blog
        .find({}).populate("user",{username: 1,id: 1})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.get("/:id",async(request,response,next)=>{
    const {id} = request.params;
    const blog = await Blog.findById(id);
    if(blog){
        return response.status(200).json(blog);
    }
    return response.status(404).end();
})

blogRouter.use(tokenExtractor);

blogRouter.post('/',userExtractor, async(request, response) => {
    const {body} = request;
    const decodedToken = response.locals.user;
    const user = await User.findById(decodedToken?.id);
    if(!user) return response.status(401).json({error: "Unauthorized"})
    const blog = new Blog({
        ...body,
        likes: body.likes || 0,
        creator: decodedToken.username,
        user: user.id
    })
    const newBlog = await blog.save();
    user.blogs = user.blogs.concat(newBlog._id);
    await user.save();
    response.status(201).json(newBlog);
})

blogRouter.put("/:id",userExtractor,checkAuth,async(request,response,next) => {
    const {id} = request.params;
    const {body} = request;
    if(response.locals.user){
        const blog = await Blog.replaceOne({_id: id},body,{new: true,runValidators: true})
        console.log(blog);
        return response.json(blog);
    }
    response.status(400).json({error: "something went wrong"})

})

blogRouter.delete("/:id",userExtractor,checkAuth,async(request,response) => {
    const {id} = request.params;
    if(response.locals.user){
        await Blog.findByIdAndDelete(id);
        return response.status(204).end();
    }
    response.status(401).json({error: "Unauthorized"})
})

module.exports = blogRouter;