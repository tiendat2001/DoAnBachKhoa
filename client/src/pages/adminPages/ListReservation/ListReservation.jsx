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
const ListReservation = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const { data: reservationData, loading: reservationLoading, error: reservationError, reFetch: reservationReFetch } = useFetch(`/reservation?idOwnerHotel=${user._id}`);
    return (
        <div className="listAdmin">
            <Sidebar />
            {/* css từ adminHome css */}
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="ListReservationAdminContainer">
                    <h2>Đặt phòng</h2>

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
