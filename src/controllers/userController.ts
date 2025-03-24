import { User } from "../types"
import { db } from "../db/dbConfig"
import bcrypt from "bcrypt"

const salt= 5;

export const createUser= async (data:User)=>{
     const {user_confirmPassword,user_email,user_name,user_password}=data

     let hashedPassword= await bcrypt.hash(user_password,salt)
     
     if(hashedPassword){
        const query= `INSERT INTO  users(user_name, user_email, user_password) 
        VALUES 
        ($1 ,$2, $3) RETURNING *`
        const values= [user_name,user_email,hashedPassword];
        try {

            const result= await db.query(query,values)
            console.log(result.rows[0])
            return (result.rows[0])
            
        } catch (error) {
            console.log("Error adding user to database:", error);
            throw error; 
        }
     }


     
}

export const getUserData = async (user_email:User["user_email"])=>{
   const query = `SELECT * FROM users where user_email = $1`
   const values=[user_email]

   try {
    const result=  await db.query(query,values)
    console.log( result.rows[0])
    return(result.rows[0])
   } catch (error) {
    console.log("Error finding user in database:", error);
    throw error; 
   }

}

export const getUserDataById= async(userId:number)=>{
   const query=`SELECT * FROM users WHERE user_id= $1`
   const values=[userId]
   try {
      const result= await db.query(query,values)
      return result.rows[0]
   } catch (error) {
     console.log(`Error in find user with userid ${userId}`);
     throw error;
   }
}