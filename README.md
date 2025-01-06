# DoAnBachKhoa
1. Thiết lập môi trường
 - Cài đặt nodejs 16.17.1
 - Tại file backend/.evn, ghi đường dẫn kết nối đến cơ sở dữ liệu MongoDB của bạn
 - Đăng ký tài khoản VNPAY test (nếu chưa có) tại link https://sandbox.vnpayment.vn/devreg/, sau khi đăng ký
   vào email để lấy mã vnp_TmnCode và vnp_HashSecret, và ghi vào trong file backend/config/default.json
 - Để lưu trữ ảnh: tạo tài khoản cloudinary(nếu chưa có) và điền link upload ảnh của bạn tại 
   file backend/controllers/closedRoom.js, dòng số 121 (để lấy thiết lập link vào settings/Upload 
   trong tài khoản cloudinary của bạn)	
 - Để sử dụng chức năng gửi email: vào link https://myaccount.google.com/apppasswords để thiết lập mật khẩu
   ứng dụng, sau đó điền mật khẩu vào trong file backend/controllers/reservation.js, dòng 525
 
2. Khởi động chương trình
 - Tại thư mục backend, gõ lệnh npm install, sau đó npm start để khởi chạy server tại cổng 8800
 - Tại thư mục backend, gõ lệnh npm install, sau đó npm start để khởi chạy website tại cổng 3000
 
