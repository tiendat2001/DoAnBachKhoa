import express from "express"
import { createClosedRoom } from "../controllers/closedRoom.js"
import { getAllClosedRoom,deleteAllClosedRoom,testAPI,deleteClosedRoomById,getAllClosedRoomByRoomTypeId } from "../controllers/closedRoom.js"
import { verifyAdmin,verifyUserModifyHotel,verifyToken } from "../utils/verifyToken.js";
const router = express.Router()

//  CREATE CLOSE ROOM FOR 1 TIME
router.post("/:roomTypeId",verifyToken,createClosedRoom)

//GET  CLOSE ROOM by req.user.id, BY ROOMtypeId
router.get("/:roomTypeId",verifyToken,getAllClosedRoomByRoomTypeId)

// GET ALL CLOSEROOM -TEST
router.get("/",verifyToken,getAllClosedRoom)


//DELETE ALL CLOSED ROOM
router.delete("/",deleteAllClosedRoom)

// DELETE BY ID
router.delete("/:id",deleteClosedRoomById)

// TEST
router.get("/test/:id",testAPI)
export default router