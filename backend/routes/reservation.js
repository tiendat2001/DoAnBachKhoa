import express from "express"
import { createReservation ,getReservations,updateReservation,deleteAllReservations} from "../controllers/reservation.js"
const router = express.Router();

//CREATE
router.post("/", createReservation);

//GET
router.get("/",getReservations)

//PUT
router.put("/:id",updateReservation)


//DELETE ALL 
router.delete("/",deleteAllReservations)
export default router