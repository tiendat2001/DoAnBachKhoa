import Reservation from "../models/Reservation.js";
import Hotel from "../models/Hotel.js"
import User from "../models/User.js"
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


export const deleteAllReservations = async (req,res,next)=>{
    try {
        await Reservation.deleteMany({});
        res.status(200).json('All reservations have been deleted.');
    } catch (err) {
        next(err)
    }
}



// THỐNG KÊ DOANH THU ALL HOTEL (CHO BÊN ADMINISTRATOR)
export const getAllHotelRevenue = async (req, res, next) => {
    try {
        // Lấy tất cả các đơn đặt phòng
        const reservations = await Reservation.find({status:true});

        // Tạo một object để lưu trữ tổng doanh thu của từng khách sạn
        const hotelRevenueMap = {};

        await Promise.all(reservations.map(async  (reservation) => {
            const hotelId = reservation.hotelId;
            const hotel = await Hotel.findById(hotelId);
            const user= await User.findById(hotel.ownerId);
            const totalPrice = reservation.totalPrice;
            
            if (hotel) {
            // Nếu khách sạn đã tồn tại trong map, cộng thêm doanh thu
            if (hotelRevenueMap[hotelId]) {
                hotelRevenueMap[hotelId].totalRevenue += totalPrice;
            } else {
                // Nếu khách sạn chưa tồn tại trong map, tạo một entry mới với doanh thu là doanh thu của đơn đặt phòng
                hotelRevenueMap[hotelId] = {
                    hotelId: hotelId,
                    hotelName: hotel.name,
                    userOwner:user.email,
                    totalRevenue: totalPrice,
                    createdAt:hotel.createdAt
                };
            }
        }
        }));

        // Lấy tất cả các khách sạn từ cơ sở dữ liệu
        const hotels = await Hotel.find();

        // Cập nhật tên của từng khách sạn ko doanh thu
        await Promise.all(hotels.map(async (hotel) => {
            const hotelId = hotel._id;
            const hotelName = hotel.name;
            const user= await User.findById(hotel.ownerId);
            // Nếu khách sạn có trong map thì đc add bên trên r
            if (hotelRevenueMap[hotelId]) {
            
            } else {
                // Nếu khách sạn không có trong map, thêm một entry mới với doanh thu là 0 và tên của khách sạn
                hotelRevenueMap[hotelId] = {
                    hotelId: hotelId,
                    hotelName: hotelName,
                    userOwner:user.email,
                    createdAt:hotel.createdAt,
                    totalRevenue: 0
                };
            }
        }));

        // Chuyển object thành mảng và trả về
        const hotelRevenue = Object.values(hotelRevenueMap);
        res.status(200).json(hotelRevenue);
    } catch (error) {
        next(error);
    }
}
