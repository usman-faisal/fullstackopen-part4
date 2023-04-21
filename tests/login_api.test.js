const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs")

beforeEach(async () => {
    const password = "123";
    const passwordHash = await bcrypt.hash(password, 10)
    await User.deleteMany({});
    const user = new User({
        username: "TestUser",
        passwordHash,
    })
    await user.save();
})

describe("user logging in",() => {
    test("returns token and username with valid data",async() => {
        const user = {
            username: "TestUser",
            password: "123"
        }
        const response = await api.post("/api/login").send(user).expect(200);
        expect(response.body.username).toBe("TestUser");
        expect(response.body.token).toBeDefined();
    })
    test("does not return token and username with invalid password",async() => {
        const user = {
            username: "TestUser",
            password: "1234444"
        }
        const response = await api.post("/api/login").send(user).expect(401);
        expect(response.body.token).toBeUndefined();
    })
})





afterAll(() => {
    mongoose.connection.close();
})