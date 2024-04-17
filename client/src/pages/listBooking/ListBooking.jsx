import React from 'react'
import "./listBooking.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import { useState, useContext } from "react";
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
import { AuthContext } from '../../context/AuthContext';
import { format, addDays, subDays,subHours  } from "date-fns";
import { confirmAlert } from 'react-confirm-alert';

const ListBooking = () => {
  const { user } = useContext(AuthContext)
  const { data, loading, error, reFetch } = useFetch(
    `/reservation?username=${user.username}`
  );
  // console.log(data)

  const handleCancelReserve = async (allDatesReserve, roomNumbersId,reservationId) => {
    // console.log(allDatesReserve)
    // console.log(roomNumbersId)
    confirmAlert({
      title: 'Xác nhận hủy',
      message: 'Bạn có chắc chắn muốn hủy đơn đặt phòng này? Bạn không thể hoàn tác sau khi hủy.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {

            deleteAvailability(allDatesReserve, roomNumbersId,reservationId);
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
  const deleteAvailability = async (allDatesReserve, roomNumbersId,reservationId) => {
    console.log(reservationId)
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

    // chỉnh lại trạng thái
    try{
      await axios.put(`/reservation/${reservationId}`,{
        status: false
      })
    }catch(err){
      console.log(err)
    }


    alert("Hủy phòng thành công")
    reFetch()

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
          data.map((item, index) => (
            <div key={index} className="flex_div_booking">
              <div className="booking_details">
                <div>Mã đặt phòng: {item._id}</div>
                <div>Khách sạn đặt: {item.hotelName}</div>
                <div>Phòng đặt: {item.roomsDetail}</div>
                <div>Ngày nhận phòng: 14h ngày {new Date(subDays(new Date(item.start), 1)).toLocaleDateString('vi-VN')}</div>
                <div>Ngày trả phòng: 12h ngày {new Date(subDays(new Date(item.end), 1)).toLocaleDateString('vi-VN')}</div>
                <div>Tình trạng: {item.status ? "Thành công" : "Hủy"}</div>

              </div>

              <div style={{width:'25%',display:'flex',justifyContent:'flex-end',flexWrap:'wrap'}}>
                <button className="cancel_booking" onClick={() => handleCancelReserve(item.allDatesReserve, item.roomNumbersId,item._id)}
                  disabled={(new Date() > subHours(new Date(item.start), 34))||!item.status}>Hủy đặt phòng</button> <br/>
                {/* ngày hiện tại phải lớn hơn (ngày nhận phòng -1) mới đc hủy nên kia là trừ 2, nếu chặt chẽ 14h trưa nhận phòng
                 thì +14h, tức trừ 48-14=34h */}
                <div style={{textAlign:'right'}}>{new Date() > subHours(new Date(item.start), 34) ? "(Bạn chỉ có thể hủy trước ngày nhận phòng 1 ngày)" : ""}</div>
              </div>

            </div>
          ))
        )}


      </div>


    </div>
  )
}

export default ListBooking
