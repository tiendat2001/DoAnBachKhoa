import express from "express"
const router = express.Router()
import $ from "jquery";
import moment from "moment";
import config from "config";
import querystring from "qs"
import crypto from "crypto"
import Reservation from "../models/Reservation.js";
import Room from "../models/RoomType.js"
import axios from 'axios';
import request from "request"
router.post("/create_payment_url", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;


  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnpUrl = config.get("vnp_Url");
  let returnUrl = config.get("vnp_ReturnUrl");
  // bth 3 tham so nay lay tu req.body
  let orderId = req.body.reservationId;
  let amount = req.body.amount;
  let bankCode = req.body.paymentType; //INTCARD

  let locale = "vn";
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  // TRẢ VỀ LÀ 1 HTML
  res.set("Content-Type", "text/html");
  res.send(JSON.stringify(vnpUrl));
});

router.get("/vnpay_return", function (req, res, next) {
  console.log("dat")
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  // let config = require("config");
  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");

  // let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  // let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    // const orderId = req.query.vnp_TxnRef;
    // con.connect(function (err) {
    //   if (err) throw err;
    //   const sql = "UPDATE `order` SET state = ? WHERE order_id = ?";
    //   con.query(sql, ["banked", orderId.toString()]);
    //   con.end();
    // });

    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
});

router.get("/vnpay_ipn", async function (req, res, next) {
  console.log("gọi ipn")
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let orderId = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  // let config = require("config");
  let secretKey = config.get("vnp_HashSecret");
  // let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  // let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == "00") {
            console.log("gd thanhf cong")
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            const updatedReservation = await Reservation.findByIdAndUpdate(
              orderId, 
              { status: 1 },
              { new: true } 
            );
            // res.status(200).json({ RspCode: "00", Message: "Success" });

            // tự viết
            res.redirect("http://localhost:3000/statusTransaction/success");
            // console.log("dfsdf")
            // res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            console.log("gd that bai")
            // res.redirect("http://localhost:3000");
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            try {
               const reservationToDelete = await Reservation.findById(orderId);
               for (const roomTypeId of reservationToDelete.roomTypeIdsReserved) {
                for (var i = 0; i < roomTypeId.quantity; i++) {
                  try {
                    const res = await axios.put(`http://localhost:8800/api/rooms/cancelAvailability/${roomTypeId.roomTypeId}`, {
                      dates: reservationToDelete.allDatesReserve,
                      unavailableRangeDates:{
                        startDateRange:reservationToDelete.start,
                        endDateRange:reservationToDelete.end
                      }
                    });
                    // console.log(`Room ${roomId} updated successfully.`);
                  } catch (err) {
                    console.log(err);
                  
                  }
                }
              }




              // ĐẨY AVAILABLE
              // const reservationToDelete = await Reservation.findById(orderId);
              // console.log(reservationToDelete.start)
              // console.log(reservationToDelete.end)
              // console.log(reservationToDelete.allDatesReserve)
              // console.log(reservationToDelete.roomTypeIdsReserved)

              // //roomTypeIdsReserved gồm roomTypeId và quantity (mỗi roomTypeId nhỏ chứa 2 thuộc tính trên)
              // for (const roomTypeId of reservationToDelete.roomTypeIdsReserved) {
              //   for (var i = 0; i < roomTypeId.quantity; i++) {
              //     try {
              //       console.log("bat dau vong for")
              //       // console.log(roomTypeId.roomTypeId)
              //       // const { startDateRange, endDateRange } = req.body.unavailableRangeDates;
              //       const startDateRange = reservationToDelete.start
              //       const endDateRange = reservationToDelete.end
              //       //   // lấy ra typeRoom to
              //       let room = await Room.findById(roomTypeId.roomTypeId);
              //       if (!room) {
              //         return res.status(404).json("Room not found");
              //       }

              //       // chỉnh điều kiện chỗ này, lấy ra roomNumber là 1 json phòng nhỏ
              //       let roomNumberCurrent = null;
              //       for (let i = room.roomNumbers.length - 1; i >= 0; i--) {
              //         console.log(startDateRange)
              //         console.log(endDateRange)
              //         const roomNumberData = room.roomNumbers[i];
              //         console.log(roomNumberData)
              //         console.log("lặp")
              //         if (roomNumberData.unavailableRangeDates && roomNumberData.unavailableRangeDates.length > 0) {
              //           // console.log(roomNumberData)
              //           const matchingDateRange = roomNumberData.unavailableRangeDates.find(dateRange =>
              //             dateRange.startDateRange.toISOString() == startDateRange &&
              //             dateRange.endDateRange.toISOString() == endDateRange);

              //           if (matchingDateRange) {
              //             roomNumberCurrent = roomNumberData;
              //             break; // Thoát khỏi vòng lặp khi tìm thấy phần tử cần
              //           }
              //         }
              //       }
              //       console.log(roomNumberCurrent)
              //       if (!roomNumberCurrent) {
              //         return res.status(400).json("Không tìm thấy roomNumberCurrent phù hợp");
              //       }
              //       // const roomNumberCurrent = room.roomNumbers.find(number => number._id.toString() === req.params.id);
              //       // kiểm tra xem unAvai phòng đấy bị đẩy đi chưa
              //       let matchingDateRange = roomNumberCurrent.unavailableRangeDates.find(dateRange =>
              //         dateRange.startDateRange.toISOString() == startDateRange &&
              //         dateRange.endDateRange.toISOString() == endDateRange);

              //       if (matchingDateRange) console.log("phòng hiện tại có avai để đẩy")





              //       // tim cac phan tu can xoa trong mang
              //       const indexesToRemove = [];
              //       reservationToDelete.allDatesReserve.forEach(date => {
              //         const index = roomNumberCurrent.unavailableDates.findIndex(roomDate => roomDate.toISOString() === date);
              //         if (index !== -1) {
              //           indexesToRemove.push(index);
              //         }
              //       });

              //       if (indexesToRemove.length > 0) {
              //         // Loại bỏ các phần tử khỏi mảng nếu tìm thấy, chỉ giữ lại phần tử ko thuộc indexesToRemove
              //         const newUnavailableDates = roomNumberCurrent.unavailableDates.filter((_, index) => !indexesToRemove.includes(index));
              //         roomNumberCurrent.unavailableDates = newUnavailableDates;

              //       } else { return res.status(400).json("None of these dates are marked as unavailable"); }
              //       room.markModified('roomNumbers');
              //       await room.save();

              //       // đẩy dateRange
              //       // let roomModifiedDateRange = null
              //       room = await Room.findOneAndUpdate(
              //         { "roomNumbers._id": roomNumberCurrent._id },
              //         {
              //           $pull: {
              //             "roomNumbers.$.unavailableRangeDates": {
              //               startDateRange,
              //               endDateRange
              //             }
              //           }
              //         },
              //         { new: true }
              //       );

              //       // await roomModifiedDateRange.save();
              //       room.markModified('roomNumbers');
              //       await room.save();
              //       console.log("check")
              //       console.log(roomNumberCurrent)
              //       // sau khi đẩy các ptu ở vị trí hiện tại, bắt đầu check
              //       // let alldates;
              //       // alldates = getDatesInRange(startDateRange, endDateRange);
              //       // let test = alldates.map(date=>new Date(date))
              //       // console.log(test)
              //       let alldates;
              //       let roomNumberLoop = null;
              //       const roomNumberCurrentIndex = room.roomNumbers.findIndex(number => number._id.toString() == roomNumberCurrent._id);
              //       console.log(roomNumberCurrentIndex)
              //       // tìm các phần tử ở dưới phần tử roomNumberCurrent

              //       let roomNumberToReplace = null;
              //       let dateRangeToReplace = null;
              //       let allDatesToReplace = null;
              //       for (let i = room.roomNumbers.length - 1; i > roomNumberCurrentIndex; i--) {
              //         const roomNumberData = room.roomNumbers[i];

              //         if (roomNumberData.unavailableRangeDates && roomNumberData.unavailableRangeDates.length > 0) {
              //           // với mỗi phần tử roomData duyệt unavaiDateRange của nó
              //           const matchingDateRange = roomNumberData.unavailableRangeDates.find(dateRange => {
              //             const alldatesRoomNumberData = getDatesInRange(dateRange.startDateRange, dateRange.endDateRange);
              //             let unavailableDatesTimestamp = roomNumberCurrent.unavailableDates.map(date => new Date(date).getTime());

              //             // Nếu không có bất kỳ timestamp nào trong alldatesRoomNumberData tồn tại trong unavailableDatesTimestamp
              //             if (!unavailableDatesTimestamp.some(date => alldatesRoomNumberData.includes(date))) {
              //               // Lưu dateRange vào biến dateRangeToReplace và dừng vòng lặp
              //               dateRangeToReplace = dateRange;
              //               return true;
              //             }

              //           });

              //           // có thể đẩy unavai lên trên
              //           if (matchingDateRange) {
              //             console.log("Có phòng ở dưới có unavai thỏa mãn đẩy đc lên trên")
              //             roomNumberToReplace = roomNumberData;
              //             allDatesToReplace = getDatesInRange(dateRangeToReplace.startDateRange, dateRangeToReplace.endDateRange);
              //             break;
              //           }

              //         }
              //       }

              //       // đẩy unavai,range đấy lên với roomNumberToReplace,allDatesToReplace vào chỗ currentRoomNumber
              //       if (roomNumberToReplace) {
              //         const { startDateRange, endDateRange } = dateRangeToReplace;
              //         // console.log(startDateRangeToReplace)
              //         // console.log(endDateRangeToReplace)
              //         // console.log(roomNumberToReplace)
              //         await Room.updateOne(
              //           { "roomNumbers._id": roomNumberCurrent._id },
              //           {
              //             $push: {
              //               "roomNumbers.$.unavailableDates": { $each: allDatesToReplace }
              //             },
              //             $addToSet: {
              //               "roomNumbers.$.unavailableRangeDates": { startDateRange, endDateRange }
              //             }
              //           }
              //         );

              //         // xóa dateRange, unavai thằng replace
              //         const indexesToRemoveToReplace = [];
              //         const convertedDates = allDatesToReplace.map(timestamp => new Date(timestamp));
              //         // console.log(convertedDates);
              //         // console.log(roomNumberToReplace.unavailableDates);

              //         convertedDates.forEach(dateTest => {
              //           const indexTest = roomNumberToReplace.unavailableDates.findIndex(roomDateTest => roomDateTest.toISOString() === dateTest.toISOString());
              //           // console.log(indexTest);
              //           if (indexTest !== -1) {
              //             indexesToRemoveToReplace.push(indexTest);
              //           }
              //         });

              //         if (indexesToRemoveToReplace.length > 0) {
              //           // Loại bỏ các phần tử khỏi mảng nếu tìm thấy, chỉ giữ lại phần tử ko thuộc indexesToRemove
              //           // console.log("dattttt")
              //           // console.log(roomNumberToReplace)
              //           const newUnavailableDates = roomNumberToReplace.unavailableDates.filter((_, index) => !indexesToRemoveToReplace.includes(index));
              //           roomNumberToReplace.unavailableDates = newUnavailableDates;
              //           // console.log("hien tai")
              //           // console.log(roomNumberCurrent)
              //         } else { return res.status(400).json("None of these dates are marked as unavailable"); }
              //         await room.save();
              //         // console.log("sau khi save")
              //         // console.log(roomNumberCurrent)
              //         // xóa dateRange thằng replace

              //         const roomModifiedDateRangeTwo = await Room.findOneAndUpdate(
              //           { "roomNumbers._id": roomNumberToReplace._id },
              //           {
              //             $pull: {
              //               "roomNumbers.$.unavailableRangeDates": {
              //                 startDateRange,
              //                 endDateRange
              //               }
              //             }
              //           },
              //           { new: true }
              //         );

              //         await roomModifiedDateRangeTwo.save();

              //       }


              //     } catch (err) {
              //       next(err);
              //     }
              //   }
              // }
              // // đẩy available
              // console.log("ket thuc vong for")


             // xóa reservation
              const reservation = await Reservation.findByIdAndDelete(orderId);


            } catch (err) {
              next(err);
            }
            res.redirect("http://localhost:3000/statusTransaction/fail");
            // res.status(200).json({ RspCode: "00", Message: "Success" });

          }
        }
        // xuống dưới đây tức paymentStatus khác 0, tức nó chạy 1 trong 2 th trên r
        else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
});

router.post("/querydr", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  let config = require("config");
  let crypto = require("crypto");

  let vnp_TmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnp_Api = config.get("vnp_Api");

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "querydr";
  let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let currCode = "VND";
  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;

  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };
  // /merchant_webapi/api/transaction
  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      console.log(response);
    }
  );
});

router.post("/refund", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  // let config = require("config");
  // let crypto = require("crypto");
  console.log("refund")
  let vnp_TmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnp_Api = config.get("vnp_Api");

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate =  moment(date).format("YYYYMMDDHHmmss");
  let vnp_Amount = req.body.amount * 100;
  
  let vnp_TransactionType = "03"

  let vnp_CreateBy = req.body.user;

  let currCode = "VND";

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "refund";
  let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let vnp_TransactionNo = "0";

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TransactionType +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_Amount +
    "|" +
    vnp_TransactionNo +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateBy +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TransactionType: vnp_TransactionType,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Amount: vnp_Amount,
    vnp_TransactionNo: vnp_TransactionNo,
    vnp_CreateBy: vnp_CreateBy,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };
  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      console.log(response);
    }
  );
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export default router