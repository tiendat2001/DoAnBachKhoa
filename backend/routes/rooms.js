import express from "express"
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom, updateRoomAvailability } from "../controllers/roomtype.js";
import { verifyAdmin,verifyUserModifyHotel } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/:hotelid",  createRoom);
//UPDATE avai
router.put("/availability/:id", updateRoomAvailability);

// UPDATE ROOM
router.put("/:id", verifyUserModifyHotel, updateRoom);
//DELETE
router.delete("/:id", verifyUserModifyHotel, deleteRoom);
//GET ROOM TYPE BY ID
router.get("/:id", getRoom);
//GETALL
router.get("/", getRooms);

export default router