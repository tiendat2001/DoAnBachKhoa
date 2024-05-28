import Reservation from "../models/Reservation.js";
import Hotel from "../models/Hotel.js"
import User from "../models/User.js"
import Room from "../models/Room.js"
import { startOfMonth, endOfMonth, subMonths, addHours, subHours } from 'date-fns';
import { startOfToday } from "date-fns";
import nodemailer from "nodemailer"

export const createReservation = async (req, res, next) => {
    req.body.userId = req.user.id;
    const newReservation = new Reservation(req.body)
    try {
        const savedReservation = await newReservation.save()
        res.status(200).json(savedReservation)
    } catch (err) {
        next(err)
    }
}
// GET ALL RESERVATION
export const getAllReservations = async (req, res, next) => {
    try {
        // Lấy tất cả các đặt phòng từ cơ sở dữ liệu
        const reservations = await Reservation.find();
        res.status(200).json(reservations); // Trả về danh sách đặt phòng dưới dạng JSON
    } catch (err) {
        next(err); // Bắt lỗi và chuyển tiếp đến middleware xử lý lỗi tiếp theo
    }
}

// lấy đơn đặt theo điều kiện (theo idOwnerHotel- so sánh với req.user.id trong token, và theo khoảng ngày)
export const getReservationsByAdmin = async (req, res, next) => {
    try {
        const { startDay, endDay, ...query } = req.query;
        // console.log(startDay) 14h GMT+7
        // console.log(new Date(startDay)) 14h UTC
        let startDayRange;
        let endDayRange;
        const utcDate = new Date(Date.UTC(new Date(startDay).getUTCFullYear(), new Date(startDay).getUTCMonth(), new Date(startDay).getUTCDate(), 0, 0, 0, 0));
       
        // tìm kiếm theo idOwnerHotel - những đơn của chủ tài khoản (req.user.id lấy từ req.cookie do chạy middlewware verifyToken)
        query.idOwnerHotel = req.user.id;
        // Kiểm tra nếu startDay và endDay tồn tại trong req.query
        if (startDay && endDay) {
            // ở client gửi 14h GMT+7 nhưng ở đây console ra 14h giờ UTC, phải trừ đi 7h vì trong csdl lưu ngày là 7h UTC
            // startDayRange = subHours(new Date(startDay), 7);
            // endDayRange = subHours(new Date(endDay), 7);

            //nếu client chọn ngày 24 (bất kể múi giờ gì) thì 2024-05-24T00:00:00.000Z và 2024-05-24T23:59:59.999Z
            startDayRange = new Date(Date.UTC(new Date(startDay).getUTCFullYear(), new Date(startDay).getUTCMonth(), new Date(startDay).getUTCDate(), 0, 0, 0, 0));
            endDayRange = new Date(Date.UTC(new Date(endDay).getUTCFullYear(), new Date(endDay).getUTCMonth(), new Date(endDay).getUTCDate(), 23, 59, 59, 999));
        }
        // console.log(startDayRange)
        // console.log(endDayRange)
        let Reservations;
        if (startDayRange && endDayRange) {
            Reservations = await Reservation.find({
                ...query,
                start: {
                    $gte: startDayRange,
                    $lte: endDayRange
                }
            }).sort({ updatedAt: -1 });
        } else {
            // Nếu không có startDay và endDay, tìm kiếm reservations theo các điều kiện khác trong query
            Reservations = await Reservation.find(query).sort({ updatedAt: -1 });
        }
        // console.log(startDayRange)
        // console.log(endDayRange)
        // console.log(Reservations)
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
// LIST BOOKING
export const getReservationsByClient = async (req, res, next) => {
    try {
        // tìm kiếm theo userId-chủ đơn đặt phòng (req.user.id lấy từ req.cookie do chạy middlewware verifyToken)    
        const Reservations = await Reservation.find({
            userId: req.user.id
        }
        ).sort({ updatedAt: -1 });

        // console.log(startDayRange)
        // console.log(endDayRange)
        // console.log(Reservations)
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

        // check xem có đc update reservation đó không
        const reservationToUpdated = await Reservation.findByIdAndUpdate(req.params.id)
        if(req.user.id !== reservationToUpdated.userId){
            return res.status(403).json({ message: "Bạn ko có quyền update reservation này" });
        }

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
        const { month } = req.query
        const currentDate = addHours(new Date(), 7);
        // // tháng 3 thì ngày bắt đầu 2024-03-01T00:00:00.000Z, kết thúc 2024-03-31T23:59:59.999Z
        // khoảng ngày để tính doanh thu tháng trước
        const startDate = addHours(startOfMonth(subMonths(currentDate, 1)), 7);
        const endDate = addHours(endOfMonth(subMonths(currentDate, 1)), 7);

        let reservations;
        // chỉ tính doanh thu tháng trước
        if (month == -1) {
            reservations = await Reservation.find({
                status: 1,
                start: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
        } else {
            //tính doanh thu tất cả
            reservations = await Reservation.find({ status: 1 });
        }


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
                        paymentInfo: user.paymentInfo,
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
// KHOẢN TIỀN CẦN THANH TOÁN CHO TỪNG TÀI KHOẢN THÁNG TRC - ADMINISTRATOR
export const paymentAccountLastMonth = async (req, res, next) => {
    const currentDate = addHours(new Date(), 7);
    // // tháng 3 thì ngày bắt đầu 2024-03-01T00:00:00.000Z, kết thúc 2024-03-31T23:59:59.999Z
    // khoảng ngày để tính doanh thu tháng trước
    const startDateLastMonth = addHours(startOfMonth(subMonths(currentDate, 1)), 7);
    const endDateLastMonth = addHours(endOfMonth(subMonths(currentDate, 1)), 7);
    let reservations;
    reservations = await Reservation.find({
        status: 1,
        start: {
            $gte: startDateLastMonth,
            $lte: endDateLastMonth
        }
    });


    // nhóm theo idOnwerHotel và tính tổng giá
    const groupedReservations = await Reservation.aggregate([
        {
            $match: {
                status: 1,
                start: {
                    $gte: startDateLastMonth,
                    $lte: endDateLastMonth
                }
            }
        },
        {
            $group: {
                _id: "$idOwnerHotel", // Phân nhóm theo idOwnerHotel
                totalPrice: { $sum: "$totalPrice" } // Tính tổng totalPrice cho mỗi nhóm
            }
        },
        {
            $project: {
                _id: 0, // Loại bỏ trường _id được tạo ra từ phân nhóm
                idOwnerHotel: "$_id", // Đổi tên trường _id thành idOwnerHotel
                totalPrice: 1 // Giữ lại trường totalPrice
            }
        }
    ]);

    // thêm trường email cho kết quả tìm đc
    let enrichedReservations = [];
    for (let i = 0; i < groupedReservations.length; i++) {
        const reservation = groupedReservations[i];
        const user = await User.findById(reservation.idOwnerHotel);
        if (user) {
            const { email, paymentInfo } = user;
            enrichedReservations.push({
                totalPrice: reservation.totalPrice,
                idOwnerHotel: reservation.idOwnerHotel,
                email: email,
                paymentInfo: paymentInfo
            });
        }
    }
    res.status(200).json(enrichedReservations);
}

// statistic từng hotel
export const getRevenueByHotelId = async (req, res, next) => {
    try {
        // Kiểm tra có quyền xem ko
        const hotelToCheck = await Hotel.findById(req.params.hotelId);
        if (req.user.id !== hotelToCheck.ownerId && !req.user.isAdmin) {
            return res.status(403).json({ message: "Bạn ko có quyền xem số liệu hotel này" });
        }

        const { month } = req.query
        const currentDate = addHours(new Date(), 7);
        // // tháng 3 thì ngày bắt đầu 2024-03-01T00:00:00.000Z, kết thúc 2024-03-31T23:59:59.999Z
        // const startDateLastMonth = addHours(startOfMonth(subMonths(currentDate, 1)),7);
        // const endDateLastMonth = addHours(endOfMonth(subMonths(currentDate, 1)), 7);
        // const startDateCurrentMonth = addHours(startOfMonth(currentDate),7);
        // const endDateCurrentMonth = addHours(endOfMonth(currentDate),7);

        // // Lấy tất cả các đơn đặt phòng

        // const reservations = await Reservation.find(
        //     { status: true, 
        //       hotelId: req.params.hotelId,
        //     //   start: {
        //     //     $gte: startDateCurrentMonth, // Ngày bắt đầu của tháng
        //     //     $lte: endDateCurrentMonth // Ngày kết thúc của tháng
        //     // }
        //     });

        let startDate, endDate;

        // Kiểm tra giá trị của month
        if (month === '0') {
            startDate = null;
            endDate = null;
        } else if (month === '-1') {
            // Nếu month là -1, so sánh với tháng trước đó
            startDate = addHours(startOfMonth(subMonths(currentDate, 1)), 7);
            endDate = addHours(endOfMonth(subMonths(currentDate, 1)), 7);
        } else if (month === '1') {
            // Nếu month là 1, so sánh với tháng hiện tại
            startDate = addHours(startOfMonth(currentDate), 7);
            endDate = addHours(endOfMonth(currentDate), 7);
        }
        // Tạo một đối tượng chứa các điều kiện tìm kiếm
        const searchConditions = {
            status: 1,
            hotelId: req.params.hotelId
        };

        if (startDate && endDate) {
            searchConditions.start = {
                $gte: startDate,
                $lte: endDate
            };
        }
        // Tìm kiếm các đơn đặt phòng dựa trên searchConditions (theo tháng và theo hotelId)
        const reservations = await Reservation.find(searchConditions);

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
            for (const roomReserved of reservation.roomTypeIdsReserved) {
                // Tìm loại phòng và lấy ra tên loại phòng
                // const room = await Room.findOne({ "roomNumbers._id": roomNumbersId });
                // const roomType = room ? room.title : 'Unknown';

                // // Tăng số lượng phòng được bán cho loại phòng này
                // if (soldRooms[roomType]) {
                //     soldRooms[roomType]++;
                // } else {
                //     soldRooms[roomType] = 1;
                // }

                // // Cập nhật loại phòng bán được nhiều nhất
                // if (soldRooms[roomType] > maxSoldRoomCount) {
                //     maxSoldRoomType = roomType;
                //     maxSoldRoomCount = soldRooms[roomType];
                // }

                const { roomTypeId, quantity } = roomReserved;  // roomReserved là 1 trường gồm id của loại phòng cùng số lượng
                // lấy ra roomType to
                const roomType = await Room.findById(roomTypeId)
                const roomTypeName = roomType ? roomType.title : 'Unknown';; //  lấy tên loại phòng dành cho roomTypeId

                if (soldRooms[roomTypeName]) {
                    soldRooms[roomTypeName] += quantity;
                } else {
                    soldRooms[roomTypeName] = quantity;
                }
            }

            // Tính tổng doanh thu và số lượng khách
            totalRevenue += reservation.totalPrice;
            totalGuests += reservation.guest.adult + reservation.guest.children;
        }
        // Trả về kết quả
        res.status(200).json({
            // 3 ô trên biểu đồ
            totalRevenue: totalRevenue,
            totalGuests: totalGuests,
            totalOrders: totalOrders,

            soldRooms: soldRooms,
            // maxSoldRoomType: maxSoldRoomType,
            // maxSoldRoomCount: maxSoldRoomCount
        });
    } catch (error) {
        next(error);
    }
}

// doanh thu theo tung thang - BIEEU DO DUONG
export const getRevenueMonthsByHotelId = async (req, res, next) => {
    try {
        // Kiểm tra có quyền xem ko
        const hotelToCheck = await Hotel.findById(req.params.hotelId);
        if (req.user.id !== hotelToCheck.ownerId && !req.user.isAdmin) {
            return res.status(403).json({ message: "Bạn ko có quyền xem số liệu hotel này" });
        }

        const currentDate = addHours(new Date(), 7);
        // console.log(currentDate.getMonth())
        const revenueByMonth = [];
        // console.log(currentDate)
        for (let i = 0; i < 6; i++) {
            // nhìn cho giống GMT
            // nếu sau ko add khi đẩy xuống thì bỏ mấy cái addHours
            const startDate = addHours(startOfMonth(subMonths(currentDate, i)), 7);
            const endDate = addHours(endOfMonth(subMonths(currentDate, i)), 7);
            // start đang mặc định là 17hUTC của ngày nó đặt
            // tháng 3 ngày bắt đầu 2024-03-01T00:00:00.000Z, kết thúc 2024-03-31T23:59:59.999Z
            const revenue = await Reservation.aggregate([
                {
                    $match: {
                        hotelId: req.params.hotelId,
                        status: 1,

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

// send email
export const sendEmailStatusReservation = async (req, res, next) => {
    try {
        const userReserved = await User.findById(req.body.userId)
        console.log(userReserved.email)
        let emailContent=''
        if(!req.body.emailContent){
            emailContent=`Thông tin đặt phòng của bạn\nMã đặt phòng: ${req.body.reservationId}\nTổng giá: ${req.body.amount}\nNgày nhận phòng:${req.body.startDate}\nNgày trả phòng:${req.body.endDate}`
        } else  emailContent= req.body.emailContent


        // Tạo transporter sử dụng dịch vụ email, ở đây sử dụng Gmail làm ví dụ
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'clonetiendat@gmail.com', // Đổi thành email NGƯỜI GỬI
                pass: ''   //  app password
            }
        });

        // Cấu hình email
        let mailOptions = {
            from: 'clonetiendat@gmail.com', // Đổi thành email của bạn
            to: userReserved.email, // Đổi thành email người nhận
            subject: req.body.emailSubject,
            text: emailContent
        };

        // Gửi email
        let info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);
        res.status(200).json('Email sent successfully');
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).json('Error sending email');
    }
}