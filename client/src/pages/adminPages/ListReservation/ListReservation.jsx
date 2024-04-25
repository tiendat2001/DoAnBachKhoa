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
import { format, } from "date-fns";
import { SearchContext } from '../../../context/SearchContext'
import {
    faBed,
    faCalendarDays,
    faPerson,
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListReservation = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const searchContext = useContext(SearchContext);
    const [dates, setDates] = useState(searchContext.dates);

    const { data: reservationData, loading: reservationLoading, error: reservationError, 
reFetch: reservationReFetch } = useFetch(`/reservation?idOwnerHotel=${user._id}&startDay=${dates[0].startDate}&endDay=${dates[0].endDate}`);
    const [openDate, setOpenDate] = useState(false);

    const handleDayChange = (item) => {
        const newSelection = { ...item.selection };
        const { startDate, endDate } = newSelection;
        startDate.setHours(14, 0, 0, 0);
        endDate.setHours(14, 0, 0, 0);
        setDates([{ ...newSelection, startDate, endDate }]);
        console.log(dates)

    };


    return (
        <div className="listAdmin">
            <Sidebar />
            {/* css từ adminHome css */}
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="ListReservationAdminContainer">
                    <h2>Đặt phòng</h2>

                    <div style={{ width: '30%' }} className="headerSearchHotel">

                        <FontAwesomeIcon icon={faCalendarDays} className="headerIconHotel" />

                        <span onClick={() => setOpenDate(!openDate)}>{`${format(
                            dates[0].startDate,
                            "MM/dd/yyyy"
                        )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
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
