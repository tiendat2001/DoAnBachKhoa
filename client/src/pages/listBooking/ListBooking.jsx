import React from 'react'
import "./listBooking.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import { useState, useContext } from "react";
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
import { AuthContext } from '../../context/AuthContext';
import { format, addDays, subDays, subHours } from "date-fns";
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
const ListBooking = () => {
  // const { user } = useContext(AuthContext)
  const { data, loading, error, reFetch } = useFetch(
    `/reservation/client`
  );

  const handleCancelReserve = async (allDatesReserve, roomNumbersId, reservationId, startDate, endDate, roomTypeIdsReserved) => {
    // console.log(allDatesReserve)
    // console.log(roomNumbersId)
    confirmAlert({
      title: 'Xác nhận hủy',
      message: 'Bạn có chắc chắn muốn hủy đơn đặt phòng này? Bạn không thể hoàn tác sau khi hủy.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteAvailability(allDatesReserve, roomNumbersId, reservationId, startDate, endDate, roomTypeIdsReserved);
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
  const deleteAvailability = async (allDatesReserve, roomNumbersId, reservationId, startDate, endDate, roomTypeIdsReserved) => {
    let hasError = false;
    // console.log(roomNumbersId)
    try {
      // for (const roomId of roomNumbersId) {
      //   try {
      //     const res = await axios.put(`/rooms/cancelAvailability/${roomId}`, {
      //       dates: allDatesReserve,
      //       unavailableRangeDates:{
      //         startDateRange:startDate,
      //         endDateRange:endDate
      //       }
      //     });
      //     console.log(`Room ${roomId} updated successfully.`);
      //   } catch (err) {
      //     console.error(`Error for room ${roomId}:`, err);
      //     hasError = true;
      //   }
      // }

      for (const roomTypeId of roomTypeIdsReserved) {
        for (var i = 0; i < roomTypeId.quantity; i++) {
          try {
            const res = await axios.put(`/rooms/cancelAvailability/${roomTypeId.roomTypeId}`, {
              dates: allDatesReserve,
              unavailableRangeDates: {
                startDateRange: startDate,
                endDateRange: endDate
              }
            });
            // console.log(`Room ${roomId} updated successfully.`);
          } catch (err) {
            console.error(err);
            hasError = true;
          }
        }
      }


    } catch (err) {
      console.error('Error:', err);
      hasError = true;
      // Handle any error occurred during the loop
    }

    // chỉnh lại trạng thái
    try {
      await axios.put(`/reservation/${reservationId}`, {
        status: 0
      })
    } catch (err) {
      hasError = true;
      console.log(err)
    }


    if (!hasError) {
      toast.success("Hủy phòng thành công");
    }
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
                <div style={{ fontWeight: 'bold' }}>Ngày nhận phòng:  {new Date(item.start).toLocaleString('vi-VN')}</div>
                <div style={{ fontWeight: 'bold' }}>Ngày trả phòng: {subHours(new Date(item.end),2).toLocaleString('vi-VN')}</div>
                <div>(Thời gian được tính theo múi giờ hiện tại máy của bạn)</div>
                <div style={{ color: item.status === 1 ? 'green' : item.status === 0 ? 'red' : 'blue',fontWeight: 'bold' }}>
                  Tình trạng: {item.status === 1 ? "Thành công" : item.status === 0 ? "Hủy" : "Đang chờ"}
                </div>
                <div>Thông tin liên lạc chỗ nghỉ: {item.hotelContact}</div>



              </div>

              <div style={{ width: '25%', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button className="cancel_booking" onClick={() => handleCancelReserve(item.allDatesReserve, item.roomNumbersId, item._id, item.start, item.end, item.roomTypeIdsReserved)}
                  disabled={(new Date() > subHours(new Date(item.start), 24)) || !item.status}>Hủy đặt phòng</button> <br />

                {/* <button className="cancel_booking" onClick={() => handleCancelReserve(item.allDatesReserve, item.roomNumbersId, item._id, item.start, item.end, item.roomTypeIdsReserved)}
                >Hủy đặt phòng</button>  */}
                <br />
                <div style={{ textAlign: 'right' }}>(Bạn chỉ có thể hủy trước thời gian nhận phòng 1 ngày (trước {subHours(new Date(item.start),24).toLocaleString('vi-VN')}))</div>
              </div>

            </div>
          ))
        )}


      </div>


    </div>
  )
}

export default ListBooking
