import express from "express"
import Hotel from "../models/Hotel.js" // phai co .js
const router = express.Router()

//CREATE
router.post("/",async(req,res)=>{
    const newHotel = new Hotel(req.body) // thong tin lay tu body cua req
    
    try {
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    } catch (err) {
        res.status(500).json(error)
    }

})

export default router