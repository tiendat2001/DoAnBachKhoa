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

    const handleDayChange = (item) => {
        const newSelection = { ...item.selection };
        const { startDate, endDate } = newSelection;
        startDate.setHours(14, 0, 0, 0);
        endDate.setHours(14, 0, 0, 0);
        // dates này để hiển thị lịch trên giao diện
        setDates([{ ...newSelection, startDate, endDate }]);
    };
    console.log(dates)
    // console.log(roomTypeData)
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="detailsRoomTypeContainer">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Loại phòng: {roomTypeData.title} (tổng số lượng phòng: {roomTypeData.roomNumbers?.length})</div>
                        <Link
                            to={`/admin/rooms/smallRoomDetails/modifyRoomCount/${idRoom}`}
                            style={{ textDecoration: "none" }}
                        >
                            <button>Chỉnh số lượng phòng</button>
                        </Link>

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
                        <div style={{ fontWeight: 'bold', fontSize:'20px' }}>Đóng phòng</div>
                        <div style={{fontStyle:'italic', marginBottom:'10px'}}>(Bạn có thể đóng 1 số lượng phòng vào 1 số ngày nhất định)</div>
                        
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
                    </div>



                </div>

            </div>
        </div>

    )
}

export default RoomDetails
