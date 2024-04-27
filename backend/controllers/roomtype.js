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

    // chỉnh sửa lại giá thấp nhất của khách sạn ( phòng người dùng đổi giá phòng)
    const hotelId = hotelToUpdate._id
    const cheapestRoom = await Room.findOne({ hotelId }).sort({ price: 1 }).limit(1);
    await Hotel.findByIdAndUpdate(hotelId, {
      cheapestPrice: {
        price: cheapestRoom.price,
        people: cheapestRoom.maxPeople
      }
    });

    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

// khi đặt phòng
export const updateRoomAvailability = async (req, res, next) => {
  try {
    const room = await Room.findOne({ "roomNumbers._id": req.params.id });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const roomNumber = room.roomNumbers.find(number => number._id.toString() === req.params.id);

    if (!roomNumber) {
      return res.status(404).json({ error: "Room number not found" });
    }

    const { unavailableDates } = roomNumber;
    // kiểm tra có 2 người đặt cùng 1 phòng nhỏ
    const duplicateDates = req.body.dates.filter(date => {
      const dateString = new Date(date).toISOString();
      return unavailableDates.some(unavailableDate => unavailableDate.toISOString() === dateString);
    });

    if (duplicateDates.length > 0) {
      return res.status(400).json({ error: "Some dates are already marked as unavailable" });
    }
    const { startDateRange, endDateRange } = req.body;
    //Nếu không có ngày nào trùng lặp, thêm các ngày mới vào mảng unavailableDates
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": { $each: req.body.dates }
        },
        $addToSet: {
          "roomNumbers.$.unavailableRangeDates": { startDateRange, endDateRange }
        }
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
    if (cheapestRoom) {
      // Nếu cheapestRoom được tìm thấy
      await Hotel.findByIdAndUpdate(hotelId, {
        cheapestPrice: {
          price: cheapestRoom.price,
          people: cheapestRoom.maxPeople
        }
      });
    } else {
      // Nếu cheapestRoom không được tìm thấy
      await Hotel.findByIdAndUpdate(hotelId, {
        cheapestPrice: {
          price: 0,
          people: 0
        }
      });
    }

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
// hàm lấy allDates
const getDatesInRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const date = new Date(start.getTime());
  const dates = [];
  while (date < end) {
    dates.push(new Date(date).getTime());
    date.setDate(date.getDate() + 1);
  }
  return dates;
};
// hủy phòng
export const cancelRoomReservation = async (req, res, next) => {
  try {
    console.log("bat dau")
    const { startDateRange, endDateRange } = req.body.unavailableRangeDates;
    //   // lấy ra typeRoom to
    let room = await Room.findOne({ "roomNumbers._id": req.params.id });
    if (!room) {
      return res.status(404).json("Room not found");
    }

     // chỉnh điều kiện chỗ này, lấy ra roomNumber là 1 json phòng nhỏ
      let roomNumberCurrent = null;
      for (let i = room.roomNumbers.length - 1; i >= 0; i--) {
        const roomNumberData = room.roomNumbers[i];
        console.log("lặp")
        if (roomNumberData.unavailableRangeDates && roomNumberData.unavailableRangeDates.length > 0) {
          // console.log(roomNumberData)
            const matchingDateRange = roomNumberData.unavailableRangeDates.find(dateRange => 
              dateRange.startDateRange.toISOString() == startDateRange && 
              dateRange.endDateRange.toISOString() == endDateRange);

            if (matchingDateRange) {
              roomNumberCurrent = roomNumberData;
                break; // Thoát khỏi vòng lặp khi tìm thấy phần tử cần
            }
        }
    }
    console.log(roomNumberCurrent)
    // const roomNumberCurrent = room.roomNumbers.find(number => number._id.toString() === req.params.id);
    // kiểm tra xem unAvai phòng đấy bị đẩy đi chưa
    let matchingDateRange = roomNumberCurrent.unavailableRangeDates.find(dateRange =>
      dateRange.startDateRange.toISOString() == startDateRange &&
      dateRange.endDateRange.toISOString() == endDateRange);

    if (matchingDateRange) console.log("phòng hiện tại có avai để đẩy")



    if (!roomNumberCurrent) {
      return res.status(404).json("Room number not found");
    }

    // tim cac phan tu can xoa trong mang
    const indexesToRemove = [];
    req.body.dates.forEach(date => {
      const index = roomNumberCurrent.unavailableDates.findIndex(roomDate => roomDate.toISOString() === date);
      if (index !== -1) {
        indexesToRemove.push(index);
      }
    });

    if (indexesToRemove.length > 0) {
      // Loại bỏ các phần tử khỏi mảng nếu tìm thấy, chỉ giữ lại phần tử ko thuộc indexesToRemove
      const newUnavailableDates = roomNumberCurrent.unavailableDates.filter((_, index) => !indexesToRemove.includes(index));
      roomNumberCurrent.unavailableDates = newUnavailableDates;
      
    } else { return res.status(400).json("None of these dates are marked as unavailable"); }
    room.markModified('roomNumbers');
    await room.save();
    
    // đẩy dateRange
    // let roomModifiedDateRange = null
    room = await Room.findOneAndUpdate(
      { "roomNumbers._id": roomNumberCurrent._id },
      {
        $pull: {
          "roomNumbers.$.unavailableRangeDates": {
            startDateRange,
            endDateRange
          }
        }
      },
      { new: true }
    );

    // await roomModifiedDateRange.save();
    room.markModified('roomNumbers');
    await room.save();
    console.log("check")
    console.log(roomNumberCurrent)
    // sau khi đẩy các ptu ở vị trí hiện tại, bắt đầu check
    // let alldates;
    // alldates = getDatesInRange(startDateRange, endDateRange);
    // let test = alldates.map(date=>new Date(date))
    // console.log(test)
    let alldates;
    let roomNumberLoop = null;
    const roomNumberCurrentIndex = room.roomNumbers.findIndex(number => number._id.toString() === req.params.id);
    // tìm các phần tử ở dưới phần tử roomNumberCurrent

    let roomNumberToReplace = null;
    let dateRangeToReplace = null;
    let allDatesToReplace = null;
    for (let i = room.roomNumbers.length - 1; i > roomNumberCurrentIndex; i--) {
      const roomNumberData = room.roomNumbers[i];

      if (roomNumberData.unavailableRangeDates && roomNumberData.unavailableRangeDates.length > 0) {
        // với mỗi phần tử roomData duyệt unavaiDateRange của nó
        const matchingDateRange = roomNumberData.unavailableRangeDates.find(dateRange => {
          const alldatesRoomNumberData = getDatesInRange(dateRange.startDateRange, dateRange.endDateRange);
          let unavailableDatesTimestamp = roomNumberCurrent.unavailableDates.map(date => new Date(date).getTime());

          // Nếu không có bất kỳ timestamp nào trong alldatesRoomNumberData tồn tại trong unavailableDatesTimestamp
          if (!unavailableDatesTimestamp.some(date => alldatesRoomNumberData.includes(date))) {
            // Lưu dateRange vào biến dateRangeToReplace và dừng vòng lặp
            dateRangeToReplace = dateRange;
            return true;
          }

        });

        // có thể đẩy unavai lên trên
        if (matchingDateRange) {
          console.log("Có phòng ở dưới thỏa mãn đẩy đc lên trên")
          roomNumberToReplace = roomNumberData;
          allDatesToReplace = getDatesInRange(dateRangeToReplace.startDateRange, dateRangeToReplace.endDateRange);
          break;
        }

      }
    }

    // đẩy unavai đấy lên với roomNumberToReplace,allDatesToReplace
    if (roomNumberToReplace) {
      const { startDateRange, endDateRange } = dateRangeToReplace;
      // console.log(startDateRangeToReplace)
      // console.log(endDateRangeToReplace)
      // console.log(roomNumberToReplace)
      await Room.updateOne(
        { "roomNumbers._id": roomNumberCurrent._id },
        {
          $push: {
            "roomNumbers.$.unavailableDates": { $each: allDatesToReplace }
          },
          $addToSet: {
            "roomNumbers.$.unavailableRangeDates": { startDateRange, endDateRange }
          }
        }
      );

      // xóa dateRange, unavai thằng replace
      const indexesToRemoveToReplace = [];
      const convertedDates = allDatesToReplace.map(timestamp => new Date(timestamp));
      // console.log(convertedDates);
      // console.log(roomNumberToReplace.unavailableDates);
      
      convertedDates.forEach(dateTest => {
        const indexTest = roomNumberToReplace.unavailableDates.findIndex(roomDateTest => roomDateTest.toISOString() === dateTest.toISOString());
        console.log(indexTest);
        if (indexTest !== -1) {
          indexesToRemoveToReplace.push(indexTest);
        }
      });

      if (indexesToRemoveToReplace.length > 0) {
        // Loại bỏ các phần tử khỏi mảng nếu tìm thấy, chỉ giữ lại phần tử ko thuộc indexesToRemove
        // console.log("dattttt")
        // console.log(roomNumberToReplace)
        const newUnavailableDates = roomNumberToReplace.unavailableDates.filter((_, index) => !indexesToRemoveToReplace.includes(index));
        roomNumberToReplace.unavailableDates = newUnavailableDates;
        // console.log("hien tai")
        // console.log(roomNumberCurrent)
      } else { return res.status(400).json("None of these dates are marked as unavailable"); }
      await room.save();
      // console.log("sau khi save")
      // console.log(roomNumberCurrent)
      // đẩy dateRange
     
      const roomModifiedDateRangeTwo = await Room.findOneAndUpdate(
        { "roomNumbers._id": roomNumberToReplace._id },
        {
          $pull: {
            "roomNumbers.$.unavailableRangeDates": {
              startDateRange,
              endDateRange
            }
          }
        },
        { new: true }
      );

      await roomModifiedDateRangeTwo.save();



    }



    res.status(200).json("Room reservation has been canceled successfully.");
  } catch (err) {
    next(err);
  }
};
