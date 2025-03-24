import { Request,Response,NextFunction } from "express";
import { getUserDataById } from "../controllers/userController";
import jwt from "jsonwebtoken"
require("dotenv").config()
const secret= process.env.JWT_SECRET
if (!secret) {
    throw new Error("JWT_SECRET is not defined. Check your environment variables.");
}
interface AuthRequest extends Request {
    user?: { userId: number,
             userName:string
     }; 
}

export const  authMiddleware =async (req:AuthRequest,res:Response,next:NextFunction)=>{
    // const token= req.header("Authorization")?.split(" ")[1]
    const token = req.cookies.jwtToken
    if(!token){
         res.status(401).json({ message: 'No token, authorization denied' });
    }else{
        try {
            const decoded = jwt.verify(token, secret) as {userId:number}
            //  req.user = decoded
            console.log(decoded);
            
            const userId=decoded.userId
            let userData
                try {
            
                     userData= await getUserDataById(Number(userId))
                    if(userData.user_id){
                        
                            req.user={userId: userData.user_id, userName: userData.user_name}
                            next()
                        
                    }else{
                        res.status(404).json({message:`Cant find user with id ${userId}`})
                    }
                    
                } catch (error) {
                    console.error("Error in finding User:", error); 
                }

        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    }
}