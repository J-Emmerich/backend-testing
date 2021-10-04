const errorHandler = async (error, req, res, next, ) => {

    if (error.name === "CastError") {
       
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.message === "Password must have at least 3 letters") {
    return res.status(400).json(error.message)
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

module.exports = errorHandler;