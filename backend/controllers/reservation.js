import Reservation from "../models/Reservation.js";
import Hotel from "../models/Hotel.js"
import User from "../models/User.js"
import Room from "../models/RoomType.js"
import { startOfMonth, endOfMonth, subMonths,addHours,subHours  } from 'date-fns';

export const createReservation = async (req, res, next) => {
    const newReservation = new Reservation(req.body)

    try {

        const savedReservation = await newReservation.save()
        res.status(200).json(savedReservation)
    } catch (err) {
        next(err)
    }
}

// lấy đơn đặt theo điều kiện
export const getReservations = async (req, res, next) => {
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

export const updateReservation = async (req, res, next) => {
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


export const deleteAllReservations = async (req, res, next) => {
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
        const reservations = await Reservation.find({ status: true });

        // Tạo một object để lưu trữ tổng doanh thu của từng khách sạn
        const hotelRevenueMap = {};

        await Promise.all(reservations.map(async (reservation) => {
            const hotelId = reservation.hotelId;
            const hotel = await Hotel.findById(hotelId);
            const user = await User.findById(hotel.ownerId);
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
                        userOwner: user.email,
                        totalRevenue: totalPrice,
                        createdAt: hotel.createdAt
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
            const user = await User.findById(hotel.ownerId);
            // Nếu khách sạn có trong map thì đc add bên trên r
            if (hotelRevenueMap[hotelId]) {

            } else {
                // Nếu khách sạn không có trong map, thêm một entry mới với doanh thu là 0 và tên của khách sạn
                hotelRevenueMap[hotelId] = {
                    hotelId: hotelId,
                    hotelName: hotelName,
                    userOwner: user.email,
                    createdAt: hotel.createdAt,
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

export const getRevenueByHotelId = async (req, res, next) => {
    try {
        // Lấy tất cả các đơn đặt phòng
        const reservations = await Reservation.find({ status: true, hotelId: req.params.hotelId });
        let totalRevenue = 0;
        let totalGuests = 0;
        const totalOrders = reservations.length;
        // số lượng bán từng loại phòng
        const soldRooms = {};

        // tìm loại phòng bán nhiều nhất
        let maxSoldRoomType = '';
        let maxSoldRoomCount = 0;

        // Lặp qua từng đơn đặt phòng và tính tổng doanh thu và số lượng khách
        for (const reservation of reservations) {
            // Lặp qua từng roomNumbersId trong reservation
            for (const roomNumbersId of reservation.roomNumbersId) {
                // Tìm loại phòng và lấy ra tên loại phòng
                const room = await Room.findOne({ "roomNumbers._id": roomNumbersId });
                const roomType = room ? room.title : 'Unknown';

                // Tăng số lượng phòng được bán cho loại phòng này
                if (soldRooms[roomType]) {
                    soldRooms[roomType]++;
                } else {
                    soldRooms[roomType] = 1;
                }

                // Cập nhật loại phòng bán được nhiều nhất
                if (soldRooms[roomType] > maxSoldRoomCount) {
                    maxSoldRoomType = roomType;
                    maxSoldRoomCount = soldRooms[roomType];
                }
            }

            // Tính tổng doanh thu và số lượng khách
            totalRevenue += reservation.totalPrice;
            totalGuests += reservation.guest.adult + reservation.guest.children;
        }
        // Trả về kết quả
        res.status(200).json({
            totalRevenue: totalRevenue,
            totalGuests: totalGuests,
            totalOrders: totalOrders,
            soldRooms: soldRooms,
            maxSoldRoomType: maxSoldRoomType,
            maxSoldRoomCount: maxSoldRoomCount
        });
    } catch (error) {
        next(error);
    }
}

// doanh thu theo tung thang
export const getRevenueMonthsByHotelId = async (req, res, next) => {
    try {
        const currentDate = addHours(new Date(), 7);
        // console.log(currentDate.getMonth())
        const revenueByMonth = [];
        // console.log(currentDate)
        for (let i = 1; i < 7; i++) {
            // nhìn cho giống GMT
             // nếu sau ko add khi đẩy xuống thì bỏ mấy cái addHours
            const startDate = addHours(startOfMonth(subMonths(currentDate, i)),7);
            const endDate = addHours(endOfMonth(subMonths(currentDate, i)), 7);
             // start đang mặc định là 17hUTC của ngày nó đặt
             // tháng 3 ngày bắt đầu 2024-03-01T00:00:00.000Z, kết thúc 2024-03-31T23:59:59.999Z
            const revenue = await Reservation.aggregate([
                {
                    $match: {
                        hotelId: req.params.hotelId,
                        status:true, // ID của khách sạn
                       
                        start: {
                            $gte: startDate, // Ngày bắt đầu của tháng
                            $lte: endDate // Ngày kết thúc của tháng
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' } // Tính tổng doanh thu
                    }
                }
            ]);
            const monthRevenue = {
                month: startDate.getMonth() + 1,
                year: startDate.getFullYear(), //Trong JavaScript, tháng được đánh số từ 0 đến 11, với tháng 0 là tháng 1 và tháng 11 là tháng 12
                revenue: revenue.length > 0 ? revenue[0].totalRevenue : 0 // Doanh thu của tháng
            };

            revenueByMonth.push(monthRevenue);
        }

        res.status(200).json(revenueByMonth);
    } catch (error) {
        next(error);
    }
}