const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, blog) => {
        return favorite.likes > blog.likes ? favorite : blog
    })
}

const mostBlogs = (blogs) => {
    const authors = _.map(blogs, 'author')
    const mostCommonAuthor = _.chain(authors).countBy().entries().maxBy(_.last).head().value()
    const count = _.countBy(blogs, 'author')
    return {
      author: mostCommonAuthor,
      blogs: count[mostCommonAuthor]
    }
}

const mostLikes = (blogs) => {
    const likesByAuthors = _.chain(blogs).groupBy('author').map((objs, key) => ({
      'author': key,
      'likes': _.sumBy(objs, 'likes')
    })).maxBy('likes').value();
  
    return likesByAuthors;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}