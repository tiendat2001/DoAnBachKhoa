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


export const getReservations = async (req,res,next)=>{
    try {
        const Reservations = await Reservation.find(req.query);
        res.status(200).json(Reservations)
    } catch (err) {
        next(err)
    }
}