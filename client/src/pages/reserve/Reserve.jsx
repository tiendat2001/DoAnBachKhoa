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

import { useLocation } from "react-router-dom";
const Reserve = () => {
  const location = useLocation();
  const [selectedRooms, setSelectedRooms] = useState(location.state.selectedRooms);
  const [alldates, setAlldates] = useState(location.state.alldates);
  const [hotelId, setHotelId] = useState(location.state.hotelId);

  const { data:roomData, loading, error } = useFetch(`/rooms/${hotelId}`);
  // const [totalPrice, setTotalPrice] = useState(0);
  var  totalPrice=0;
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
      totalPrice=totalPrice+room.price
      if (roomCounts[room.title]) {
        roomCounts[room.title]++;
      } else {
        roomCounts[room.title] = 1;
      }
    }
  });

  // Tạo chuỗi detailRooms từ roomCounts
  const detailRooms = Object.entries(roomCounts).map(([title, count]) => `${title} x(${count})`).join(', ');

  // In ra kết quả
  // console.log(roomCounts);
  // console.log(detailRooms);
  // console.log(totalPrice);



  return (
    <div>
      <Navbar />
      <Header type="list" />
      <h1>{totalPrice}</h1>
      <h1>{detailRooms}</h1>
      <h1></h1>
    </div>
  );
};

export default Reserve;