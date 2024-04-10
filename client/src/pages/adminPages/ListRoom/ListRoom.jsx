import React from 'react'
import Sidebar from '../../../components/adminComponents/sidebar/Sidebar'
import NavbarAdmin from '../../../components/adminComponents/navbarAdmin/NavbarAdmin'
import "./listRoom.css"
import { DataGrid } from "@mui/x-data-grid";
import { roomColumns } from '../../../datatablesource';
import useFetch from '../../../hooks/useFetch';
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthContext';
const ListRoom = () => {
    const { user } = useContext(AuthContext) // {user._id}
    const { data: hotelData, loading: hotelLoading, error: hotelError, reFetch: hotelReFetch } = useFetch(`/hotels?ownerId=${user._id}`);
    const [hotelId, setHotelId] = useState(hotelData.length > 0 ? hotelData[0]._id : null);
    const { data: roomData, loading: roomLoading, error: roomError, reFetch: roomReFetch } = useFetch(`/rooms/${hotelId}`);
    const handleHotelChange = (e) => {
        setHotelId(e.target.value);
    };
    useEffect(() => {
        // Gọi roomReFetch khi hotelId thay đổi để load lại dữ liệu phòng mới
        if (hotelId) {
            roomReFetch();
        }
    }, [hotelId]);
    console.log(roomData)
    return (
        <div className="listAdmin">
            <Sidebar />
            <div className="listContainerAdmin">
                <NavbarAdmin />

                <div className="ListRoomAdminContainer">
                    <h2>Your Rooms</h2>
                    <div className="hotelSelectBox">
                        {/* <label>Choose a hotel</label> */}
                        <select
                            id="hotelId"
                            value={hotelId}
                            onChange={handleHotelChange}
                        >
                            <option value="" disabled selected>Chọn khách sạn</option>
                            {hotelLoading
                                ? "loading"
                                : hotelData &&
                                hotelData.map((hotel) => (
                                    <option key={hotel._id} value={hotel._id}>
                                        {hotel.name}
                                    </option>
                                ))}
                        </select>

                    </div>
                  
                </div>
                
            
                <DataGrid autoHeight 
                    className="datagrid"
                        rows={roomData}
                        columns={roomColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                    />
               
            


            </div>
        </div>

    )
}

export default ListRoom
