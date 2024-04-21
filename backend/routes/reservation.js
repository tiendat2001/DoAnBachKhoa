import express from "express"
import { createReservation ,getReservations,updateReservation,deleteAllReservations,getAllHotelRevenue,getRevenueByHotelId
} from "../controllers/reservation.js"
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
// GET ALL DOANH THU HOTEL
router.get("/getAllRevenueHotel",getAllHotelRevenue)

// GET DOANH THU TUNG HOTEL
router.get("/getRevenue/:hotelId",getRevenueByHotelId)
export default router