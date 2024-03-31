import express from "express"
import Hotel from "../models/Hotel.js" // phai co .js
import {createHotel, deleteHotel,getHotelById,  getHotels, updateHotel,countByCity,countByType ,getHotelRoomsType} from "../controllers/hotel.js";
import { verifyAdmin, verifyUser,verifyToken,verifyUserModifyHotel } from "../utils/verifyToken.js";

const router = express.Router()
//CREATE
router.post("/",createHotel);
//UPDATE
router.put("/:id",verifyUserModifyHotel, updateHotel); // trong body API sẽ có id của chủ sở hữu, so sánh nó token hiện tại
//DELETE
router.delete("/:id",verifyUserModifyHotel,deleteHotel);
//GET
router.get("/find/:id", getHotelById);
//GETALL
router.get("/", getHotels);

router.get("/countByCity", countByCity); // để ý api này sẽ bị nhầm với api get by id nếu ở trên ko ghi thêm chữ find

router.get("/countByType", countByType); // để ý api này sẽ bị nhầm với api get by id nếu ở trên ko ghi thêm chữ find

// lấy danh sách type room trong hotel theo hotel id
router.get("/room/:id",getHotelRoomsType)
export default router