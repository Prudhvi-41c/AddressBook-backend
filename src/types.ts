
import { z } from "zod";

export const AddressSchema = z.object({
    id: z.number().optional(),
    user_id:z.number().optional(),
    title: z.string().min(3, { message: "Must be at least 3 characters long" }),

    fullname: z.string().min(3, { message: "Must be at least 3 characters long" }).max(20),

    mobilenumber: z.string().refine(val => val.length === 10 ,{message:"Mobilenumber must have 10 digits"})
    .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num; 
       
    }).refine(val => typeof val === 'number', { message: "Mobile number must be a number" }), 

    email: z.string().refine(
        (val) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{1,}$/.test(val),
        { message: "Invalid email format. Example: user@example.com" }),

    pincode: z.string().refine(val => val.length === 6 ,{message:"Pincode must have 6 digits"})
    .transform((val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num;        

    }).refine(val => typeof val === 'number', { message: "Pincode must be a number" }), 

    area1: z.string().min(5, { message: "Must be at least 5 characters long" }),
    area2: z.string().optional(), 
    landmark: z.string().optional(),
    city: z.string().min(3),
    state: z.string().min(3),
}).refine(data => data.mobilenumber !== undefined, {
    message: "Mobile number is required"
}).refine(data => data.pincode !== undefined, {
    message: "Pincode is required"
});




export type Address = z.infer<typeof AddressSchema>;


export const userSchema=z.object({
    user_id:z.number().optional(),
    user_email:z.string().refine(
        (val) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{1,}$/.test(val),
        { message: "Invalid email format. Example: user@example.com" }),
    user_password:z.string().min(8,{message:"Must be at least 8 characters long"}),
    user_confirmPassword:z.string().min(8,{message:"Must be at least 8 characters long"}),
    user_name:z.string().min(4,{message:"Must be at least 4 characters long"})
}).refine(data => data.user_password === data.user_confirmPassword,{
    message:"password and confirm password must match"
})

export type User=z.infer<typeof userSchema>