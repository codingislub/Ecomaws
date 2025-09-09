import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {
    try {
        console.log('ADMIN AUTH: Middleware hit');
        console.log('ADMIN AUTH: All headers:', req.headers);
        
        const { token } = req.headers
        console.log('ADMIN AUTH: Extracted token:', token);
        
        if (!token) {
            console.log('ADMIN AUTH: No token provided');
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log('ADMIN AUTH: Decoded token:', token_decode);
        console.log('ADMIN AUTH: Expected value:', process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
        
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            console.log('ADMIN AUTH: Token mismatch');
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        
        console.log('ADMIN AUTH: Success, calling next()');
        next()
    } catch (error) {
        console.log('ADMIN AUTH: Error occurred:', error)
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth