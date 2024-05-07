import React from 'react'
import "./allHotelPayment.css"
import SidebarAdministrator from '../../../components/adminComponents/sidebarAdministrator/SidebarAdministrator'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import useFetch from '../../../hooks/useFetch'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { allHotelPaymentColumn } from '../../../datatablesource';
const AllHotelPayment = () => {
  
  const { data: hotelRevenue, loading: hotelRevenueLoading, error: hotelRevenueError, reFetch: hotelRevenueReFetch } = 
  useFetch(`/reservation/getAllPaymentAccount`);
  return (
    // css tu AdminHome
    <div className="listAdmin">
      <SidebarAdministrator />
      <div className="listContainerAdmin">
        <NavbarAdmin />

        <div className="listAllHotelPayment">
          <div style={{fontWeight:'bold'}}>KHOẢN CẦN THANH TOÁN CHO CÁC CHỦ CHỖ NGHỈ TRONG THÁNG TRƯỚC</div>
        <DataGrid  autoHeight slots={{ toolbar: GridToolbar }}
                    className="datagridListAllHotelPayment"  
                    rows={hotelRevenue}
                    columns={allHotelPaymentColumn}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    getRowId={(row) => row.idOwnerHotel}
                />
        </div>
        

      </div>
    </div>
  )
}

export default AllHotelPayment
