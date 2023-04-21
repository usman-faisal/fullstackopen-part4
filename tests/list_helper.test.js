const listHelper = require("../utils/list_helper");

test("dummy returns one",function(){
    const dummy = [];
    const result = listHelper.dummy(dummy);
    expect(result).toBe(1)
})

describe('total likes', () => {
    test("of emply list is zero",() => {
        const result = listHelper.totalLikes([]);
        expect(result).toBe(0);
    })
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listHelper.listWithOneBlog)
        expect(result).toBe(5)
    })
    test("a bigger list is calculated right",() => {
        const result = listHelper.totalLikes(listHelper.listWithMultipleBlogs);
        expect(result).toBe(36)
    })
})

describe("favourite blog",() => {
    test("when list has only one blog, equals to itself",() => {
        const result = listHelper.favoriteBlog(listHelper.listWithOneBlog);
        expect(result).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })
    test("when list has multiple blogs, blog with the most likes",() => {
        const result = listHelper.favoriteBlog(listHelper.listWithMultipleBlogs);
        expect(result).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        })
    })
})

describe("most blogs",() => {
    test("empty list passed, should return null",() => {
        const result = listHelper.mostBlogs([]);
        expect(result).toBe(null)
    })
    test("single blog passed, should return the author of itself",() => {
        const result = listHelper.mostBlogs(listHelper.listWithOneBlog);
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })
    test("list of blogs passed, should return the author with most blogs",() => {
        const result = listHelper.mostBlogs(listHelper.listWithMultipleBlogs)
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3,
        })
    })

})

describe("most likes",() => {
    test("empty list passed, should return null",() => {
        const result = listHelper.mostLikes([]);
        expect(result).toBe(null)
    })
    test("single blog passed, should return the author of itself",() => {
        const result = listHelper.mostLikes(listHelper.listWithOneBlog);
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })
    test("list of blogs passed, should return the author with most likes",() => {
        const result = listHelper.mostLikes(listHelper.listWithMultipleBlogs)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17,
        })
    })
})