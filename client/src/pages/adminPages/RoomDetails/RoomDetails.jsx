import React from 'react'
import './roomDetails.css'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useContext, } from "react";
import useFetch from '../../../hooks/useFetch';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { SearchContext } from '../../../context/SearchContext'
import { format, addDays, subDays, subHours } from "date-fns";

import {
    faBed,
    faCalendarDays,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";

const RoomDetails = () => {
    const location = useLocation();
    // id RoomType
    const idRoom = location.pathname.split("/")[4];
    const { data: roomTypeData, loading, error, reFetch: roomTypeDataReFetch } = useFetch(`/rooms/find/${idRoom}`);
    const { data: roomCountStatus, loading: loadingroomCountStatus,
        error: errorroomCountStatus, reFetch: reFetchRoomCountStatus } = useFetch(`/rooms/statusRoomCount/${idRoom}`);
    const { data: roomCloseData, loading: loadingroomCloseData,
        error: errorroomCloseData, reFetch: roomCloseDataReFetch } = useFetch(`/closedRoom`);
    const [openDate, setOpenDate] = useState(false);
    const searchContext = useContext(SearchContext);
    const [dates, setDates] = useState(searchContext.dates);
    const [selectedRoomIdsToDelete, setSelectedRoomIdsToDelete] = useState([]);
    const [key, setKey] = useState(Math.random());
    const [roomQuantityToClose, setRoomQuantityToClose] = useState();
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const decodedToken = jwtDecode(token);
    const { user } = useContext(AuthContext) // {user._id}
    // check đường dẫn lần trc
    const navigate = useNavigate()
    const previousPath = location.state?.previousPath;
    // console.log(previousPath)
    if (previousPath !== '/admin/rooms') {
        navigate('/admin/rooms');
    }
    console.log(roomCloseData)

    // RIÊNG HÀM NÀY Ở ĐÂY SẼ TÍNH CẢ NGÀY CUỐI, VÍ DỤ NGÀY 17-19 THÌ ALLDATES LÀ 17,18,19
    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start.getTime());
        const dates = [];
        while (date <= end) {
            dates.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };
    // tính alldates Close
    const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);
    // console.log(alldates)
    const handleDayChange = (item) => {
        const newSelection = { ...item.selection };
        const { startDate, endDate } = newSelection;
        startDate.setHours(14, 0, 0, 0);
        endDate.setHours(14, 0, 0, 0);
        setDates([{ ...newSelection, startDate, endDate }]);
        setKey(Math.random()); // Bắt reload lại phần chọn phòng
        setSelectedRoomIdsToDelete([])
    };
    // console.log(dates)

    // phần đóng phòng
    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((date) => {
            const dateMinusOneDay = new Date(date).getTime();
            return alldates.includes(dateMinusOneDay);
        });

        return !isFound;
    };

    // thay doi so luong phong dong
    let updatedSelectedRoomToClose = [];
    const handleSelectChange = (event, roomNumbers) => {
        // lấy lựa chọn trong select
        let roomQuantitySelected = event.target.value;
        setRoomQuantityToClose(roomQuantitySelected)
        updatedSelectedRoomToClose = [];


    };
    // khi ấn xác nhận đóng phòng
    const handelCloseRoom = async () => {
        // const response = await fetch(`/rooms/find/${idRoom}`);
        // const reFreshRoomTypeData = await response.json();
        // reFreshRoomTypeData.roomNumbers.forEach((roomNumber) => {
        //     if (isAvailable(roomNumber) && updatedSelectedRoomToClose.length < roomQuantityToClose) {
        //         // đẩy vào mảng _id của phòng hợp lệ để đóng
        //         updatedSelectedRoomToClose.push(roomNumber._id);
        //     }
        // });

        // // setSelectedRoomIdsToDelete(updatedSelectedRoomsCopy);
        // console.log(updatedSelectedRoomToClose)

        // try {
        //      await Promise.all(
        //       updatedSelectedRoomToClose.map(async (roomId) => {
        //         try {
        //           const res = await axios.put(`/rooms/availability/${roomId}`, {
        //             dates: alldates,
        //             startDateRange:dates[0].startDate,
        //             endDateRange: addDays(dates[0].endDate,1) // cần cộng 1 ngày do riêng đóng phòng tính cả ngày cuối
        //           });

        //           return res.data;
        //         } catch (error) {
        //           console.log(`Error in room ${roomId}:`, error);
        //           throw error; // Ném lỗi để kích hoạt catch bên ngoài và dừng quá trình xử lý
        //         }
        //       })
        //     );
        //   } catch (err) {
        //     console.log(err)
        //     alert("Có lỗi xảy ra vui lòng quay lại trang trước và đặt phòng lại")
        //     return; // Ngưng thực thi hàm nếu có lỗi
        //   }


        // tạo lịch sử đóng phòng
        try {
            const upload = axios.post(`/closedRoom/${idRoom}`, {
                ownerId: decodedToken.id,
                roomTypeId: idRoom,
                startClose: dates[0].startDate,
                endClose: dates[0].endDate, // cái này chỉ hiển thị ra bảng lịch sử đóng phòng sẽ là đến hết ngày ( ko cộng 1)
                quantityRoomClosed: roomQuantityToClose,
                allDatesClosed: alldates,
            });
        } catch (err) {
            console.log(err)
            return;
        }
        toast.success('Đóng phòng thành công');

        // HÀM HỦY PHÒNG NHỚ +1 VÀO ENDdATE
        //   setKey(Math.random()); // Bắt reload phần đóng phòng
        roomTypeDataReFetch()
        reFetchRoomCountStatus()
    }
    const handleCancelCloseRoom = async () => {

    }
    // console.log(selectedRoomIdsToDelete)
    let roomIndex = 0; // Khởi tạo biến đếm
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div key={key} className="detailsRoomTypeContainer">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Loại phòng: {roomTypeData.title} (tổng số lượng phòng: {roomTypeData.roomNumbers?.length})</div>
                        <button onClick={() => navigate(`/admin/rooms/smallRoomDetails/modifyRoomCount/${idRoom}`, { state: { previousPath: '/admin/rooms/smallRoomDetails' } })}>Chỉnh số lượng phòng</button>

                    </div>

                    <div style={{ fontWeight: 'bold' }}>
                        Số lượng phòng đang rao bán trong 30 ngày tới

                    </div>
                    <div className="tableRoomStatus">
                        <div className="grid-container">
                            {roomCountStatus.map((status, index) => (
                                <div className="grid-item" key={index}>
                                    <div>{`${status.day}/${status.month}/${status.year}`}</div>
                                    <div>Phòng rao bán: {status.countAvailable}</div>
                                    <div style={{ color: roomTypeData.roomNumbers && roomTypeData.roomNumbers?.length - status.countAvailable !== 0 ? 'red' : 'inherit', fontWeight: roomTypeData.roomNumbers && roomTypeData.roomNumbers?.length - status.countAvailable !== 0 ? 'bold' : 'normal' }}>
                                        Đã bán hoặc đóng: {roomTypeData.roomNumbers?.length - status.countAvailable}

                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="closeRoomContainer">
                        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Đóng phòng</div>
                        <div style={{ fontStyle: 'italic', marginBottom: '10px' }}>(Bạn có thể đóng 1 số lượng phòng vào 1 số ngày nhất định)</div>

                        {/* css từ listRoomClient */}
                        <div className="selectRoomClose">

                            <div style={{ width: '20%' }} className="headerSearchHotel">
                                <FontAwesomeIcon icon={faCalendarDays} className="headerIconHotel" />
                                <span onClick={() => setOpenDate(!openDate)}>{`${format(
                                    dates[0].startDate,
                                    "dd/MM/yyyy"
                                )} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}</span>
                                {openDate && (
                                    <DateRange
                                        onChange={(item) => handleDayChange(item)}
                                        // minDate={new Date()}
                                        ranges={dates}
                                        moveRangeOnFirstSelection={false}
                                        editableDateInputs={true}
                                        className="date"
                                    />
                                )}
                            </div>

                            {/* hiện ds số lượng phòng */}
                            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div>Số lượng phòng muốn đóng:  </div>

                                <select style={{ height: '20px' }} onChange={(event) => handleSelectChange(event, roomTypeData.roomNumbers)}>
                                    <option value={0}>0 phòng</option>
                                    {(() => {
                                        // let roomIndex = 0; // Khởi tạo biến đếm
                                        return roomTypeData.roomNumbers?.map((roomNumber, index) => {
                                            if (isAvailable(roomNumber)) {
                                                roomIndex++; // Tăng giá trị biến đếm khi phòng thỏa mãn điều kiện
                                                return (
                                                    <option key={roomNumber._id} value={roomIndex}>
                                                        {`${roomIndex} phòng`}
                                                    </option>
                                                );
                                            }
                                            return null;
                                        });
                                    })()}
                                </select>
                            </div>

                            <div>Số lượng phòng hiện đang rao bán (có thể đóng): {roomIndex}</div>

                            <button onClick={handelCloseRoom}>Xác nhận</button>

                        </div>

                        <div style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '20px' }}>Lịch sử đóng phòng</div>

                        <div className="listRoomClosed">
                            {/* hàng tiêu đề */}
                            <div style={{ backgroundColor: '#ccc' }} className="roomCloseContainer">
                                <div className="roomClose">STT</div>
                                <div className="roomClose">Đóng từ ngày</div>
                                <div className="roomClose">Đến hết ngày</div>
                                <div className="roomClose">Số lượng phòng đóng</div>
                                <div style={{ width: '20%' }} className="roomClose" >Hành động</div>
                            </div>

                            {roomCloseData?.map((roomClose, index) => (
                        <div key={index} className="roomCloseContainer">
                            <div className="roomClose">{index + 1}</div>
                            <div className="roomClose">{new Date(new Date(roomClose.startClose)).toLocaleDateString('vi-VN')}</div>
                            <div className="roomClose">{new Date(new Date(roomClose.endClose)).toLocaleDateString('vi-VN')}</div>
                            <div className="roomClose">{roomClose.quantityRoomClosed}</div>
                            <button style={{ width: '20%' }} className="roomNumber"  onClick={() => handleCancelCloseRoom()}>MỞ LẠI</button>
                        </div>
                    ))}
                        </div>

                    </div>



                </div>

            </div>
        </div>

    )
}

export default RoomDetails
