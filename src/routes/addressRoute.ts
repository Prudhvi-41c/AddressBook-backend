import express,{Router,Request,Response} from "express"
import { addAddress,getAllAddresses,getAddressById,updateAddressById,deleteAddressById } from "../controllers/adressController"
const router= express.Router()

router.post("/addaddress",async (req:Request,res:Response)=>{

    try {

        const data=req.body

        const newAddress= await addAddress(data)

        res.status(201).json({ message: "Address added successfully", address: newAddress });
        
    } catch (error) {
        console.error("Error adding address:", error); 
        res.status(500).json({ message: "Failed to add address" }); 
    }

})

router.get("/getalladdresses",async (req:Request,res:Response)=>{
   try {
    const addresses = await getAllAddresses()
    res.status(200).json(addresses); 
    
   } catch (error) {
    console.error("Error getting all addresses:", error);
    res.status(500).json({ message: "Failed to get addresses" });
   }
})

router.get("/getaddressbyid/:id",async (req:Request,res:Response)=>{

    try {
         const id=req.params.id
        const address = await getAddressById(Number(id))

        if (!address) {
           res.status(404).json({ message: "Address not found" }); // Handle case where address is not found
        }
    
        res.status(200).json(address);
        
    } catch (error) {
        console.error("Error getting address by ID:", error);
        res.status(500).json({ message: "Failed to get address" });
    }

})

router.patch("/updateaddress/:id",async(req:Request,res:Response)=>{
    try {
        const id= req.params.id
        const data= req.body
        const updatedAddress = await updateAddressById(id,data)
        if (!updatedAddress) {
         res.status(404).json({ message: "Address not found" });
          }
      
        res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Failed to update address" });
    }

})

router.delete("/deleteaddress/:id",async(req:Request,res:Response)=>{

    try {
        const id= req.params.id
        const deletedAddress = await deleteAddressById(Number(id))


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
