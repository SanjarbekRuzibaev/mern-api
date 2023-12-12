const notFound = (req, res, next)=>{
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode
    //500 means it's server error
    res.status(statusCode)
    res.json({
        //any exception that is in catch, will be display here in message
        message:err.message,
        //we only need this in development mood that's why i use the below code.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export {notFound, errorHandler}