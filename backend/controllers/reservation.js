import Reservation from "../models/Reservation.js";
import Hotel from "../models/Hotel.js"
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

        // Map through each reservation and fetch hotel details
        const populatedReservations = await Promise.all(Reservations.map(async (reservation) => {
            const hotel = await Hotel.findById(reservation.hotelId);
            
            if (hotel) {
                // If hotel exists, add hotelName and hotelContact to the reservation
                return {
                    ...reservation.toObject(),
                    hotelName: hotel.name,
                    hotelContact: hotel.hotelContact
                };
            } else {
                // If hotel does not exist, return reservation without hotel details
                return reservation;
            }
        }));

        res.status(200).json(populatedReservations);
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