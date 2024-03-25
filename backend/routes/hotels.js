import express from "express"
import Hotel from "../models/Hotel.js" // phai co .js
import {createHotel, deleteHotel,getHotelById,  getHotels, updateHotel,countByCity } from "../controllers/hotel.js";
import { verifyAdmin, verifyUser,verifyToken } from "../utils/verifyToken.js";

const router = express.Router()
//CREATE
router.post("/",createHotel);
//UPDATE
router.put("/:id",updateHotel);
//DELETE
router.delete("/:id",deleteHotel);
//GET
router.get("/find/:id", getHotelById);
//GETALL
router.get("/", getHotels);

router.get("/countByCity", countByCity); // để ý api này sẽ bị nhầm với api get by id nếu ở trên ko ghi thêm chữ find

export default router