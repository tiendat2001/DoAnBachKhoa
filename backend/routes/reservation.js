import express from "express"
import { createReservation } from "../controllers/reservation.js"
const router = express.Router();

//CREATE
router.post("/",  createReservation);


export default router