import express from "express"
import { createRoom, deleteRoom, getRoomsByHotelId, getRooms, updateRoom, updateRoomAvailability,getRoomById,cancelRoomReservation,statusRoomCount, addRoomToRoomType} from "../controllers/roomtype.js";
import { verifyAdmin,verifyUserModifyHotel } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/:hotelid", verifyUserModifyHotel, createRoom);
//UPDATE avai
router.put("/availability/:id", updateRoomAvailability);

router.put("/cancelAvailability/:id", cancelRoomReservation);



// UPDATE ROOM
router.put("/:id", verifyUserModifyHotel, updateRoom);
router.put("/addRoomToRoomType/:roomId", addRoomToRoomType);


//DELETE
router.delete("/:id", verifyUserModifyHotel, deleteRoom);
//GET ROOM TYPE BY HOTEL ID
router.get("/:hotelid", getRoomsByHotelId);

//GET ROOM BY ROOM ID
router.get("/find/:roomid", getRoomById);

//GETALL
router.get("/", getRooms);

router.get("/statusRoomCount/:roomId",statusRoomCount)


export default router