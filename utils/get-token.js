const getToken = (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new Error("401");
        else{
            const authorization = req.headers.authorization
            if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
                req.token = authorization.substring(7)
                  
                  next()
              } else {
                throw new Error("401");
              }
        }
    } catch (err){
        next(err.message)
    }
}
  module.exports = getToken