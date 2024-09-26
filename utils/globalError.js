

function globalError(err,req,res,next){
    let statusCode = 500;
    let errString = 'something went wrong'

    if(err.statusCode) {
        statusCode = err.status;
        errString = err.message
    }

    res.json({status: statusCode, message: errString});
}
module.exports = {
    globalError
}