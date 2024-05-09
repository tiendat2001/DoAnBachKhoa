import Room from "../models/RoomType.js";
import Hotel from "../models/Hotel.js";
import { startOfMonth, endOfMonth, subMonths, addHours, subHours,addDays } from 'date-fns';

// import Order from "../models/Order.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
  // có ownerId trong body, nhưng ko cho cái đấy vào newRoom
  const hotelId = req.params.hotelid; // cái _id trong Hotel
  const newRoom = new Room(req.body);

  try {
    const hotel = await Hotel.findById(hotelId);
    if (hotel.ownerId !== req.user.id) {
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

    if (hotelToUpdate.ownerId !== req.user.id) {
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

    if (hotelToUpdate.ownerId !== req.user.id) {
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
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json("Room not found");
    }

     // chỉnh điều kiện chỗ này, lấy ra roomNumber là 1 json phòng nhỏ
     // lọc từ dưới lên mảng roomNumbers, lấy ra phần tử có unavailableRangeDates phù hợp gán vào roomNumberCurrent
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
    if (!roomNumberCurrent) {
      return res.status(400).json("Không tìm thấy roomNumberCurrent phù hợp");
    }
    // const roomNumberCurrent = room.roomNumbers.find(number => number._id.toString() === req.params.id);
    // kiểm tra xem unAvai phòng đấy bị đẩy đi chưa
    let matchingDateRange = roomNumberCurrent.unavailableRangeDates.find(dateRange =>
      dateRange.startDateRange.toISOString() == startDateRange &&
      dateRange.endDateRange.toISOString() == endDateRange);

    if (matchingDateRange) console.log("phòng hiện tại có avai để đẩy")



   // Xóa dateRangeUnavailable và unavailableDates của roomNumberCurrent vừa tìm đc trong quá trình lặp ở trên

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
    const roomNumberCurrentIndex = room.roomNumbers.findIndex(number => number._id.toString() == roomNumberCurrent._id);
    console.log(roomNumberCurrentIndex)

    //Sau khi xóa unavailableDates và dateRangeUnavail,  tìm các phần tử ở dưới phần tử roomNumberCurrent để tìm liệu có phần tử nào thay thế

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

        // có phần tử ở dưới roomNumberCurrent có unavailableDates để xóa thay cho roomNumberCurrent
        if (matchingDateRange) {
          console.log("Có phòng ở dưới có unavai thỏa mãn đẩy đc lên trên")
          roomNumberToReplace = roomNumberData;
          allDatesToReplace = getDatesInRange(dateRangeToReplace.startDateRange, dateRangeToReplace.endDateRange);
          break;
        }

      }
    }

    // đẩy lại unavai,range đấy lên với roomNumberToReplace,allDatesToReplace vào chỗ currentRoomNumber  
    // (roomNumberToReplace là rỗng- tức ko có phần tử ở dưới nào thay đc thì ko cần làm gì tiếp)
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
        // console.log(indexTest);
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
      // xóa dateRange thằng replace
      
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


// so luong phong trong 30 ngay toi
export const statusRoomCount = async (req, res, next) => {
  try{
    const room = await Room.findById(req.params.roomId);

  const currentDate = addHours(new Date(), 7); // chuyển về thời gian hiện tại theo UTC
  // console.log(currentDate) 2024-04-30T12:16:05.871Z - time hiện tại nhưng UTC
  currentDate.setHours(14, 0, 0, 0);
  // console.log(currentDate) 2024-04-30T07:00:00.000Z
  const roomAvailability = [];

   // Lặp qua 30 ngày tiếp theo (tinnhs cả ngày hiện tại)
    for (let i = 0; i < 30; i++) {
      const currentDay = addDays(currentDate, i);
      const day = currentDay.getDate();
      const month = currentDay.getMonth() + 1;// Tháng bắt đầu từ 0
      const year = currentDay.getFullYear() 

      // Tìm số lượng phòng trống cho ngày hiện tại
      const availableRoomsCount = room.roomNumbers.reduce((count, roomNumber) => {
        const isRoomAvailable = roomNumber.status && !roomNumber.unavailableDates.some(date => {
          return new Date(date).toISOString().slice(0, 10) === currentDay.toISOString().slice(0, 10);
      });
        return isRoomAvailable ? count + 1 : count;
      }, 0);
      // số 0 là giá trị biến count khởi tạo

      // Thêm thông tin số lượng phòng trống vào mảng kết quả
      roomAvailability.push({ day, month, year,countAvailable: availableRoomsCount });
    }

    res.json(roomAvailability);
  } catch (error) {
    console.error("Error occurred while fetching room availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// thêm phòng nhỏ vào loại phòng
export const addRoomToRoomType = async (req, res, next) => {
  try {
    // Lấy ra thông tin phòng từ ID
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' });
    }
    // Số lượng phần tử cần thêm từ req.body
    const roomCountToAdd = req.body.roomCountToAdd;
    // Tạo số lượng phần tử rỗng tương ứng
    const emptyRooms = Array.from({ length: roomCountToAdd }, () => ({}));
    // Đẩy các phần tử rỗng vào mảng roomNumbers của room
    room.roomNumbers.push(...emptyRooms);
    // Lưu lại thông tin phòng sau khi cập nhật
    const updatedRoom = await room.save();

    res.status(200).json({ message: 'Đã thêm phòng thành công', room: updatedRoom });
  } catch (error) {
    console.error('Lỗi khi thêm phòng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm phòng' });
  }

}

// xóa phòng nhỏ cho loại phòng
export const deleteRoomInRoomType = async (req, res, next) => {
  try {
    // Lấy ra thông tin phòng từ ID
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' });
    }

    // Số lượng phần tử cần xóa từ req.body
    let roomCountToDelete = req.body.roomCountToDelete;
    // Duyệt qua mảng roomNumbers của room
    for (let i = 0; i < room.roomNumbers.length; i++) {
      const roomNumber = room.roomNumbers[i];
      // Kiểm tra ngày hiện tại có lớn hơn tất cả các phần tử trong mảng unavailableDates không
      const canDelete = roomNumber.unavailableDates.every(date => new Date() > new Date(date));
      // Nếu ngày hiện tại lớn hơn tất cả các ngày trong mảng, cho phép xóa
      if (canDelete) {
        // Xóa phần tử tại vị trí i khỏi mảng roomNumbers
        room.roomNumbers.splice(i, 1);
        i--; // Giảm chỉ số để không bỏ qua phần tử sau khi xóa
        roomCountToDelete--; // Giảm số lượng phần tử cần xóa
      }
      // Nếu số lượng phần tử cần xóa đã đạt được, thoát khỏi vòng lặp
      if (roomCountToDelete == 0) {
        break;
      }
    }
    // Lưu lại thông tin phòng sau khi xóa
    const updatedRoom = await room.save();
    res.status(200).json({ message: 'Đã xóa phòng thành công', room: updatedRoom });
  } catch (error) {
    console.error('Lỗi khi xóa phòng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa phòng' });
  }
};
