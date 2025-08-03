import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const token = req.body?.token || req.headers?.token;
    if (!token) {
        return res.json({
            success: false,
            message: 'No authorization, login again!'
        })
    } 
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export default userAuth;