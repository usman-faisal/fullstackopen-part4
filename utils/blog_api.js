const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const generateInitialBlogs = (userId) => [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: userId,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        user: userId,
        __v: 0
    }
]


const createUser = async(username,password) => {
    const passwordHash = await bcrypt.hash(password,10)
    const user = new User({
        username,
        passwordHash
    })
    const createdUser = await user.save();
    return createdUser;
}


const getAllBlogs = async () => {
    const allBlogs = await Blog.find({});
    return allBlogs;
}

const insertBlog = async (blog) => {
    const newBlog = new Blog(blog);
    await newBlog.save();
}


module.exports = {
    generateInitialBlogs,
    getAllBlogs,
    insertBlog,
    createUser
}