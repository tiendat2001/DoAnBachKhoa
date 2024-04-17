import React from 'react'
import "./listBooking.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import { useState, useContext } from "react";
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
import { AuthContext } from '../../context/AuthContext';
import { format,addDays,subDays   } from "date-fns";

const ListBooking = () => {
  const { user } = useContext(AuthContext)
  const { data, loading, error, reFetch } = useFetch(
    `/reservation?idOwnerHotel=${user._id}`
  );
  console.log(data)
  
  const handleCancel = async (allDatesReserve, roomNumbersId) => {
    console.log(allDatesReserve)
    console.log(roomNumbersId)


  }
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listBookingContainer">
        <h1>Đặt phòng của bạn</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((item,index) => (
            <div key={index} className="flex_div_booking">
              <div className="booking_details">
                <div>Mã đặt phòng: {item._id}</div>
                <div>Khách sạn đặt: {item.hotelName}</div>
                <div>Phòng đặt: {item.roomsDetail}</div>
                <div>Ngày nhận phòng: {new Date(subDays(new Date(item.start), 1)).toLocaleDateString('vi-VN')}</div>
                <div>Ngày nhận phòng: {new Date(subDays(new Date(item.end), 1)).toLocaleDateString('vi-VN')}</div>

              </div>

              <button onClick={() => handleCancel(item.allDatesReserve, item.roomNumbersId)}>Hủy</button>

            </div>
          ))
        )}


      </div>


    </div>
  )
}

export default ListBooking
