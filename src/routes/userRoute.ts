import express,{ Router,Request,Response } from "express"
import { userSchema } from "../types"
import { createUser,getUserData,getUserDataById } from "../controllers/userController"
import { log } from "console"
import bcrypt from "bcrypt"
import jwt from"jsonwebtoken"
require('dotenv').config()


const router= express.Router()

const secret= process.env.JWT_SECRET
if (!secret) {
    throw new Error("JWT_SECRET is not defined. Check your environment variables.");
}



router.post("/addUser",async (req:Request,res:Response)=>{
    try {

        const recivedData=req.body
        const data=userSchema.safeParse(recivedData)

        if(data.success){   
            const userdata= await getUserData(data.data.user_email)
            if(!userdata){
            const newUser= await createUser(data.data)
            res.status(201).json({message:`User Createdd sucessfully with mail id ${newUser.user_email}`,newUser}) 
            }else{
                res.status(409).json({message:`User already exist with mail id ${data.data.user_email} `})
            }

        }else{
            console.error("Validation Error:", data.error.format()); 
            res.status(400).json({ message: "Validation failed", errors: data.error.format() });
        }
        
    } catch (error) {
        console.error("Error creating User:", error); 
        res.status(500).json({ message: "Failed to create User" }); 
    }
   
})

router.post("/loginUser", async (req:Request,res:Response)=>{
    try {
            const reqdata=req.body
             console.log(reqdata);
             let data;

             try {
                 data= await getUserData(reqdata.user_email)
                console.log(data);
             } catch (error) {
                console.log(error);
                
                res.status(404).json({message:`User does not exist with mail id ${data.user_email} `})
             }

            if(data){
                const isMatch= await bcrypt.compare(reqdata.user_password,data.user_password)
                if(isMatch){
                    console.log("User Verified Sucessfully");   
                    const token= jwt.sign(
                        {userId:data.user_id,
                         userName:data.user_name
                        },
                        secret,
                        {
                          expiresIn:"1h"
                        }
                    )
                    res.cookie('jwtToken', token, {
                         httpOnly: false, 
                        maxAge: 3600000, // 1 hour in milliseconds
                    });
                    res.status(200).json({message:`User Vrified sucessfully with mail id ${data.user_email}`,data}) 
                }else{
                    console.log("Please check your password");
                    res.status(401).json({message:`Please check your password ${data.user_email}`}) 
                    
                }
          }else{
            res.status(404).json({message:`User does not exist with mail id ${data.user_email} `})
          }
       
    } catch (error) {
        console.error("Error verifying User:", error); 
        res.status(500).json({ message: "Failed to verify User" });   
    }
})

router.get("/verifyuserid/:id",async (req:Request,res:Response)=>{
    const userId=req.params.id
    try {

        const userData= await getUserDataById(Number(userId))
        if(userData){
            res.status(200).json({message:"User exist",userData})
        }else{
            res.status(404).json({message:`Cant find user with id ${userId}`})
        }
        
    } catch (error) {
        console.error("Error in finding User:", error); 
        res.status(500).json({ message: "Failed to find User" });   
    }
})

router.post("/logout",(req:Request,res:Response)=>{
    res.clearCookie("jwtToken", {
         httpOnly: false
      });
    
      res.status(200).json({ message: "Logged out successfully" });
})

export default router;