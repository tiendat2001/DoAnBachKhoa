import React from 'react'
import "./listBooking.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import { useState, useContext } from "react";
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
import { AuthContext } from '../../context/AuthContext';
import { format,addDays,subDays   } from "date-fns";
import { confirmAlert } from 'react-confirm-alert';

const ListBooking = () => {
  const { user } = useContext(AuthContext)
  const { data, loading, error, reFetch } = useFetch(
    `/reservation?username=${user.username}`
  );
  // console.log(data)
  
  const handleCancelReserve = async (allDatesReserve, roomNumbersId) => {
    // console.log(allDatesReserve)
    // console.log(roomNumbersId)
    confirmAlert({
      title: 'Xác nhận hủy',
      message: 'Bạn có chắc chắn muốn hủy đơn đặt phòng này? Bạn không thể hoàn tác sau khi hủy',
      buttons: [
          {
              label: 'Yes',
              onClick: () => {
                  
                    deleteAvailability(allDatesReserve,roomNumbersId);
              }
          },
          {
              label: 'No',
              onClick: () => {
                  // Không làm gì cả
              }
          }
      ]
  });

    
  }
  
  // bỏ unavailabledates trong mỗi phòng đặt
  const deleteAvailability = async (allDatesReserve, roomNumbersId)=>{
    try {
      await Promise.all(
        roomNumbersId.map((roomId) => {
          const res = axios.put(`/rooms/cancelAvailability/${roomId}`, {
            dates: allDatesReserve,
          });
          return res.data;
        })
      );


    } catch (err) {
      console.log(err)
    }
    alert("Hủy phòng thành công")

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
                <div>Ngày trả phòng: {new Date(subDays(new Date(item.end), 1)).toLocaleDateString('vi-VN')}</div>

              </div>

              <button className="cancel_booking" onClick={() => handleCancelReserve(item.allDatesReserve, item.roomNumbersId)}>Hủy đặt phòng</button>

            </div>
          ))
        )}


      </div>


    </div>
  )
}

export default ListBooking
