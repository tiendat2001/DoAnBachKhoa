import React from 'react'
import './listReservation.css'
import { DataGrid } from "@mui/x-data-grid";
import { ReservationColumns } from '../../../datatablesource';
import useFetch from '../../../hooks/useFetch';
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation } from "react-router-dom";
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { DateRange } from "react-date-range";
import { format, addDays, addYears, subYears } from "date-fns";
import { SearchContext } from '../../../context/SearchContext'
import {
    faBed,
    faCalendarDays,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";

const currentDate = new Date();
// để hiện tất cả reservations (khi người dùng chưa lọc theo ngày)
const INITIAL_STATE =
    [
        {
            startDate: subYears(currentDate, 100),
            endDate: addYears(currentDate, 100),
            key: "selection",
        },
    ];


const ListReservation = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const decodedToken = jwtDecode(token);
    const searchContext = useContext(SearchContext);
    const [dates, setDates] = useState(searchContext.dates);
    //date này để lọc trong API query
    const [datesToFilter, setDatesToFilter] = useState(INITIAL_STATE);
    const { data: reservationData, loading: reservationLoading, error: reservationError,
        reFetch: reservationReFetch } = useFetch(`/reservation?idOwnerHotel=${decodedToken.id}&startDay=${datesToFilter[0].startDate}&endDay=${datesToFilter[0].endDate}`);
    const [openDate, setOpenDate] = useState(false);
    
    // đổi giá trị hiển thị trên lịch
    const handleDayChange = (item) => {
        const newSelection = { ...item.selection };
        const { startDate, endDate } = newSelection;
        startDate.setHours(14, 0, 0, 0);
        endDate.setHours(14, 0, 0, 0);
        // dates này để hiển thị lịch trên giao diện
        setDates([{ ...newSelection, startDate, endDate }]);
    };

    // khi bấm lọc mới lưu vào biến trong API query
    const filterByDates = () => {
          //date này để lọc trong API query
        setDatesToFilter(dates);
    }

    const cancelFilterByDates = () => {
        //date này để lọc trong API query
      setDatesToFilter(INITIAL_STATE);
  }

    return (
        <div className="listAdmin">
            <Sidebar />
            {/* css từ adminHome css */}
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="ListReservationAdminContainer">
                    <h2>Đặt phòng</h2>

                    <div style={{display:'flex',justifyContent:'flex-start',gap:"10px",marginBottom:'10px', textAlign:'center'}}>
                        {/* css từ listRoomCLient */}
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

                        <button onClick={filterByDates}>Lọc theo ngày</button>
                        <button onClick={cancelFilterByDates}>Hủy lọc</button>
                        <div style={{fontStyle:'italic'}}>(Lọc theo ngày được tính theo ngày check in của đơn, ví dụ nếu <br/>để khoảng ngày 19 đến 20 sẽ lấy đơn có check in ngày 19 và 20)</div>
                    </div>




                    <DataGrid autoHeight
                        // className="datagrid"
                        rows={reservationData}
                        columns={ReservationColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                        getRowHeight={(params) => params.length > 100 ? 100 : 70} // Xác định chiều cao hàng dựa trên chiều dài của mô tả

                    />
                </div>


            </div>
        </div>

    )
}

export default ListReservation
