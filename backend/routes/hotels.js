import express from "express"
import Hotel from "../models/Hotel.js" // phai co .js
import {createHotel, deleteHotel,getHotelById,  getHotels, updateHotel } from "../controllers/hotel.js";

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
export default router