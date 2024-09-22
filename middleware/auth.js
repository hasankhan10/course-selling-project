const jwt = require("jsonwebtoken")
function auth(req,res,next){
    const token = req.headers.token
    if (token) {
        try {
            jwt.verify(token,process.env.JWT_SECRET,(err,done)=>{
                if(err){
                    res.status(417).json({
                        messege:"Token verify failed."
                    })
                }else{
                    req.id=done.id
                    next()
                }
            })
        } catch (error) {
            res.status(401).json({
                messege:"Token is unauthorized."
            })
        }
    } else {
        res.status(401).json({
            messege:"Token not found."
        })
    }
}
module.exports = {
    auth
}