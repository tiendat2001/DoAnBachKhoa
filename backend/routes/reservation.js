import express from "express"
import { createReservation ,getReservationsByAdmin,updateReservation,deleteAllReservations,
    getAllHotelRevenue,getRevenueByHotelId,getRevenueMonthsByHotelId,getAllReservations,getReservationsByClient,paymentAccountLastMonth
} from "../controllers/reservation.js"
import { verifyAdmin,verifyUserModifyHotel,verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

//CREATE verify token để truyền vào userId sẽ lấy từ id của token trong cookie của request
router.post("/",verifyToken, createReservation);

//GET
router.get("/admin",verifyToken,getReservationsByAdmin) // ListReservation
router.get("/client",verifyToken,getReservationsByClient) // listBooking

//postman
router.get("/getall",getAllReservations)

//PUT
router.put("/:id",updateReservation)


//DELETE ALL 
router.delete("/",deleteAllReservations)


// doanh thu

// GET DOANH THU SO LIEU STATISTIC TUNG HOTEL
router.get("/getRevenue/:hotelId",verifyToken,getRevenueByHotelId)

// GET DOANH THU THEO THANG TUNG HOTEL - bieu do duong
router.get("/getRevenueByMonths/:hotelId",verifyToken,getRevenueMonthsByHotelId)

//ADMINISTRATOR
// GET ALL DOANH THU HOTEL CHO ADMINISTRATOR
router.get("/getAllRevenueHotel",getAllHotelRevenue)   // cho theem verifyAdmin de chi admin goi api dc

// TIỀN CẦN THANH TOÁN CHO TÀI KHOẢN THÁNG TRC
router.get("/getAllPaymentAccount",paymentAccountLastMonth)   // cho theem verifyAdmin de chi admin goi api dc

export default router