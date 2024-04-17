import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
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
  const [selectedRooms, setSelectedRooms] = useState(location.state.selectedRooms);
  const [alldates, setAlldates] = useState(location.state.alldates);
  const [hotelId, setHotelId] = useState(location.state.hotelId);
  const [startDate, setStartDate] = useState(location.state.startDate);
  const [endDate, setEndDate] = useState(location.state.endDate);
  const searchContext = useContext(SearchContext);
  const [options, setOptions] = useState(searchContext.options);

  const { user } = useContext(AuthContext)

  // console.log(new Date(startDate))

  const { data: roomData, loading, error } = useFetch(`/rooms/${hotelId}`);
  const { data: hotelData, loading: hotelLoading, error: hotelError } = useFetch(`/hotels/find/${hotelId}`);

  // const [totalPrice, setTotalPrice] = useState(0);
  var totalPrice = 0;
  var maxPeople = 0;

  // console.log(selectedRooms)
  // const [detailRooms, setdetailRooms]=useSt
  // alldates.forEach(timestamp => {
  //      console.log(new Date(timestamp));

  // });

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

  // In ra kết quả
  // console.log(roomCounts);
  // console.log(detailRooms);
  console.log(maxPeople);

  // đặt phòng
  const reserveRoom = async () => {
    console.log("dat")
    // cộng 1 ngày để hiển thị trong csdl đúng
    const allDatesPlus = alldates.map(date => addDays(date, 1));
    const startDatePlus = addDays(startDate, 1)
    const endDatePlus = addDays(endDate, 1)

    // tạo order
    try {

      const upload = axios.post(`/reservation`, {
        username: user.username,
        phoneNumber: "32423424",
        start: startDatePlus,
        end: endDatePlus,
        roomNumbersId: selectedRooms,
        roomsDetail: detailRooms,
        guest: {adult:options.adult,children:options.children},
        allDatesReserve: allDatesPlus,
        totalPrice: totalPrice,
        hotelId: hotelId,
        idOwnerHotel: hotelData.ownerId,
        hotelName: hotelData.name,
        hotelContact:hotelData?.hotelContact
      });
    } catch (err) {
      console.log(err)
    }

    // DAY UNAVAILABLEDATE
     try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: allDatesPlus,
          });
          return res.data;
        })
      );


    } catch (err) {
      console.log(err)
    }
    toast.success('Đặt phòng thành công');

  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {/* <h1>{totalPrice*alldates.length}</h1>
      <h1>{detailRooms}</h1>
      <h1>So dem: {alldates.length} </h1>
      <h1>Hotel id {hotelId}</h1>
      <h1>{startDate.toLocaleDateString('vi-VN')}</h1> */}
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
          <div style={{ fontWeight: 'bold' }}>Tổng giá:  {totalPrice * alldates.length}</div>


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