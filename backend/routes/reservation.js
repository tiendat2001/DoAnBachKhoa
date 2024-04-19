import express from "express"
import { createReservation ,getReservations,updateReservation,deleteAllReservations,getAllHotelRevenue} from "../controllers/reservation.js"
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

router.get("/getAllRevenueHotel",getAllHotelRevenue)
export default router