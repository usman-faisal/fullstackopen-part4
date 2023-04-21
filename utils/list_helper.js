const dummy = (blogs) => {
    return 1;
}

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]
const listWithMultipleBlogs =[
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    },
]

const totalLikes = (blogs) => {
    const reducer = (sum,blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer,0);
}

const favoriteBlog = (blogs) => {
    const reducer = (prevBlog,nextBlog) => {
        const formatBlog = ({likes,author,title}) => ({likes,author,title})
        return prevBlog.likes > nextBlog.likes ? formatBlog(prevBlog) : formatBlog(nextBlog);
    }
    return blogs.reduce(reducer,blogs[0]);
}

const mostBlogs = (blogs) => {
    const res = {};
    for(let i = 0; i < blogs.length; i ++){
        if(res[blogs[i].author] || res[blogs[i].author] === 0){
            res[blogs[i].author] += 1;
        }
        else{
            res[blogs[i].author] = 1;
        }
    }
    return Object.keys(res).reduce((prevAuthor,nextAuthor) => {
        const formatAuthor = (author) => ({author,blogs: res[author]})
        return res[prevAuthor] > res[nextAuthor] ? formatAuthor(prevAuthor) : formatAuthor(nextAuthor);
    },Object.keys(res)[0]) || null;
}

const mostLikes = (blogs) => {
    const res = {};
    for(let i = 0; i < blogs.length; i ++){
        if(res[blogs[i].author] || res[blogs[i].author] === 0){
            res[blogs[i].author] += blogs[i].likes;
        }
        else{
            res[blogs[i].author] = blogs[i].likes;
        }
    }
    const author = Object.keys(res).reduce((prevAuthor,nextAuthor) => {
        return res[prevAuthor] > res[nextAuthor] ? prevAuthor : nextAuthor;
    },Object.keys(res)[0])
    return author && {author,likes: res[author]} || null;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    listWithOneBlog,
    listWithMultipleBlogs
}