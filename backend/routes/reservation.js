import express from "express"
import { createReservation ,getReservations,updateReservation} from "../controllers/reservation.js"
const router = express.Router();

//CREATE
router.post("/", createReservation);

//GET
router.get("/",getReservations)

//PUT
router.put("/:id",updateReservation)

export default router