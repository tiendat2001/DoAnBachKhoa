import express from "express"
import { createClosedRoom } from "../controllers/closedRoom.js"
import { getAllClosedRoom,deleteAllClosedRoom } from "../controllers/closedRoom.js"
const router = express.Router()

//  CREATE CLOSE ROOM FOR 1 TIME
router.post("/:roomTypeId",createClosedRoom)

//GET ALL CLOSE ROOM
router.get("/",getAllClosedRoom)


//DELETE ALL CLOSED ROOM
router.delete("/",deleteAllClosedRoom)

export default router