import Room from "../models/RoomType.js";
import Hotel from "../models/Hotel.js";
// import Order from "../models/Order.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  // có ownerId trong body, nhưng ko cho cái đấy vào newRoom
    const hotelId = req.params.hotelid; // cái _id trong Hotel
    const newRoom = new Room(req.body);
  
    try {
      const hotel = await Hotel.findById(hotelId);
      if (hotel.ownerId !== req.body.ownerId) {
        return res.status(403).json({ message: "You are not authorized to add room to this hotel" });
    }
      // GÁN TRƯỜNG HOTELID cho room mới tạo qua params truyền vào
      newRoom.hotelId = hotelId
      const savedRoom = await newRoom.save();
      try {
        await Hotel.findByIdAndUpdate(hotelId, { // tim hotel theo id, day room id của phòng mới tạo vào thuộc tính rooms trong hotel
          $push: { rooms: savedRoom._id },
        });

      const cheapestRoom = await Room.findOne({ hotelId }).sort({ price: 1 }).limit(1);

    // Update the hotel's cheapestPrice field with the cheapest room's price and maxPeople
      await Hotel.findByIdAndUpdate(hotelId, {
        cheapestPrice: {
        price: cheapestRoom.price,
        people: cheapestRoom.maxPeople
      }
    });
      } catch (err) {
        next(err);
      }
      res.status(200).json(savedRoom);
    } catch (err) {
      next(err);
    }
  };
  
  export const updateRoom = async (req, res, next) => {
    try {

      const roomToUpdate = await Room.findById(req.params.id)  // req.params.id là _id của type room sẽ chỉnh sửa
      // tìm id của hotel có room sẽ chỉnh sửa
      const hotelToUpdate = await Hotel.findById(roomToUpdate.hotelId);

      if (hotelToUpdate.ownerId !== req.body.ownerId) {
        return res.status(403).json({ message: "You are not authorized to update room to this hotel" });
    }
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedRoom);
    } catch (err) {
      next(err);
    }
  };
  export const updateRoomAvailability = async (req, res, next) => {
    try {
      await Room.updateOne(
        { "roomNumbers._id": req.params.id },
        {
          $push: {
            "roomNumbers.$.unavailableDates": req.body.dates
          },
        }
      );
      res.status(200).json("Room status has been updated.");
    } catch (err) {
      next(err);
    }
  };
  export const deleteRoom = async (req, res, next) => {
    // console.log("Dat")
    try {
      const roomToDelete = await Room.findById(req.params.id)  // req.params.id là _id của type room sẽ chỉnh sửa
      // tìm id của hotel có room sẽ chỉnh sửa
      const hotelToUpdate = await Hotel.findById(roomToDelete.hotelId);
      if (hotelToUpdate.ownerId !== req.body.ownerId) {
        return res.status(403).json({ message: "You are not authorized to delete room from this hotel" });
    }
      // xóa room và cập nhật lại trong Hotel
      const deleteRoom = await Room.findById(req.params.id);   // req.params.id là _id của type room sẽ chỉnh sửa
      await Room.findByIdAndDelete(req.params.id);
      try {
        await Hotel.findByIdAndUpdate(deleteRoom.hotelId, {
          $pull: { rooms: req.params.id },
        });
      } catch (err) {
        next(err);
      }

      // update price khi xóa phòng (đã test - còn trường hợp nếu ko còn phòng nào)
      const hotelId = hotelToUpdate._id
      const cheapestRoom = await Room.findOne({ hotelId }).sort({ price: 1 }).limit(1);   
      await Hotel.findByIdAndUpdate(hotelId, {
        cheapestPrice: {
        price: cheapestRoom.price,
        people: cheapestRoom.maxPeople
      }
    });
    
      res.status(200).json("Room has been deleted.");
    } catch (err) {
      next(err);
    }
  };

  //GET ROOM BY HOTEL ID
  export const getRoomsByHotelId = async (req, res, next) => {
    try {
      const rooms = await Room.find({ hotelId: req.params.hotelid });
      res.status(200).json(rooms);
    } catch (err) {
      next(err);
    }
  };

  // GET ALL ROOM
  export const getRooms = async (req, res, next) => {
    try {
      const rooms = await Room.find(); 
      res.status(200).json(rooms);
    } catch (err) {
      next(err);
    }
  };

  export const getRoomById = async (req, res, next) => {
    try {
      const room = await Room.findById(req.params.roomid);
      res.status(200).json(room);
    } catch (err) {
      next(err);
    }
  };