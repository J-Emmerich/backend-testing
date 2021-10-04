const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogList) => {
    
    const likes = blogList.reduce((aggregator, blog) => {
        return aggregator + blog.likes
    }, 0)
return likes
}

const favoriteBlog = (blogList) => {

return blogList.reduce((favorite, blog)=>{
if(!favorite.likes || blog.likes > favorite.likes) {

    favorite.title = blog.title
    favorite.author = blog.author
    favorite.likes = blog.likes
    
}
return favorite
    
}, {})

}

module.exports = {
    dummy, totalLikes, favoriteBlog
}