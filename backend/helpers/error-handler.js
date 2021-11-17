function errorHandler(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        // authentication error.
       return  res.status(401).json({success: false, error: 'User is not authorized.'});
    }

    if(err.name === 'ValidationError') {
        // validation error.
        return  res.status(401).json({success: false, error: err});
    }

    // default error.
    return res.status(500).json({success: false, error: err})
}

module.exports = errorHandler;