import React from 'react'
import "./allHotelPayment.css"
import SidebarAdministrator from '../../../components/adminComponents/sidebarAdministrator/SidebarAdministrator'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import useFetch from '../../../hooks/useFetch'
import { DataGrid } from "@mui/x-data-grid";
import { allHotelPaymentColumn } from '../../../datatablesource';
const AllHotelPayment = () => {
  
  const { data: hotelRevenue, loading: hotelRevenueLoading, error: hotelRevenueError, reFetch: hotelRevenueReFetch } = 
  useFetch(`/reservation/getAllRevenueHotel?month=-1`);
  return (
    // css tu AdminHome
    <div className="listAdmin">
      <SidebarAdministrator />
      <div className="listContainerAdmin">
        <NavbarAdmin />

        <div className="listAllHotelRevenue">
          <div style={{fontWeight:'bold'}}>DOANH THU CÁC CHỖ NGHỈ</div>
        <DataGrid autoHeight
                    className="datagridAllHotelRenvenue"  // css từ listRoom.css
                    rows={hotelRevenue}
                    columns={allHotelPaymentColumn}
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

export default AllHotelPayment
