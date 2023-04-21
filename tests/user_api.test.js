const User = require("../models/user");
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require("bcryptjs");
const helpers = require("../utils/list_api")
const mongoose = require('mongoose')

beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("10",10)
    const user1 = new User({
        username: "Josh",
        passwordHash,
    })
    await user1.save();
})

describe("when initially some users",() => {

})

describe("adding a new user",() => {
    test("succeeds with valid data",async () => {
        const usersAtStart = await helpers.usersInDb();
        await api.post("/api/users").send({
            username: "Martha",
            password: "mynameismartha",
        }).expect(201);
        const usersAtEnd = await helpers.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    })
    test("fails with invalid data", async() => {
        const usersAtStart = await helpers.usersInDb();
        await api.post("/api/users").send({
            username: "Henry",
            password: "12"
        }).expect(400);
        const usersAtEnd = await helpers.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    })
    test("fails if username already exists", async() => {
        const usersAtStart = await helpers.usersInDb();
        await api.post("/api/users").send({
            username: "Josh",
            password: "12344",
        }).expect(400);
        const usersAtEnd = await helpers.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    })
})

afterAll(() => {
    mongoose.connection.close();
})