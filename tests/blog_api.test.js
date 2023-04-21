const app = require('../app');
const supertest = require("supertest");
const api = supertest(app);
const mongoose = require("mongoose");
const Blog = require("../models/blog")
const User = require("../models/user")
const {generateInitialBlogs,createUser} = require("../utils/blog_api")

const testUser = {

};
let initialBlogs = []
beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const createdUser = await createUser("blog test user","1234");
    const response = await api.post("/api/login").send({
        username: "blog test user",
        password: "1234",
    })
    testUser.id = createdUser._id;
    testUser.token = response.body.token;
    initialBlogs = generateInitialBlogs(createdUser._id);
    await Blog.insertMany(initialBlogs);
})

describe("when there is initially some blogs saved",() => {
    test("there are two blogs",async () => {
        const response = await api.get("/api/blogs");
        expect(response.body).toHaveLength(initialBlogs.length);
    })

    test("blogs are containing property id instead of _id",async() => {
        const response = await api.get("/api/blogs");
        expect(response.body[0].id).toBeDefined();
    })
})

describe("updating a blog",() => {
    test("succeeds with valid data",async ()=> {
        const blogToUpdate = initialBlogs[1];
        const updatedBlog = {
            title: "updating a blog",
            author: "me",
            url: "example.com",
            likes: 12,
        }
        await api.put(`/api/blogs/${blogToUpdate._id}`).set("Authorization",`Bearer ${testUser.token}`).send(updatedBlog).expect(200);
        const allBlogs = await api.get("/api/blogs");
        const titles = allBlogs.body.map(blog => blog.title)
        expect(titles).not.toContain(blogToUpdate.title);
    })
    test("fails with invalid data",async ()=> {
        const blogToUpdate = initialBlogs[1];
        // doesn't contain title
        const updatedBlog = {
            author: "me",
            likes: 12,
            url: "example.com",
        }
        await api.put(`/api/blogs/${blogToUpdate._id}`).set('Authorization',`Bearer ${testUser.token}`).send(updatedBlog).expect(400);
        const allBlogs = await api.get('/api/blogs');
        const titles = allBlogs.body.map(blog => blog.title)
        expect(titles).toContain(blogToUpdate.title);
    })
    test("fails with invalid id",async() => {
        const randomId = 123;
        const updatedBlog = {
            title: "updating a blog",
            author: "me",
            url: "example.com",
            likes: 12
        }
        await api.put(`/api/blogs/${randomId}`).set('Authorization',`Bearer ${testUser.token}`).send(updatedBlog).expect(400);
    })
    test("fails with invalid token, status 401",async() => {
        const blogToUpdate = initialBlogs[1];
        const updatedBlog = {
            title: "updating a blog",
            author: "me",
            url: "example.com",
            likes: 12
        }
        await api.put(`/api/blogs/${blogToUpdate._id}`).set('Authorization',`Bearer 123213`).send(updatedBlog).expect(401);
    })
})


describe("deleting a blog",() => {
    test("succeeds with status code 204",async () => {
        const firstBlog = initialBlogs[0];
        await api.delete(`/api/blogs/${firstBlog._id}`).set('Authorization',`Bearer ${testUser.token}`).expect(204);
        const allBlogs = await api.get("/api/blogs");
        const contents = allBlogs.body.map(blog => blog.title);
        expect(contents).not.toContain(firstBlog.title);
        expect(allBlogs.body.length).toBe(initialBlogs.length - 1)
    })
    test("fails if invalid token with 401", async() => {
        const firstBlog = initialBlogs[0];
        await api.delete(`/api/blogs/${firstBlog._id}`).set('Authorization',`Bearer 123`).expect(401);
        const allBlogs = await api.get("/api/blogs");
        const contents = allBlogs.body.map(blog => blog.title);
        expect(contents).toContain(firstBlog.title);
        expect(allBlogs.body.length).toBe(initialBlogs.length)
    })
})

describe("adding a new blog",() => {
    test("succeeds with valid data",async() => {
        const newBlog = {
            title: "This a test",
            author: "jest",
            url: "http://www.google.com",
            likes: 12
        }

        await api.post("/api/blogs").set('Authorization', `Bearer ${testUser.token}`).send(newBlog).expect(201);
        const blogs = await api.get("/api/blogs");
        const content = blogs.body.map(blog => blog.title);
        expect(content).toContain(newBlog.title);
        expect(blogs.body).toHaveLength(initialBlogs.length + 1);
    })

    test("like property defaults to zero",async() => {
        const newBlog = {
            title: "This a test",
            author: "jest",
            url: "example.com",
        }
        const response = await api.post("/api/blogs").set({'Authorization':`Bearer ${testUser.token}`
    }).send(newBlog).expect(201);
        expect(response.body.likes).toBe(0);
    })

    test("error when title or url properties are missing",async() => {
        const newBlog = {
            likes: 12,
            author: "jest",
        }
        await api.post("/api/blogs").set('Authorization',`Bearer ${testUser.token}`).send(newBlog).expect(400);
        const allBlogs = await api.get("/api/blogs/");
        expect(allBlogs.body.length).toBe(initialBlogs.length)
    })
    test("fails with invalid user token",async() => {
        const newBlog = {
            title: "This a test",
            author: "jest",
            url: "http://www.google.com",
            likes: 12
        }
        const response = await api.post("/api/blogs").set('Authorization',`Bearer 123`).send(newBlog).expect(401);
        const allBlogs = await api.get("/api/blogs/");
        expect(allBlogs.body.length).toBe(initialBlogs.length)
    })
})


afterAll(async () => {
    mongoose.connection.close();
})

