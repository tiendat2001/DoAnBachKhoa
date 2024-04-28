import express from "express"
import { createReservation ,getReservations,updateReservation,deleteAllReservations,
    getAllHotelRevenue,getRevenueByHotelId,getRevenueMonthsByHotelId
} from "../controllers/reservation.js"
import { verifyAdmin,verifyUserModifyHotel } from "../utils/verifyToken.js";
const router = express.Router();

//CREATE
router.post("/", createReservation);

//GET
router.get("/",getReservations)

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