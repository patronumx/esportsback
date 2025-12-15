const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    console.error('Error:', err.message);
    if (process.env.NODE_ENV === 'development') {
        console.error('Stack:', err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack, // TEMPORARY: Exposing stack for debugging
    });
};

module.exports = { errorHandler };
