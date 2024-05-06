import express from "express"
import { createReservation ,getReservationsByAdmin,updateReservation,deleteAllReservations,
    getAllHotelRevenue,getRevenueByHotelId,getRevenueMonthsByHotelId,getAllReservations,getReservationsByClient
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
// GET ALL DOANH THU HOTEL CHO ADMIN
router.get("/getAllRevenueHotel",getAllHotelRevenue)  // cho theem verifyAdmin de chi admin goi api dc

// GET DOANH THU SO LIEU TUNG HOTEL
router.get("/getRevenue/:hotelId",getRevenueByHotelId)

// GET DOANH THU THEO THANG TUNG HOTEL
router.get("/getRevenueByMonths/:hotelId",getRevenueMonthsByHotelId)

export default router