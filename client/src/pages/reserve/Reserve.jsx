
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
import { format, addDays, subDays } from "date-fns";
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
  var totalPrice = 0;
  var maxPeople = 0;
  // console.log(startDate)
  
  const isAvailable = (roomNumber) => {
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
  const selectedRoomIdsReserved=[]
  // đặt phòng
  const reserveRoom = async () => {
   
    selectedRoomIdsReserved.length = 0; // reset lại mảng
    await Promise.all(roomsDetailFromListClient.map(async (roomDetail) => {

      //
      const { roomTypeId, quantity } = roomDetail; // Lấy ra roomNumbers và quantity từ mỗi phần tử
      let selectedQuantity = 0; // Số lượng phòng đã chọn
      const response = await fetch(`/rooms/${hotelId}`);
      const reFreshRoomData = await response.json();
      const foundRoom = reFreshRoomData.find(room => room._id == roomTypeId);

      //Duyệt qua mỗi phần tử trong mảng roomNumbers
      foundRoom.roomNumbers.forEach(roomNumber => {
          // Kiểm tra xem phòng có sẵn không 
          if (isAvailable(roomNumber)) {
              // Nếu phòng có sẵn và số lượng phòng đã chọn chưa đạt tối đa
              if (selectedQuantity < quantity) {
                  selectedRoomIdsReserved.push(roomNumber._id); // Thêm roomNumber vào mảng selectedRoomIdsReserved
                  selectedQuantity++; // Tăng số lượng phòng đã chọn lên 1
              } else {
                  return; // Nếu đã đủ số lượng, thoát khỏi vòng lặp
              }
          }
      });
  }));

  const totalQuantity = roomsDetailFromListClient.reduce((acc, roomDetail) => acc + roomDetail.quantity, 0);
  // console.log(totalQuantity)
  if(selectedRoomIdsReserved.length !== totalQuantity){
    alert("Phòng đã hết! Vui lòng quay lại trang đặt phòng")
    return; // Thoát khỏi hàm nếu số lượng phòng đã chọn không đủ
  }
  
    // return;
    console.log(selectedRoomIdsReserved)
  
    const allDatesPlus = alldates.map(date => addDays(date, 1));
    const startDatePlus = addDays(startDate, 1)
    const endDatePlus = addDays(endDate, 1)

    try {
      await Promise.all(
        selectedRoomIdsReserved.map(async (roomId) => {
          try {
            const res = await axios.put(`/rooms/availability/${roomId}`, {
              dates: alldates,
            });
           
            return res.data;
          } catch (error) {
            console.log(`Error in room ${roomId}:`, error);
            throw error; // Ném lỗi để kích hoạt catch bên ngoài và dừng quá trình xử lý
          }
        })
      );
    } catch (err) {
      console.log(err)
      alert("Có lỗi xảy ra vui lòng quay lại trang trước và đặt phòng lại")
      return; // Ngưng thực thi hàm nếu có lỗi
    }
    // tạo order
    try {
      const upload = axios.post(`/reservation`, {
        username: user.username,
        phoneNumber: "32423424",
        start: startDate,
        end: endDate,
        roomNumbersId: selectedRoomIdsReserved,
        roomsDetail: detailRooms,
        guest: {adult:options.adult,children:options.children},
        allDatesReserve: alldates,
        totalPrice: totalPrice * alldates.length,
        hotelId: hotelId,
        idOwnerHotel: hotelData.ownerId,
        // hotelName: hotelData.name,
        // hotelContact:hotelData?.hotelContact
      });
    } catch (err) {
      console.log(err)
      return;
    }
    
    toast.success('Đặt phòng thành công');
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
          width: '100%', backgroundColor: '#d5eefd', height: '30px', alignContent: 'center',
          fontWeight: 'bold', fontSize: '25px', padding: '10px'
        }}>  Chi tiết đặt phòng của bạn</div>
        <div className="ReserveDetailContainer">
          <div>Ngày nhận phòng: {startDate.toLocaleDateString('vi-VN')}</div>
          <div>Ngày trả phòng:    {endDate.toLocaleDateString('vi-VN')}</div>
          <div>Tổng thời gian lưu trú:  {alldates.length} đêm</div>
          <div style={{ fontWeight: 'bold' }}>Phòng của bạn:  {detailRooms} </div>
          <div style={{ fontWeight: 'bold' }}>Số người: {options.adult} người lớn và {options.children} trẻ em</div>
          {(options.adult + options.children*0.5) - maxPeople >= 2 && (
            <div style={{ fontWeight: 'bold', color: 'red' }}>
              (Phòng của bạn có thể không chứa đủ người)
            </div>
          )}
          <div style={{ fontWeight: 'bold' }}>
            Tổng giá: {new Intl.NumberFormat('vi-VN').format(totalPrice * alldates.length*1000)} VND
            </div>


        </div>

        <div style={{
          width: '100%', backgroundColor: '#d5eefd', height: '30px', alignContent: 'center',
          fontWeight: 'bold', fontSize: '25px', padding: '10px'
        }}>  Thông tin thanh toán</div>
        <div className="ReserveDetailContainer">
          <div>Bla</div>



        </div>

        <button onClick={reserveRoom} className="rButton">
          Đặt phòng
        </button>

      </div>

    </div>
  );
};

export default Reserve;