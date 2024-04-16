import Reservation from "../models/Reservation.js";

export const createReservation = async (req,res,next)=>{
    const newReservation = new Reservation(req.body)
    
    try {
        
        const savedReservation = await newReservation.save()
        res.status(200).json(savedReservation)
    } catch (err) {
        next(err)
    }
}