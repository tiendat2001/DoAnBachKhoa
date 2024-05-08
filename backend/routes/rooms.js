import express from "express"
import { createRoom, deleteRoom, getRoomsByHotelId, getRooms, updateRoom, updateRoomAvailability,getRoomById,cancelRoomReservation,statusRoomCount, addRoomToRoomType, deleteRoomInRoomType} from "../controllers/roomtype.js";
import { verifyAdmin,verifyUserModifyHotel,verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/:hotelid", verifyUserModifyHotel, createRoom);
//UPDATE avai
router.put("/availability/:id", updateRoomAvailability);

router.put("/cancelAvailability/:id", cancelRoomReservation); // id ở đây là id của typeRoom phòng lớn



// UPDATE ROOM
router.put("/:id", verifyToken, updateRoom);
// THÊM PHÒNG NHỎ VÀO LOẠI PHÒNG
router.put("/addRoomToRoomType/:roomId", addRoomToRoomType);
// XÓA PHÒNG NHỎ
router.put("/deleteRoomInRoomType/:roomId", deleteRoomInRoomType);


//DELETE ROOM
router.delete("/:id", verifyToken, deleteRoom);
//GET ROOM TYPE BY HOTEL ID
router.get("/:hotelid", getRoomsByHotelId);

//GET ROOM BY ROOM ID
router.get("/find/:roomid", getRoomById);

//GETALL
router.get("/", getRooms);

// GET STATUS ROOM NEXT 30 DAYS
router.get("/statusRoomCount/:roomId",statusRoomCount)




export default router