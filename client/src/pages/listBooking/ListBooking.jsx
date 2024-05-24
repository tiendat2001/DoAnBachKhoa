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
import { Link } from 'react-router-dom';
const ListBooking = () => {
  // const { user } = useContext(AuthContext)
  const { data, loading, error, reFetch } = useFetch(
    `/reservation/client`
  );

  const handleCancelReserve = async (allDatesReserve, roomNumbersId, reservationId, startDate, endDate, roomTypeIdsReserved,selectedReservation) => {
    let message=""
    // trong khoảng time 3 ngày trc ngày đặt thì bị tính phí đêm đầu
    if((new Date() > subHours(new Date(selectedReservation.start), 24*3))){
      message=`Bạn có chắc chắn muốn hủy đơn đặt phòng này? Bạn không thể hoàn tác sau khi hủy. Bạn mất phí hủy 
      (phí đêm đầu- ${new Intl.NumberFormat('vi-VN').format(selectedReservation.totalPrice/selectedReservation.allDatesReserve.length * 1000)} VND)
       nếu hủy đơn đặt này.`

    } else  message="Bạn có chắc chắn muốn hủy đơn đặt phòng này? Bạn không thể hoàn tác sau khi hủy. Bạn sẽ không mất phí hủy nếu hủy đơn đặt này"
   
    confirmAlert({
      title: 'Xác nhận hủy',
      message: message,
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
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h1>Đặt phòng của bạn</h1>
          <Link  style={{ fontSize: '16px', fontStyle: 'italic',marginTop:'5px' }} to="/policy">Xem thêm về chính sách hủy</Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((item, index) => (
            <div key={index} className="flex_div_booking">
              <div className="booking_details">
                <div>Mã đặt phòng: {item._id}</div>
                <div>Khách sạn đặt: {item.hotelName}</div>
                <div>Phòng đặt: {item.roomsDetail}</div>
                <div>Tổng giá: {new Intl.NumberFormat('vi-VN').format(item.totalPrice*1000)} VND</div>
                <div style={{ fontWeight: 'bold' }}>Ngày nhận phòng:  {new Date(item.start).toLocaleString('vi-VN')}</div>
                <div style={{ fontWeight: 'bold' }}>Ngày trả phòng: {subHours(new Date(item.end), 2).toLocaleString('vi-VN')}</div>
                <div>(Thời gian được tính theo múi giờ hiện tại máy của bạn)</div>
                <div style={{ color: item.status === 1 ? 'green' : item.status === 0 ? 'red' : 'blue', fontWeight: 'bold' }}>
                  Tình trạng: {item.status === 1 ? "Thành công" : item.status === 0 ? "Hủy" : "Đang chờ"}
                </div>
                <div>Thông tin liên lạc chỗ nghỉ: {item.hotelContact}</div>



              </div>

              <div style={{ width: '25%', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button className="cancel_booking" onClick={() => handleCancelReserve(item.allDatesReserve, item.roomNumbersId, item._id, item.start, item.end, item.roomTypeIdsReserved,item)}
                  disabled={(new Date() > subHours(new Date(item.start), 0)) || !item.status}>Hủy đặt phòng</button> <br />

                {/* <button className="cancel_booking" onClick={() => handleCancelReserve(item.allDatesReserve, item.roomNumbersId, item._id, item.start, item.end, item.roomTypeIdsReserved)}
                >Hủy đặt phòng</button>  */}
                <br />
                <div style={{ textAlign: 'right' }}>(Bạn sẽ được miễn phí nếu hủy trước thời gian nhận phòng 3 ngày (trước {subHours(new Date(item.start), 24*3).toLocaleString('vi-VN')}))</div>
              </div>

            </div>
          ))
        )}


      </div>


    </div>
  )
}

export default ListBooking
