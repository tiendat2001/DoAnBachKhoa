
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { format, addDays, subHours } from "date-fns";
import { toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
const Reserve = () => {
  const location = useLocation();
  const [selectedRooms, setSelectedRooms] = useState(location.state.selectedRoomIds);
  const [alldates, setAlldates] = useState(location.state.alldates);
  const [hotelId, setHotelId] = useState(location.state.hotelId);
  const [startDate, setStartDate] = useState(location.state.startDate);
  const [endDate, setEndDate] = useState(location.state.endDate);
  const searchContext = useContext(SearchContext);
  const [options, setOptions] = useState(searchContext.options);
  const [roomsDetailFromListClient, setRoomsDetailFromListClient] = useState(location.state.seletedRoomIdsReserved)
  const { user } = useContext(AuthContext)
  const { data: roomData, loading, error, reFetch } = useFetch(`/rooms/${hotelId}`);
  const { data: hotelData, loading: hotelLoading, error: hotelError } = useFetch(`/hotels/find/${hotelId}`);
  const [reFreshRoomData, setReFreshRoomData] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [paymentType, setPaymentType] = useState();
  const [isSending, setIsSending] = useState(false);
  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  console.log(paymentType)
  var totalPrice = 0;
  var maxPeople = 0;
  // console.log(startDate)
  // lấy ra id roomType cùng số lượng - dùng để cho vào reservation - để thống kê sau này
  const roomTypeIdsReserved = roomsDetailFromListClient.map(room => ({
    roomTypeId: room.roomTypeId,
    quantity: room.quantity
  }));
  // console.log(roomTypeIdsReserved)

  const isAvailable = (roomNumber) => {
    if (!roomNumber.status) {
      return false; // Nếu status là false, room không khả dụng
    }
    const isFound = roomNumber.unavailableDates.some((date) => {
      const dateMinusOneDay = new Date(date).getTime(); // theem getTIme() hay ko cung v
      // console.log(new Date(dateMinusOneDay));
      return alldates.includes(dateMinusOneDay);
    });

    return !isFound;
  };
  const roomCounts = {};

  // Tính số lượng của từng loại phòng
  selectedRooms.forEach(roomId => {
    // với mỗi _id phòng nhỏ thì tìm typeRoom tương ứng
    const room = roomData.find(room => room.roomNumbers.some(rn => rn._id == roomId));
    if (room) {
      totalPrice = totalPrice + room.price
      maxPeople = maxPeople + room.maxPeople
      if (roomCounts[room.title]) {
        roomCounts[room.title]++;
      } else {
        roomCounts[room.title] = 1;
      }
    }
  });

  // Tạo chuỗi detailRooms từ roomCounts
  const detailRooms = Object.entries(roomCounts).map(([title, count]) => `${title} (x${count})`).join(', ');
  const selectedRoomIdsReserved = []
  // đặt phòng
  const reserveRoom = async () => {
    setIsSending(true)
    // check lại các trường
    if (!paymentType || !phoneNumber) {
      toast.error("Vui lòng nhập đầy đủ thông tin thanh toán")
      setIsSending(false)
      return;
    }

    // selectedRoomIdsReserved.length = 0; // reset lại mảng
    // await Promise.all(roomsDetailFromListClient.map(async (roomDetail) => {

    //   //
    //   const { roomTypeId, quantity } = roomDetail; // Lấy ra roomNumbers và quantity từ mỗi phần tử
    //   let selectedQuantity = 0; // Số lượng phòng đã chọn
    //   const response = await fetch(`/rooms/${hotelId}`);
    //   const reFreshRoomData = await response.json();
    //   const foundRoom = reFreshRoomData.find(room => room._id == roomTypeId);

    //   //Duyệt qua mỗi phần tử trong mảng roomNumbers
    //   foundRoom.roomNumbers.forEach(roomNumber => {
    //     // Kiểm tra xem phòng có sẵn không 
    //     if (isAvailable(roomNumber)) {
    //       // Nếu phòng có sẵn và số lượng phòng đã chọn chưa đạt tối đa
    //       if (selectedQuantity < quantity) {
    //         selectedRoomIdsReserved.push(roomNumber._id); // Thêm roomNumber vào mảng selectedRoomIdsReserved
    //         selectedQuantity++; // Tăng số lượng phòng đã chọn lên 1
    //       } else {
    //         return; // Nếu đã đủ số lượng, thoát khỏi vòng lặp
    //       }
    //     }
    //   });
    // }));

    // const totalQuantity = roomsDetailFromListClient.reduce((acc, roomDetail) => acc + roomDetail.quantity, 0);
    // console.log(totalQuantity)
    // if (selectedRoomIdsReserved.length !== totalQuantity) {
    //   alert("Phòng đã hết! Vui lòng quay lại trang đặt phòng")
    //   return; // Thoát khỏi hàm nếu số lượng phòng đã chọn không đủ
    // }
    // console.log(selectedRoomIdsReserved)

    // Đẩy available
    try {
      // await Promise.all(
      //   selectedRoomIdsReserved.map(async (roomId) => {
      //     try {
      //       const res = await axios.put(`/rooms/availability/${roomId}`, {
      //         dates: alldates,
      //         startDateRange: startDate,
      //         endDateRange: endDate,
      //       });

      //       return res.data;
      //     } catch (error) {
      //       console.log(error);
           
      //     }
      //   })
      // );
      // const copiedRoomIds = [...selectedRoomIdsReserved];
      const res = await axios.put(`/rooms/availability/`, {
        roomTypeIdsReserved:roomTypeIdsReserved,
        dates: alldates,
        startDateRange: startDate,
        endDateRange: endDate,
        // hotelId: hotelId,
      });
    } catch (err) {
      console.log(err)
      toast.error(err.response.data.message)
      setIsSending(false)
      return; // Ngưng thực thi hàm nếu có lỗi
    }
    // tạo order
    let reservationId = ""
    try {
      const newReservation = await axios.post(`/reservation`, {
        // username: user.username,
        phoneNumber: phoneNumber,
        start: startDate,
        end: endDate,
        // roomNumbersId: selectedRoomIdsReserved,
        roomTypeIdsReserved: roomTypeIdsReserved,
        roomsDetail: detailRooms,
        guest: { adult: options.adult, children: options.children },
        allDatesReserve: alldates,
        totalPrice: totalPrice * alldates.length,
        hotelId: hotelId,
        idOwnerHotel: hotelData.ownerId,
        status: -1,
        // hotelName: hotelData.name,
        // hotelContact:hotelData?.hotelContact
      });
      // lấy id của đơn đặt phòng vừa tạo
      reservationId = newReservation.data._id;

    } catch (err) {
      console.log(err)
      return;
    }

    toast.success('Đi đến trang thanh toán');

    // chuyển hướng thanh toán VNPAY
    try {
      const response = await axios.post('/payment/create_payment_url', {
        reservationId: reservationId,
        amount: totalPrice * alldates.length * 1000,
        paymentType: paymentType
      });
      let paymentUrl = response.data; // Giả sử API trả về link thanh toán trong trường 'paymentUrl'
      const startIndex = paymentUrl.indexOf('https://');
      // Cắt bỏ phần URL trước "https://" và lấy phần sau
      paymentUrl = paymentUrl.substring(startIndex);
      // chuyển hướng link thanh toán
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error creating payment:', error);
      // Xử lý lỗi nếu cần
    }

    setIsSending(false)
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />

      <div className="ReserveContainer">
        <h1>Thông tin đặt phòng</h1>
        {/* chứa thông tin khách sạn đang đặt */}
        <div className="ReserveHotelContainer">
          <img src={hotelData.photos?.[0]} alt="" className="reserveImg" />

          <div style={{ width: '65%' }}>
            <div style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '10px', lineHeight: '30px' }}>{hotelData.name}</div>
            <div>Địa chỉ: {hotelData.address}</div>
          </div>
        </div>

        <div style={{
          width: '100%', backgroundColor: '#d5eefd', boxSizing:'border-box', alignContent: 'center',
          fontWeight: 'bold', fontSize: '25px', padding: '10px'
        }}>  Chi tiết đặt phòng của bạn</div>
        
        <div className="ReserveDetailContainer">
          <div>Thời gian nhận phòng:  {startDate.toLocaleString('vi-VN')}</div>
          <div>Thời gian trả phòng:  {subHours(endDate,2).toLocaleString('vi-VN')}</div>
          <div>(Thời gian được tính theo múi giờ hiện tại máy của bạn)</div>
          <div>Tổng thời gian lưu trú:  {alldates.length} đêm</div>
          <div style={{ fontWeight: 'bold' }}>Phòng của bạn:  {detailRooms} </div>
          <div style={{ fontWeight: 'bold' }}>Số người: {options.adult} người lớn và {options.children} trẻ em</div>
          {(options.adult + options.children * 0.5) - maxPeople >= 2 && (
            <div style={{ fontWeight: 'bold', color: 'red' }}>
              (Phòng của bạn có thể không chứa đủ người)
            </div>
          )}
          <div style={{ fontWeight: 'bold' }}>
            Tổng giá: {new Intl.NumberFormat('vi-VN').format(totalPrice * alldates.length * 1000)} VND
          </div>


        </div>

        <div style={{
          width: '100%', backgroundColor: '#d5eefd', boxSizing:'border-box', alignContent: 'center',
          fontWeight: 'bold', fontSize: '25px', padding: '10px'
        }}>  Thông tin thanh toán</div>

        <div className="ReservePaymentContainer">
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
            {/* input nhập số điện thoại */}
            <label htmlFor="phone">Nhập số điện thoại của bạn:</label>
            <input
              type="text"
              id="phone"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </div>

          {/* nhập hình thức thanh toán */}
          <div>Chọn hình thức thanh toán</div>
          <div className="label_paymentMethod">
            <input
              type="radio"
              name="paymentType"
              value="VNBANK"
              // checked={paymentType === "VNBANK"}
              onChange={handlePaymentTypeChange}
            />
            Thanh toán thẻ ATM nội địa
          </div>
          <div className="label_paymentMethod">
            <input
              type="radio"
              name="paymentType"
              value="INTCARD"
              // checked={paymentType === "INTCARD"}
              onChange={handlePaymentTypeChange}
            />
            Thanh toán thẻ VISA
          </div>



        </div>

        <button onClick={reserveRoom} className="rButton" disabled={isSending}>
          {isSending ? 'Đang xử lý...' : 'Thanh toán'}
          
        </button>

      </div>

    </div>
  );
};

export default Reserve;