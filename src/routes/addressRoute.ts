import express,{Router,Request,Response} from "express"
import { addAddress,getAllAddresses,getAddressById,updateAddressById,deleteAddressById } from "../controllers/adressController"
import { AddressSchema } from "../types";
import { authMiddleware } from "../middlewares/authMiddleware";
const router= express.Router()

interface AuthRequest extends Request {
    user?: { userId: number }; 
}

router.post("/addaddress",authMiddleware,async (req:AuthRequest,res:Response)=>{

    try {
        // recive data from frontend
        const recivedData=req.body
        const userId=req.user?.userId
        
        // parse the recived data for typesafety
        const data=AddressSchema.safeParse(recivedData)

        let newAddress;
         if( data.success){
            if(userId){
             newAddress= await addAddress(data.data,userId)
             res.status(201).json({ message: "Address added successfully", address: newAddress });
            }
         }else{
            console.error("Validation Error:", data.error.format()); 
             res.status(400).json({ message: "Validation failed", errors: data.error.format() });
            
         }      
        
    } catch (error) {
        console.error("Error adding address:", error); 
        res.status(500).json({ message: "Failed to add address" }); 
    }

})

router.get("/getalladdresses",authMiddleware,async (req:AuthRequest,res:Response)=>{
   
   try {
    if (!req.user || !req.user.userId) {
     res.status(401).json({ message: "Unauthorized" }); 
    }
    const userId= req.user?.userId
    let addresses
    if(userId){
     addresses = await getAllAddresses(userId)
    }
    res.status(200).json(addresses); 
    
   } catch (error) {
    console.error("Error getting all addresses:", error);
    res.status(500).json({ message: "Failed to get addresses" });
   }
})

router.get("/getaddressbyid/:id",authMiddleware,async (req:AuthRequest,res:Response)=>{

    try {
         const id=req.params.id
         const userId=req.user?.userId
         let address
         if(userId){
         address = await getAddressById(Number(id),userId)
         }

        if (!address) {
           res.status(404).json({ message: "Address not found" }); 
        }
    
        res.status(200).json(address);
        
    } catch (error) {
        console.error("Error getting address by ID:", error);
        res.status(500).json({ message: "Failed to get address" });
    }

})

router.patch("/updateaddress/:id",authMiddleware,async(req:AuthRequest,res:Response)=>{
    try {
        const id= req.params.id
        const userId=req.user?.userId
        const recivedData= req.body
        let updatedAddress;
       const  parsedData=AddressSchema.safeParse(recivedData)

        if(parsedData.success){
            if(userId){
          updatedAddress= await updateAddressById(id,parsedData.data,userId)
            }
        }else{
            res.status(400).json({message: parsedData.error})
        }   
       
        if (!updatedAddress) {
         res.status(404).json({ message: "Address not found" });
          }
      
        res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Failed to update address" });
    }

})

router.delete("/deleteaddress/:id",authMiddleware,async(req:AuthRequest,res:Response)=>{

    try {
        const id= req.params.id
        const userId= req.user?.userId
        let deletedAddress
        if(userId){
         deletedAddress = await deleteAddressById(Number(id),userId)
        }

        if (!deletedAddress) {
        res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Failed to delete address" });
    }

})


export default router
