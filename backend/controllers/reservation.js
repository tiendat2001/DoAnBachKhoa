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

// lấy đơn đặt theo điều kiện
export const getReservations = async (req,res,next)=>{
    try {
        const Reservations = await Reservation.find(req.query).sort({ updatedAt: -1 });
        res.status(200).json(Reservations)
    } catch (err) {
        next(err)
    }
}

export const updateReservation = async (req,res,next)=>{
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        res.status(200).json(updatedReservation)
    } catch (err) {
        next(err)
    }
}