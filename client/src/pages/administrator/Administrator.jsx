import React from 'react'
import './administrator.css'
import SidebarAdministrator from '../../components/adminComponents/sidebarAdministrator/SidebarAdministrator'
import NavbarAdmin from '../../components/adminComponents/navbarAdmin/NavbarAdmin'
import { DataGrid } from "@mui/x-data-grid";
import { RenenueAllHotelColumn } from '../../datatablesource';
import useFetch from '../../hooks/useFetch';
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation } from "react-router-dom";
const Administrator = () => {

  const { data: hotelRevenue, loading: hotelRevenueLoading, error: hotelRevenueError, reFetch: hotelRevenueReFetch } = 
  useFetch(`/reservation/getAllRevenueHotel`);

  return (
    // css tu AdminHome
    <div className="listAdmin">
      <SidebarAdministrator />
      <div className="listContainerAdmin">
        <NavbarAdmin />
        {/* <h1>bang</h1> */}

        <div className="listAllHotelRevenue">
        <DataGrid autoHeight
                    className="datagrid"
                    rows={hotelRevenue}
                    columns={RenenueAllHotelColumn}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    getRowId={(row) => row.hotelId}
                />
        </div>

      </div>
    </div>
  )
}

export default Administrator
