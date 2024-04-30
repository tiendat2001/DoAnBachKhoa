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
import { format, addDays, addYears, subYears } from "date-fns";
import { SearchContext } from '../../../context/SearchContext'
import {
    faBed,
    faCalendarDays,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const RoomDetails = () => {
    const location = useLocation();
    const idRoom = location.pathname.split("/")[4];
    const { data: roomTypeData, loading, error } = useFetch(`/rooms/find/${idRoom}`);
    const { data: roomCountStatus, loadingroomCountStatus, errorroomCountStatus } = useFetch(`/rooms/statusRoomCount/${idRoom}`);
    const [openDate, setOpenDate] = useState(false);
    const searchContext = useContext(SearchContext);
    const [dates, setDates] = useState(searchContext.dates);
    const [selectedRoomIdsToDelete, setSelectedRoomIdsToDelete] = useState([]);
    const [key, setKey] = useState(Math.random());

    // check đường dẫn lần trc
    const navigate = useNavigate()
    const previousPath = location.state?.previousPath;
    if (previousPath !== '/admin/rooms') {
        navigate('/admin/rooms');
    }

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

    // tính alldates
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
    const handleSelectChange = (event, roomNumbers) => {
        let roomQuantitySelected = event.target.value;
       
        let updatedSelectedRoomsCopy = [];
       
        roomNumbers.forEach((roomNumber) => {
            if (isAvailable(roomNumber) && updatedSelectedRoomsCopy.length < roomQuantitySelected) {
                updatedSelectedRoomsCopy.push(roomNumber._id);
            }
        });

        setSelectedRoomIdsToDelete(updatedSelectedRoomsCopy);
    };

    const handelCloseRoom = () => {
        
    }
    console.log(selectedRoomIdsToDelete)
    let roomIndex = 0; // Khởi tạo biến đếm
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="detailsRoomTypeContainer">
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

                            <div>Số lượng phòng hiện đang rao bán: {roomIndex}</div>

                            <button onClick={handelCloseRoom}>Xác nhận</button>

                        </div>

                        <div style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '20px' }}>Lịch sử đóng phòng</div>

                        <div className="listRoomClosed">

                        </div>

                    </div>



                </div>

            </div>
        </div>

    )
}

export default RoomDetails
