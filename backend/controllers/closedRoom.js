import ClosedRoom from "../models/ClosedRoom.js";
export const createClosedRoom = async (req, res, next) => {
    req.body.ownerId = req.user.id; // Thêm ownerId từ req.user.id
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

  // DELETE ALL CLOSE ROOM
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

  // DELETE CLOSE ROOM BY ID
  export const deleteClosedRoomById = async (req, res, next) => {
    try {
        await ClosedRoom.findByIdAndDelete(req.params.id);
        res.status(200).json("DELETE SUCCESSFUL");
    } catch (error) {
        throw error;
    }
}






  /// phần test


  let testAPILocks = {}; // Lưu trữ biến khóa cho mỗi giá trị id

  function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  export const testAPI = async (req, res, next) => {
      try {
          const id = req.params.id;
  
          // Kiểm tra xem có yêu cầu khác đang được xử lý với cùng giá trị id không
          while (testAPILocks[id]) {
              // Chờ 1 giây trước khi kiểm tra lại
              await delay(1000); // Chờ 1 giây
          }
  
          // Đặt biến khóa để đánh dấu rằng yêu cầu với giá trị id này đang được thực thi
          testAPILocks[id] = true;
  
          // Sử dụng hàm setTimeout để tạm dừng việc thực hiện trong 5 giây
          setTimeout(() => {
              // Sau 5 giây, trả về kết quả "kết thúc"
              console.log("dat")
              res.status(200).json("kết thúc");
  
              // Giải phóng biến khóa sau khi hoàn thành
              delete testAPILocks[id];
          }, 10000); // 5 giây = 5000 milliseconds
      } catch (error) {
          // Nếu có lỗi xảy ra, giải phóng biến khóa và chuyển giao cho middleware xử lý lỗi
          delete testAPILocks[id];
          next(error);
      }
  };
// Hàm delay chờ 1 giây
