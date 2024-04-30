import ClosedRoom from "../models/ClosedRoom.js";
export const createClosedRoom = async (req, res, next) => {
    const newClosedRoom = new ClosedRoom(req.body)
    try {
        const savedClosedRoom = await newClosedRoom.save()
        res.status(200).json(savedClosedRoom)
    } catch (err) {
        next(err)
    }
    // console.log("d")
  }

  export const getAllClosedRoom = async (req, res, next) => {
    try {
        // Sử dụng phương thức find() để lấy tất cả các bản ghi của model ClosedRoom
        const closedRooms = await ClosedRoom.find();
    
        // Trả về danh sách các phòng đã đóng
        res.status(200).json(closedRooms);
    } catch (err) {
        next(err);
      }
  }

  
export const deleteAllClosedRoom = async (req, res, next) => {
    try {
      await ClosedRoom.deleteMany();
      // Trả về thông báo thành công
      res.status(200).json({ success: true, message: 'All closed rooms deleted successfully' });
    } catch (error) {
      // Nếu có lỗi, truyền lỗi đó cho middleware error handling
      next(error);
    }
  }